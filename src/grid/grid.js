import {customElement, TaskQueue, useView, bindable, inject, BindingEngine,
  processContent, TargetInstruction, ViewCompiler, ViewSlot, ViewResources,
  Container, bindingMode} from 'aurelia-framework';
import {processUserTemplate} from './proccess-user-template';
import {ColumnDefinitionFactory} from '../column/column-definition-factory';
import {StoreManager} from '../store/store-manager';
import {customElementHelper} from 'utils';

@customElement('grid')
@processContent(processUserTemplate)
@inject(Element, ViewCompiler, ViewResources, Container, TargetInstruction, BindingEngine, TaskQueue)
export class Grid {

  /* == Styling == */
  @bindable height = null;

  // Filtering
  @bindable showFilters = false;
  @bindable filterable = true;
  @bindable filterDebounce = 500;

  // Sortination
  @bindable sortable = true;
  @bindable({defaultBindingMode: bindingMode.twoWay}) sortOptions = undefined;

  // Column defs
  @bindable showColumnHeaders = true;
  columnHeaders = [];
  columns = [];
  @bindable columnsMetadata = null;

  // Selection
  @bindable selection = false; // single-withDeselect || single-noDeselect || multiselect-withDeselect || multiselect-noDeselect
  @bindable selectedItem = undefined;
  lastSelectedItem = undefined;
  isSingleSelect = true;
  isWithDeselect = true;

  // Misc
  @bindable noRowsMessage = '';

  // Data ....
  @bindable read = null;
  @bindable data = null;
  @bindable autoLoad = true;
  loading = false;
  @bindable loadingMessage = 'Loading...';
  rowData = [];

  // Pagination
  @bindable pageable = false;
  @bindable pageSize = 10;
  @bindable pagerSize = 10;
  @bindable page = 1;
  @bindable showFirstLastButtons = true;
  @bindable showJumpButtons = true;
  @bindable showPageSizeBox = true;
  @bindable showPagingSummary = true;
  @bindable pageSizes = [10, 25, 50];


  // Subscription handling
  unbinding = false;

  // Visual
  // TODO: calc scrollbar width using browser
  scrollBarWidth = 16;

  constructor(element, vc, vr, container, targetInstruction, bindingEngine, taskQueue) {
    this.element = element;
    // Services
    this.viewCompiler = vc;
    this.viewResources = vr;
    this.container = container;
    this.bindingEngine = bindingEngine;
    this.taskQueue = taskQueue;
    const gridDefinition = targetInstruction.behaviorInstructions[0].gridDefinition;
    this.rowAttrs = gridDefinition.rowAttrs;
    this.columnDefinitionFactory = new ColumnDefinitionFactory(gridDefinition, this);
    this.pageable = gridDefinition.paginationAttrs;
  }

  bind(bindingContext, overrideContext) {
    this.parent = bindingContext;

    if (this.columnsMetadata === null) {
      this.columns = this.columnDefinitionFactory.create();
    } else {
      this.columns = this.columnDefinitionFactory.create(this.columnsMetadata);
    }

    this.storeManager = new StoreManager(this);

    if (this.sortOptions !== undefined) {
      let maxColumnId = this.columns[this.columns.length - 1].id;
      // assert sort options contract
      this.sortOptions.forEach(sortOption => {
        let isValidColumnId = sortOption.columnId >= 1 && sortOption.columnId <= maxColumnId;
        if (isValidColumnId === false) {
          throw new Error(`Invalid column id: ${sortOption.columnId}. Column Id should be an integer number between 1 and ${maxColumnId}.`);
        }

        let isValidSortDirection = sortOption.sortDirection === 'asc' || sortOption.sortDirection === 'desc';
        if (isValidSortDirection === false) {
          throw new Error(`Invalid sort direction: '${sortOption.sortDirection}'. Sort direction should be one of the following: 'asc', 'desc' or undefined.`);
        }
      });

      // Apply sort options (cached)
      let sorts = this.sortOptions.map(sortOption => {
        let column = this.columns[sortOption.columnId - 1];
        let sort = column.setSortDirection(sortOption.sortDirection);

        return sort;
      });

      this.storeManager.getDataStore().applySortOptions(sorts);
    }

    // Listen for window resize so we can re-flow the grid layout
    this.resizeListener = (() => {
      if (this.height === 'auto') {
        this.syncGridHeight();
      }

      this.syncColumnHeadersWithColumns();
    }).bind(this);
    window.addEventListener('resize', this.resizeListener);


    // The table body element will host the rows
    var tbody = this.element.querySelector('table>tbody');
    this.viewSlot = new ViewSlot(tbody, true, this);

    // Get the row template too and add a repeater
    var row = tbody.querySelector('tr');
    this._addRowAttributes(row);

    this.rowTemplate = document.createDocumentFragment();
    this.rowTemplate.appendChild(row);

    this._buildTemplates(bindingContext, overrideContext);

    if (this.selection !== false) {
      if (this.selection.indexOf('noDeselect') > -1) {
        this.isWithDeselect = false;
      }
      if (this.selection.indexOf('multiselect') > -1) {
        this.isSingleSelect = false;
      }
    }

    this.selectedItemChanged(this.selectedItem);
  }

  attached() {
    this.canLoadData = true;
    this._height = this.height;
    if (this.height === 'auto') {
      this.syncGridHeight();
    }

    this.heightChanged();

    if (this.autoLoad) {
      this.refresh();
    }

    if (this.pageable === true) {
      this.storeManager.getDataStore().setPager(this.pager);
    }
  }

  _addRowAttributes(row) {
    row.setAttribute('repeat.for', '$item of rowData');
    // Copy any user specified row attributes to the row template
    for (var prop in this.rowAttrs) {
      if (this.rowAttrs.hasOwnProperty(prop)) {
        row.setAttribute(prop, this.rowAttrs[prop]);
      }
    }
  }

  _buildTemplates(bindingContext, overrideContext) {
    // Create a fragment we will manipulate the DOM in
    let rowTemplate = this.rowTemplate.cloneNode(true);
    let row = rowTemplate.querySelector('tr');

    // Create the columns
    this.columns
      .map(c => c.createDOMElement())
      .forEach(row.appendChild.bind(row));

    let overrideBindingContext = {
      bindingContext: this,
      parentOverrideContext: {
        bindingContext: bindingContext,
        parentOverrideContext: overrideContext
      }
    };

    // Now compile the row template
    let view = this.viewCompiler.compile(rowTemplate, this.viewResources).create(this.container);
    view.bind(this, overrideBindingContext);

    // based on viewSlot.swap() from templating 0.16.0
    let removeResponse = this.viewSlot.removeAll();
    if (removeResponse instanceof Promise) {
      removeResponse.then(() => this.viewSlot.add(view));
    }

    this.viewSlot.add(view);
    this.viewSlot.attached();

    // HACK: why is the change handler not firing for noRowsMessage?
    this.noRowsMessageChanged();
  }

  unbind() {
    this.unbinding = true;
    window.removeEventListener('resize', this.resizeListener);
    this.columns.forEach(c => c.unsubscribe());
    this.storeManager.unsubscribe();
  }

  // call function from parent context where grid is composed
  call(funcName, ...params) {
    this.parent[funcName].apply(this.parent, params);
  }

  changeSort(sort) {
    let sortOrder = this.storeManager.getDataStore().changeSortProcessingOrder(sort);
    this.sortOptions = sortOrder.map(sort => {
      let sortOption = {
        columnId: sort.column.id,
        sortDirection: sort.value
      };
      return sortOption;
    });

    this.refresh();
  }


  // todo: use custonm element utils
  debounce(func, wait) {
    var timeout;

    // the debounced function
    return function() {
      var context = this,
        args = arguments;

      // nulls out timer and calls original function
      var later = function() {
        timeout = null;
        func.apply(context, args);
      };

      // restart the timer to call last function
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  updateFilters() {
    // Debounce
    if (!this.debouncedUpdateFilters) {
      this.debouncedUpdateFilters = this.debounce(this.refresh, this.filterDebounce || 100);
    }

    this.debouncedUpdateFilters();
  }

  /* === Data === */
  refresh() {
    if (this.canLoadData === true) {
      this.loading = true;
      this.storeManager.getDataStore().getData().then(data => {
        // todo: enable case for empty column?
        //this.checkData(result.data);
        this.rowData = data;
        this.loading = false;

        this.taskQueue.queueTask(() => this.syncColumnHeadersWithColumns());
      });
    }
  }

  checkData(data) {
    data.forEach(d => {
      this.columns.forEach(c => {
        let propName = c.getFieldName();
        if (d[propName] === undefined) {
          console.error(d, c);
          throw new Error(`Data must have property named: ${propName}`);
        }
      });
    });
  }

  /* === Change handlers === */
  rowClicked($item) {
    if (this.selection !== false) {
      if ($item._selected === true && this.isWithDeselect) {
        this.deselectRow($item);
      } else {
        this.selectRow($item);
      }
    }
  }

  selectRow($item, noEventNeeded) {
    if (!$item.id) {
      return;
    }

    if ($item === this.lastSelectedItem && !this.isWithDeselect) {
      return;
    }

    if (this.isSingleSelect && this.lastSelectedItem !== undefined) {
      this.deselectRow(this.lastSelectedItem, noEventNeeded);
    }

    $item._selected = true;
    this.lastSelectedItem = $item;

    if (noEventNeeded !== true) {
      customElementHelper.dispatchEvent(this.element, 'select-grid-row', {
        $item: $item
      });
    }
  }

  deselectRow($item, noEventNeeded) {
    if (!$item.id) {
      return;
    }

    $item._selected = false;

    if (noEventNeeded !== true && this.isWithDeselect) {
      customElementHelper.dispatchEvent(this.element, 'deselect-grid-row', {
        $item: $item
      });
    }
  }

  selectedItemChanged(newValue, oldValue) {
    // todo: fix for multiselect
    if (newValue === oldValue) {
      return;
    }

    if (newValue && newValue.id) {
      if (newValue !== this.lastSelectedItem) {
        this.selectRow(newValue, true);

        this.taskQueue.queueMicroTask((() => {
          let row = this.element.querySelector('tr.table-info');
          if (row !== null) {
            row.scrollIntoView();
          }
        }).bind(this));
      } else {
        // row is already clicked
      }
    } else {
      if (this.lastSelectedItem !== undefined) {
        this.deselectRow(this.lastSelectedItem, true);
      }
    }
  }

  pageChanged(page, oldValue) {
    if (page !== oldValue) {
      this.page = Number(page);
      this.storeManager.getDataStore().setPage(page);
      this.refresh();
    }
  }

  pageSizeChanged(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.storeManager.getDataStore().setPageSize(newValue);
      this.pageChanged(1);
    }
  }

  noRowsMessageChanged() {
    this.showNoRowsMessage = this.noRowsMessage !== '';
  }

  heightChanged() {
    var cont = this.element.querySelector('.grid-content-container');

    if (this.height === 'auto' || window.isNaN(window.Number(this._height)) === false) {
      cont.setAttribute('style', `height: ${this._height}px`);
    } else {
      cont.removeAttribute('style');
    }
  }

  /* === Visual === */
  syncGridHeight() {
    if (this.height === 'auto') {
      this.element.style.overflowY = 'hidden';
    }

    const headerTable = this.element.querySelector('table.grid-header-table');
    const headerHeight = headerTable.offsetHeight;
    const gridFooter = this.element.querySelector('grid-footer-container');
    let gridFooterHeight = 0;
    if (gridFooter !== null) {
      gridFooterHeight = gridFooter.offsetHeight;
    }

    const gridContainerTopAndBottomBorderWidth = 2;
    // todo: fix - error in build
    this._height = this.element.parentElement.clientHeight - headerHeight - gridFooterHeight - gridContainerTopAndBottomBorderWidth;
    this.heightChanged();
  }

  syncColumnHeadersWithColumns() {
    // todo: find if there is need for filters to be synced too
    let headers = this.element.querySelectorAll('table>thead>tr:first-child>th');
    let filters = this.element.querySelectorAll('table>thead>tr:last-child>th');
    let cells = this.element.querySelectorAll('table>tbody>tr:first-child>td'); // first row is enough
    let isOverflowing = this.isBodyOverflowing();

    // set initially the min-width attribute to both tables
    this._syncHeadersAndCellsMinWidth(headers, filters, cells, isOverflowing);

    // todo: remove this hack if possible
    // run algorithm for syncing 5 times...
    for (let i = 0; i < 5; i++) {
      this._syncHeadersAndCellsWidth(headers, filters, cells, isOverflowing);
    }
  }

  _syncHeadersAndCellsMinWidth(headers, filters, cells, isOverflowing) {
    for (let i = 0; i < headers.length; i++) {
      let header = headers[i];
      let filter = filters[i];
      let cell = cells[i];

      if (cell && header && filter) {
        let columnMinWidth = cell.getAttribute('min-width');// || cell.getAttribute('width');
        if (columnMinWidth) {
          columnMinWidth = parseInt(columnMinWidth);

          let headerMinWidth = columnMinWidth;
          if ((i === headers.length - 1) && isOverflowing) {
            headerMinWidth += this.scrollBarWidth;
          }

          if (cell.offsetWidth < columnMinWidth || header.offsetWidth < headerMinWidth || filter.offsetWidth < headerMinWidth) {
            header.style.minWidth = `${headerMinWidth}px`;
            filter.style.minWidth = `${headerMinWidth}px`;
            cell.style.minWidth = `${columnMinWidth}px`;
          }
        }
      }
    }
  }

  _syncHeadersAndCellsWidth(headers, filters, cells, isOverflowing) {
    for (let i = 0; i < headers.length; i++) {
      let header = headers[i];
      let filter = filters[i];
      let cell = cells[i];

      if (cell && header && filter) {
        let columnWidth = cell.getAttribute('width');
        if (columnWidth) {
          columnWidth = parseInt(columnWidth);
        } else {
          columnWidth = cell.offsetWidth;
        }

        let headerWidth = columnWidth;
        if ((i === headers.length - 1) && isOverflowing) {
          headerWidth += this.scrollBarWidth;
        }

        // Make the header the same width as the cell...
        header.style.width = `${headerWidth}px`;
        filter.style.width = `${headerWidth}px`;
        cell.style.width = `${columnWidth}px`;
      }
    }
  }

  isBodyOverflowing() {
    var body = this.element.querySelector('.grid-content-container');
    return body.offsetHeight < body.scrollHeight || body.offsetWidth < body.scrollWidth;
  }
}

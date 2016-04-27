var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import { customElement, TaskQueue, useView, bindable, inject, BindingEngine, processContent, TargetInstruction, ViewCompiler, ViewSlot, ViewResources, Container, bindingMode } from 'aurelia-framework';
import { processUserTemplate } from './proccess-user-template';
import { ColumnDefinitionFactory } from '../column/column-definition-factory';
import { StoreManager } from '../store/store-manager';
import { customElementHelper } from 'utils';

export let Grid = (_dec = customElement('grid'), _dec2 = processContent(processUserTemplate), _dec3 = inject(Element, ViewCompiler, ViewResources, Container, TargetInstruction, BindingEngine, TaskQueue), _dec4 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = class Grid {

  constructor(element, vc, vr, container, targetInstruction, bindingEngine, taskQueue) {
    _initDefineProp(this, 'height', _descriptor, this);

    _initDefineProp(this, 'showFilters', _descriptor2, this);

    _initDefineProp(this, 'filterable', _descriptor3, this);

    _initDefineProp(this, 'filterDebounce', _descriptor4, this);

    _initDefineProp(this, 'sortable', _descriptor5, this);

    _initDefineProp(this, 'sortOptions', _descriptor6, this);

    _initDefineProp(this, 'showColumnHeaders', _descriptor7, this);

    this.columnHeaders = [];
    this.columns = [];

    _initDefineProp(this, 'columnsMetadata', _descriptor8, this);

    _initDefineProp(this, 'selection', _descriptor9, this);

    _initDefineProp(this, 'selectedItem', _descriptor10, this);

    this.lastSelectedItem = undefined;
    this.isSingleSelect = true;
    this.isWithDeselect = true;

    _initDefineProp(this, 'noRowsMessage', _descriptor11, this);

    _initDefineProp(this, 'read', _descriptor12, this);

    _initDefineProp(this, 'data', _descriptor13, this);

    _initDefineProp(this, 'autoLoad', _descriptor14, this);

    this.loading = false;

    _initDefineProp(this, 'loadingMessage', _descriptor15, this);

    this.rowData = [];

    _initDefineProp(this, 'pageable', _descriptor16, this);

    _initDefineProp(this, 'pageSize', _descriptor17, this);

    _initDefineProp(this, 'pagerSize', _descriptor18, this);

    _initDefineProp(this, 'page', _descriptor19, this);

    _initDefineProp(this, 'showFirstLastButtons', _descriptor20, this);

    _initDefineProp(this, 'showJumpButtons', _descriptor21, this);

    _initDefineProp(this, 'showPageSizeBox', _descriptor22, this);

    _initDefineProp(this, 'showPagingSummary', _descriptor23, this);

    _initDefineProp(this, 'pageSizes', _descriptor24, this);

    this.unbinding = false;
    this.scrollBarWidth = 16;

    this.element = element;

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

      this.sortOptions.forEach(sortOption => {
        let isValidColumnId = sortOption.columnId >= 1 && sortOption.columnId <= maxColumnId;
        if (isValidColumnId === false) {
          throw new Error(`Invalid column id: ${ sortOption.columnId }. Column Id should be an integer number between 1 and ${ maxColumnId }.`);
        }

        let isValidSortDirection = sortOption.sortDirection === 'asc' || sortOption.sortDirection === 'desc';
        if (isValidSortDirection === false) {
          throw new Error(`Invalid sort direction: '${ sortOption.sortDirection }'. Sort direction should be one of the following: 'asc', 'desc' or undefined.`);
        }
      });

      let sorts = this.sortOptions.map(sortOption => {
        let column = this.columns[sortOption.columnId - 1];
        let sort = column.setSortDirection(sortOption.sortDirection);

        return sort;
      });

      this.storeManager.getDataStore().applySortOptions(sorts);
    }

    this.resizeListener = (() => {
      if (this.height === 'auto') {
        this.syncGridHeight();
      }

      this.syncColumnHeadersWithColumns();
    }).bind(this);
    window.addEventListener('resize', this.resizeListener);

    var tbody = this.element.querySelector('table>tbody');
    this.viewSlot = new ViewSlot(tbody, true, this);

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

    for (var prop in this.rowAttrs) {
      if (this.rowAttrs.hasOwnProperty(prop)) {
        row.setAttribute(prop, this.rowAttrs[prop]);
      }
    }
  }

  _buildTemplates(bindingContext, overrideContext) {
    let rowTemplate = this.rowTemplate.cloneNode(true);
    let row = rowTemplate.querySelector('tr');

    this.columns.map(c => c.createDOMElement()).forEach(row.appendChild.bind(row));

    let overrideBindingContext = {
      bindingContext: this,
      parentOverrideContext: {
        bindingContext: bindingContext,
        parentOverrideContext: overrideContext
      }
    };

    let view = this.viewCompiler.compile(rowTemplate, this.viewResources).create(this.container);
    view.bind(this, overrideBindingContext);

    let removeResponse = this.viewSlot.removeAll();
    if (removeResponse instanceof Promise) {
      removeResponse.then(() => this.viewSlot.add(view));
    }

    this.viewSlot.add(view);
    this.viewSlot.attached();

    this.noRowsMessageChanged();
  }

  unbind() {
    this.unbinding = true;
    window.removeEventListener('resize', this.resizeListener);
    this.columns.forEach(c => c.unsubscribe());
    this.storeManager.unsubscribe();
  }

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

  debounce(func, wait) {
    var timeout;

    return function () {
      var context = this,
          args = arguments;

      var later = function () {
        timeout = null;
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  updateFilters() {
    if (!this.debouncedUpdateFilters) {
      this.debouncedUpdateFilters = this.debounce(this.refresh, this.filterDebounce || 100);
    }

    this.debouncedUpdateFilters();
  }

  refresh() {
    if (this.canLoadData === true) {
      this.loading = true;
      this.storeManager.getDataStore().getData().then(data => {
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
          throw new Error(`Data must have property named: ${ propName }`);
        }
      });
    });
  }

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
      } else {}
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
      cont.setAttribute('style', `height: ${ this._height }px`);
    } else {
      cont.removeAttribute('style');
    }
  }

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

    this._height = this.element.parentElement.clientHeight - headerHeight - gridFooterHeight - gridContainerTopAndBottomBorderWidth;
    this.heightChanged();
  }

  syncColumnHeadersWithColumns() {
    let headers = this.element.querySelectorAll('table>thead>tr:first-child>th');
    let filters = this.element.querySelectorAll('table>thead>tr:last-child>th');
    let cells = this.element.querySelectorAll('table>tbody>tr:first-child>td');
    let isOverflowing = this.isBodyOverflowing();

    this._syncHeadersAndCellsMinWidth(headers, filters, cells, isOverflowing);

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
        let columnMinWidth = cell.getAttribute('min-width');
        if (columnMinWidth) {
          columnMinWidth = parseInt(columnMinWidth);

          let headerMinWidth = columnMinWidth;
          if (i === headers.length - 1 && isOverflowing) {
            headerMinWidth += this.scrollBarWidth;
          }

          if (cell.offsetWidth < columnMinWidth || header.offsetWidth < headerMinWidth || filter.offsetWidth < headerMinWidth) {
            header.style.minWidth = `${ headerMinWidth }px`;
            filter.style.minWidth = `${ headerMinWidth }px`;
            cell.style.minWidth = `${ columnMinWidth }px`;
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
        if (i === headers.length - 1 && isOverflowing) {
          headerWidth += this.scrollBarWidth;
        }

        header.style.width = `${ headerWidth }px`;
        filter.style.width = `${ headerWidth }px`;
        cell.style.width = `${ columnWidth }px`;
      }
    }
  }

  isBodyOverflowing() {
    var body = this.element.querySelector('.grid-content-container');
    return body.offsetHeight < body.scrollHeight || body.offsetWidth < body.scrollWidth;
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'height', [bindable], {
  enumerable: true,
  initializer: function () {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'showFilters', [bindable], {
  enumerable: true,
  initializer: function () {
    return false;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'filterable', [bindable], {
  enumerable: true,
  initializer: function () {
    return true;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'filterDebounce', [bindable], {
  enumerable: true,
  initializer: function () {
    return 500;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'sortable', [bindable], {
  enumerable: true,
  initializer: function () {
    return true;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'sortOptions', [_dec4], {
  enumerable: true,
  initializer: function () {
    return undefined;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'showColumnHeaders', [bindable], {
  enumerable: true,
  initializer: function () {
    return true;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'columnsMetadata', [bindable], {
  enumerable: true,
  initializer: function () {
    return null;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'selection', [bindable], {
  enumerable: true,
  initializer: function () {
    return false;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'selectedItem', [bindable], {
  enumerable: true,
  initializer: function () {
    return undefined;
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'noRowsMessage', [bindable], {
  enumerable: true,
  initializer: function () {
    return '';
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, 'read', [bindable], {
  enumerable: true,
  initializer: function () {
    return null;
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, 'data', [bindable], {
  enumerable: true,
  initializer: function () {
    return null;
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, 'autoLoad', [bindable], {
  enumerable: true,
  initializer: function () {
    return true;
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, 'loadingMessage', [bindable], {
  enumerable: true,
  initializer: function () {
    return 'Loading...';
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, 'pageable', [bindable], {
  enumerable: true,
  initializer: function () {
    return false;
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, 'pageSize', [bindable], {
  enumerable: true,
  initializer: function () {
    return 10;
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, 'pagerSize', [bindable], {
  enumerable: true,
  initializer: function () {
    return 10;
  }
}), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, 'page', [bindable], {
  enumerable: true,
  initializer: function () {
    return 1;
  }
}), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, 'showFirstLastButtons', [bindable], {
  enumerable: true,
  initializer: function () {
    return true;
  }
}), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, 'showJumpButtons', [bindable], {
  enumerable: true,
  initializer: function () {
    return true;
  }
}), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, 'showPageSizeBox', [bindable], {
  enumerable: true,
  initializer: function () {
    return true;
  }
}), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, 'showPagingSummary', [bindable], {
  enumerable: true,
  initializer: function () {
    return true;
  }
}), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, 'pageSizes', [bindable], {
  enumerable: true,
  initializer: function () {
    return [10, 25, 50];
  }
})), _class2)) || _class) || _class) || _class);
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Grid = undefined;

var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24;

var _aureliaFramework = require('aurelia-framework');

var _proccessUserTemplate = require('./proccess-user-template');

var _columnDefinitionFactory = require('../column/column-definition-factory');

var _storeManager = require('../store/store-manager');

var _customElementHelper = require('../utils/custom-element-helper');

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var Grid = exports.Grid = (_dec = (0, _aureliaFramework.customElement)('grid'), _dec2 = (0, _aureliaFramework.processContent)(_proccessUserTemplate.processUserTemplate), _dec3 = (0, _aureliaFramework.inject)(Element, _aureliaFramework.ViewCompiler, _aureliaFramework.ViewResources, _aureliaFramework.Container, _aureliaFramework.TargetInstruction, _aureliaFramework.BindingEngine, _aureliaFramework.TaskQueue), _dec4 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = function () {
  function Grid(element, vc, vr, container, targetInstruction, bindingEngine, taskQueue) {
    _classCallCheck(this, Grid);

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
    var gridDefinition = targetInstruction.behaviorInstructions[0].gridDefinition;
    this.rowAttrs = gridDefinition.rowAttrs;
    this.columnDefinitionFactory = new _columnDefinitionFactory.ColumnDefinitionFactory(gridDefinition, this);
    this.pageable = gridDefinition.paginationAttrs;
  }

  Grid.prototype.bind = function bind(bindingContext, overrideContext) {
    var _this = this;

    this.parent = bindingContext;

    if (this.columnsMetadata === null) {
      this.columns = this.columnDefinitionFactory.create();
    } else {
      this.columns = this.columnDefinitionFactory.create(this.columnsMetadata);
    }

    this.storeManager = new _storeManager.StoreManager(this);

    if (this.sortOptions !== undefined) {
      (function () {
        var maxColumnId = _this.columns[_this.columns.length - 1].id;

        _this.sortOptions.forEach(function (sortOption) {
          var isValidColumnId = sortOption.columnId >= 1 && sortOption.columnId <= maxColumnId;
          if (isValidColumnId === false) {
            throw new Error('Invalid column id: ' + sortOption.columnId + '. Column Id should be an integer number between 1 and ' + maxColumnId + '.');
          }

          var isValidSortDirection = sortOption.sortDirection === 'asc' || sortOption.sortDirection === 'desc';
          if (isValidSortDirection === false) {
            throw new Error('Invalid sort direction: \'' + sortOption.sortDirection + '\'. Sort direction should be one of the following: \'asc\', \'desc\' or undefined.');
          }
        });

        var sorts = _this.sortOptions.map(function (sortOption) {
          var column = _this.columns[sortOption.columnId - 1];
          var sort = column.setSortDirection(sortOption.sortDirection);

          return sort;
        });

        _this.storeManager.getDataStore().applySortOptions(sorts);
      })();
    }

    this.resizeListener = function () {
      if (_this.height === 'auto') {
        _this.syncGridHeight();
      }

      _this.syncColumnHeadersWithColumns();
    }.bind(this);
    window.addEventListener('resize', this.resizeListener);

    var tbody = this.element.querySelector('table>tbody');
    this.viewSlot = new _aureliaFramework.ViewSlot(tbody, true, this);

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
  };

  Grid.prototype.attached = function attached() {
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
  };

  Grid.prototype._addRowAttributes = function _addRowAttributes(row) {
    row.setAttribute('repeat.for', '$item of rowData');

    for (var prop in this.rowAttrs) {
      if (this.rowAttrs.hasOwnProperty(prop)) {
        row.setAttribute(prop, this.rowAttrs[prop]);
      }
    }
  };

  Grid.prototype._buildTemplates = function _buildTemplates(bindingContext, overrideContext) {
    var _this2 = this;

    var rowTemplate = this.rowTemplate.cloneNode(true);
    var row = rowTemplate.querySelector('tr');

    this.columns.map(function (c) {
      return c.createDOMElement();
    }).forEach(row.appendChild.bind(row));

    var overrideBindingContext = {
      bindingContext: this,
      parentOverrideContext: {
        bindingContext: bindingContext,
        parentOverrideContext: overrideContext
      }
    };

    var view = this.viewCompiler.compile(rowTemplate, this.viewResources).create(this.container);
    view.bind(this, overrideBindingContext);

    var removeResponse = this.viewSlot.removeAll();
    if (removeResponse instanceof Promise) {
      removeResponse.then(function () {
        return _this2.viewSlot.add(view);
      });
    }

    this.viewSlot.add(view);
    this.viewSlot.attached();

    this.noRowsMessageChanged();
  };

  Grid.prototype.unbind = function unbind() {
    this.unbinding = true;
    window.removeEventListener('resize', this.resizeListener);
    this.columns.forEach(function (c) {
      return c.unsubscribe();
    });
    this.storeManager.unsubscribe();
  };

  Grid.prototype.call = function call(funcName) {
    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    this.parent[funcName].apply(this.parent, params);
  };

  Grid.prototype.changeSort = function changeSort(sort) {
    var sortOrder = this.storeManager.getDataStore().changeSortProcessingOrder(sort);
    this.sortOptions = sortOrder.map(function (sort) {
      var sortOption = {
        columnId: sort.column.id,
        sortDirection: sort.value
      };
      return sortOption;
    });

    this.refresh();
  };

  Grid.prototype.debounce = function debounce(func, wait) {
    var timeout;

    return function () {
      var context = this,
          args = arguments;

      var later = function later() {
        timeout = null;
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  Grid.prototype.updateFilters = function updateFilters() {
    if (!this.debouncedUpdateFilters) {
      this.debouncedUpdateFilters = this.debounce(this.refresh, this.filterDebounce || 100);
    }

    this.debouncedUpdateFilters();
  };

  Grid.prototype.refresh = function refresh() {
    var _this3 = this;

    if (this.canLoadData === true) {
      this.loading = true;
      this.storeManager.getDataStore().getData().then(function (data) {
        _this3.rowData = data;
        _this3.loading = false;

        _this3.taskQueue.queueTask(function () {
          return _this3.syncColumnHeadersWithColumns();
        });
      });
    }
  };

  Grid.prototype.checkData = function checkData(data) {
    var _this4 = this;

    data.forEach(function (d) {
      _this4.columns.forEach(function (c) {
        var propName = c.getFieldName();
        if (d[propName] === undefined) {
          console.error(d, c);
          throw new Error('Data must have property named: ' + propName);
        }
      });
    });
  };

  Grid.prototype.rowClicked = function rowClicked($item) {
    if (this.selection !== false) {
      if ($item._selected === true && this.isWithDeselect) {
        this.deselectRow($item);
      } else {
        this.selectRow($item);
      }
    }
  };

  Grid.prototype.selectRow = function selectRow($item, noEventNeeded) {
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
      _customElementHelper.customElementHelper.dispatchEvent(this.element, 'select-grid-row', {
        $item: $item
      });
    }
  };

  Grid.prototype.deselectRow = function deselectRow($item, noEventNeeded) {
    if (!$item.id) {
      return;
    }

    $item._selected = false;

    if (noEventNeeded !== true && this.isWithDeselect) {
      _customElementHelper.customElementHelper.dispatchEvent(this.element, 'deselect-grid-row', {
        $item: $item
      });
    }
  };

  Grid.prototype.selectedItemChanged = function selectedItemChanged(newValue, oldValue) {
    var _this5 = this;

    if (newValue === oldValue) {
      return;
    }

    if (newValue && newValue.id) {
      if (newValue !== this.lastSelectedItem) {
        this.selectRow(newValue, true);

        this.taskQueue.queueMicroTask(function () {
          var row = _this5.element.querySelector('tr.table-info');
          if (row !== null) {
            row.scrollIntoView();
          }
        }.bind(this));
      } else {}
    } else {
        if (this.lastSelectedItem !== undefined) {
          this.deselectRow(this.lastSelectedItem, true);
        }
      }
  };

  Grid.prototype.pageChanged = function pageChanged(page, oldValue) {
    if (page !== oldValue) {
      this.page = Number(page);
      this.storeManager.getDataStore().setPage(page);
      this.refresh();
    }
  };

  Grid.prototype.pageSizeChanged = function pageSizeChanged(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.storeManager.getDataStore().setPageSize(newValue);
      this.pageChanged(1);
    }
  };

  Grid.prototype.noRowsMessageChanged = function noRowsMessageChanged() {
    this.showNoRowsMessage = this.noRowsMessage !== '';
  };

  Grid.prototype.heightChanged = function heightChanged() {
    var cont = this.element.querySelector('.grid-content-container');

    if (this.height === 'auto' || window.isNaN(window.Number(this._height)) === false) {
      cont.setAttribute('style', 'height: ' + this._height + 'px');
    } else {
      cont.removeAttribute('style');
    }
  };

  Grid.prototype.syncGridHeight = function syncGridHeight() {
    if (this.height === 'auto') {
      this.element.style.overflowY = 'hidden';
    }

    var headerTable = this.element.querySelector('table.grid-header-table');
    var headerHeight = headerTable.offsetHeight;
    var gridFooter = this.element.querySelector('grid-footer-container');
    var gridFooterHeight = 0;
    if (gridFooter !== null) {
      gridFooterHeight = gridFooter.offsetHeight;
    }

    var gridContainerTopAndBottomBorderWidth = 2;

    this._height = this.element.parentElement.clientHeight - headerHeight - gridFooterHeight - gridContainerTopAndBottomBorderWidth;
    this.heightChanged();
  };

  Grid.prototype.syncColumnHeadersWithColumns = function syncColumnHeadersWithColumns() {
    var headers = this.element.querySelectorAll('table>thead>tr:first-child>th');
    var filters = this.element.querySelectorAll('table>thead>tr:last-child>th');
    var cells = this.element.querySelectorAll('table>tbody>tr:first-child>td');
    var isOverflowing = this.isBodyOverflowing();

    this._syncHeadersAndCellsMinWidth(headers, filters, cells, isOverflowing);

    for (var i = 0; i < 5; i++) {
      this._syncHeadersAndCellsWidth(headers, filters, cells, isOverflowing);
    }
  };

  Grid.prototype._syncHeadersAndCellsMinWidth = function _syncHeadersAndCellsMinWidth(headers, filters, cells, isOverflowing) {
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i];
      var filter = filters[i];
      var cell = cells[i];

      if (cell && header && filter) {
        var columnMinWidth = cell.getAttribute('min-width');
        if (columnMinWidth) {
          columnMinWidth = parseInt(columnMinWidth);

          var headerMinWidth = columnMinWidth;
          if (i === headers.length - 1 && isOverflowing) {
            headerMinWidth += this.scrollBarWidth;
          }

          if (cell.offsetWidth < columnMinWidth || header.offsetWidth < headerMinWidth || filter.offsetWidth < headerMinWidth) {
            header.style.minWidth = headerMinWidth + 'px';
            filter.style.minWidth = headerMinWidth + 'px';
            cell.style.minWidth = columnMinWidth + 'px';
          }
        }
      }
    }
  };

  Grid.prototype._syncHeadersAndCellsWidth = function _syncHeadersAndCellsWidth(headers, filters, cells, isOverflowing) {
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i];
      var filter = filters[i];
      var cell = cells[i];

      if (cell && header && filter) {
        var columnWidth = cell.getAttribute('width');
        if (columnWidth) {
          columnWidth = parseInt(columnWidth);
        } else {
          columnWidth = cell.offsetWidth;
        }

        var headerWidth = columnWidth;
        if (i === headers.length - 1 && isOverflowing) {
          headerWidth += this.scrollBarWidth;
        }

        header.style.width = headerWidth + 'px';
        filter.style.width = headerWidth + 'px';
        cell.style.width = columnWidth + 'px';
      }
    }
  };

  Grid.prototype.isBodyOverflowing = function isBodyOverflowing() {
    var body = this.element.querySelector('.grid-content-container');
    return body.offsetHeight < body.scrollHeight || body.offsetWidth < body.scrollWidth;
  };

  return Grid;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'height', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'showFilters', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'filterable', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'filterDebounce', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return 500;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'sortable', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'sortOptions', [_dec4], {
  enumerable: true,
  initializer: function initializer() {
    return undefined;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'showColumnHeaders', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'columnsMetadata', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'selection', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'selectedItem', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return undefined;
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'noRowsMessage', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, 'read', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, 'data', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, 'autoLoad', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, 'loadingMessage', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return 'Loading...';
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, 'pageable', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, 'pageSize', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return 10;
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, 'pagerSize', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return 10;
  }
}), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, 'page', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return 1;
  }
}), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, 'showFirstLastButtons', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, 'showJumpButtons', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, 'showPageSizeBox', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, 'showPagingSummary', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, 'pageSizes', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return [10, 25, 50];
  }
})), _class2)) || _class) || _class) || _class);
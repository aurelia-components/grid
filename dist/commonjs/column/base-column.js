'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseColumn = exports.BaseColumn = function () {
  function BaseColumn(config, template, grid, columnId) {
    _classCallCheck(this, BaseColumn);

    this.specialColumns = {
      heading: true,
      nosort: true,
      filter: true,
      grid: true
    };

    this._subscriptions = [];
    this.config = config;
    this.template = template;
    this.field = config.field;
    this.grid = grid;
    this.id = columnId;

    this.heading = config.heading;
    if (this.heading === undefined) {
      var viewModelPropertyName = config['heading.bind'];
      if (viewModelPropertyName !== undefined) {
        this.heading = this.subscribe(viewModelPropertyName, 'heading');
      } else {
        this.heading = '';
      }
    }

    this.sort = config.nosort === undefined;
    this.filter = config.filter || false;

    if (!this.field && (this.sort || this.filter)) {
      throw new Error('field is required');
    }

    this.filterValue = config['filter-value'] || '';
  }

  BaseColumn.prototype.hasFilter = function hasFilter() {
    return this.filter;
  };

  BaseColumn.prototype.hasFilterValue = function hasFilterValue() {
    throw new Error('Unimplemented method!');
  };

  BaseColumn.prototype.matchFilter = function matchFilter(filteredValue) {
    throw new Error('Unimplemented method!');
  };

  BaseColumn.prototype.getFilterValue = function getFilterValue() {
    throw new Error('Unimplemented method!');
  };

  BaseColumn.prototype.compare = function compare(first, second) {
    throw new Error('Unimplemented method!');
  };

  BaseColumn.prototype.createDOMElement = function createDOMElement() {
    var td = document.createElement('td');
    td.innerHTML = this.template;

    for (var prop in this.config) {
      if (this.config.hasOwnProperty(prop) && this.specialColumns[prop] === undefined) {
        td.setAttribute(prop, this.config[prop]);
      }
    }

    return td;
  };

  BaseColumn.prototype.getFieldName = function getFieldName() {
    return this.field;
  };

  BaseColumn.prototype.changeDirectionSort = function changeDirectionSort() {
    switch (this.sortDirection) {
      case 'asc':
        this.sortDirection = 'desc';
        break;
      case 'desc':
        this.sortDirection = undefined;
        break;
      default:
        this.sortDirection = 'asc';
        break;
    }

    this.grid.changeSort({
      name: this.field,
      value: this.sortDirection,
      column: this
    });
  };

  BaseColumn.prototype.setSortDirection = function setSortDirection(sortDirection) {
    this.sortDirection = sortDirection;
    var sort = {
      name: this.field,
      value: this.sortDirection,
      column: this
    };

    return sort;
  };

  BaseColumn.prototype.isSortDirectionDesc = function isSortDirectionDesc() {
    return this.sortDirection === 'desc';
  };

  BaseColumn.prototype.updateFilter = function updateFilter() {
    this.grid.updateFilters();
  };

  BaseColumn.prototype._updateViewModelOnPropertyChange = function _updateViewModelOnPropertyChange(viewModel, viewModelPropertyName, columnPropertyName) {
    var viewModelPropertyNameTokens = viewModelPropertyName.split('.');
    var subscription = void 0;
    if (viewModelPropertyNameTokens.length > 1) {
      subscription = this.grid.bindingEngine.propertyObserver(this, columnPropertyName).subscribe(function (newValue, oldValue) {
        var obj = viewModel;
        var i = void 0;
        for (i = 0; i < viewModelPropertyNameTokens.length - 1; i += 1) {
          obj = obj[viewModelPropertyNameTokens[i]];
        }

        obj[viewModelPropertyNameTokens[i]] = newValue;
      });
    } else {
      subscription = this.grid.bindingEngine.propertyObserver(this, columnPropertyName).subscribe(function (newValue, oldValue) {
        viewModel[viewModelPropertyName] = newValue;
      });
    }

    this._subscriptions.push(subscription);
  };

  BaseColumn.prototype.subscribe = function subscribe(viewModelPropertyName, columnPropertyName) {
    var _this = this;

    if (viewModelPropertyName === undefined) {
      throw new Error('Argument exception! Argument "viewModelProperty" can\'t be empty!');
    }

    var viewModel = this.grid.parent;
    var viewModelPropertyNameTokens = viewModelPropertyName.split('.');
    var subscription = void 0,
        value = void 0;
    if (viewModelPropertyNameTokens.length > 1) {
      value = viewModelPropertyNameTokens.reduce(function (obj, token) {
        return obj = obj[token];
      }, viewModel);

      subscription = this.grid.bindingEngine.expressionObserver(viewModel, viewModelPropertyName).subscribe(function (newValue, oldValue) {
        _this.setColumnProperty(columnPropertyName, newValue);
      });
    } else {
      value = viewModel[viewModelPropertyName];
      subscription = this.grid.bindingEngine.propertyObserver(viewModel, viewModelPropertyName).subscribe(function (newValue, oldValue) {
        _this.setColumnProperty(columnPropertyName, newValue);
      });
    }

    this._subscriptions.push(subscription);
    this._updateViewModelOnPropertyChange(viewModel, viewModelPropertyName, columnPropertyName);

    return value;
  };

  BaseColumn.prototype.setColumnProperty = function setColumnProperty(columnPropertyName, newValue) {
    this[columnPropertyName] = newValue;
    this.updateFilter();
  };

  BaseColumn.prototype.unsubscribe = function unsubscribe() {
    this._subscriptions.forEach(function (s) {
      return s.dispose();
    });
  };

  return BaseColumn;
}();
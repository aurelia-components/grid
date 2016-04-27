define(['exports', './base-column'], function (exports, _baseColumn) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BooleanColumn = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var BooleanColumn = exports.BooleanColumn = function (_BaseColumn) {
    _inherits(BooleanColumn, _BaseColumn);

    function BooleanColumn(config, template, grid, columnId) {
      _classCallCheck(this, BooleanColumn);

      var _this = _possibleConstructorReturn(this, _BaseColumn.call(this, config, template, grid, columnId));

      switch (config['filter-value']) {
        case 'true':
          _this.filterValue = true;
          break;
        case 'false':
          _this.filterValue = false;
          break;
        default:
          _this.filterValue = undefined;
      }

      if (_this.filterValue === undefined) {
        var viewModelPropertyName = config['filter-value.bind'];
        if (viewModelPropertyName !== undefined) {
          _this.filterValue = _this.subscribe(viewModelPropertyName, 'filterValue');
        }
      }

      _this._setFilterValues();
      return _this;
    }

    BooleanColumn.prototype._setFilterValues = function _setFilterValues() {
      if (this.filterValue === true) {
        this.trueFilter = true;
        this.falseFilter = false;
      } else if (this.filterValue === false) {
        this.trueFilter = false;
        this.falseFilter = true;
      } else {
        this.trueFilter = true;
        this.falseFilter = true;
      }
    };

    BooleanColumn.prototype.setColumnProperty = function setColumnProperty(columnPropertyName, newValue) {
      this[columnPropertyName] = newValue;
      this._setFilterValues();
      this.updateFilter();
    };

    BooleanColumn.prototype.trueFilterToggle = function trueFilterToggle() {
      if (this.falseFilter) {
        this.trueFilter = !this.trueFilter;
        this.updateFilter();
      }
    };

    BooleanColumn.prototype.falseFilterToggle = function falseFilterToggle() {
      if (this.trueFilter) {
        this.falseFilter = !this.falseFilter;
        this.updateFilter();
      }
    };

    BooleanColumn.prototype.updateFilter = function updateFilter() {
      if (this.trueFilter && this.falseFilter) {
        this.filterValue = undefined;
      } else if (this.trueFilter) {
        this.filterValue = true;
      } else if (this.falseFilter) {
        this.filterValue = false;
      }

      this.grid.updateFilters();
    };

    BooleanColumn.prototype.hasFilterValue = function hasFilterValue() {
      return this.filterValue !== undefined;
    };

    BooleanColumn.prototype.matchFilter = function matchFilter(filteredValue) {
      if (filteredValue === undefined) {
        throw new Error('Filtered value can\'t be undefined!');
      }

      if (this.hasFilterValue()) {
        return filteredValue === this.filterValue;
      }

      return true;
    };

    BooleanColumn.prototype.getFilterValue = function getFilterValue() {
      if (this.filterValue !== undefined) {
        var result = [{
          name: this.field,
          value: this.filterValue,
          type: '=',
          valueType: 'boolean'
        }];

        return result;
      }

      return [];
    };

    BooleanColumn.prototype.compare = function compare(x, y) {
      if (this.isSortDirectionDesc()) {
        return x === y ? 0 : x ? -1 : 1;
      } else {
        return x === y ? 0 : x ? 1 : -1;
      }
    };

    return BooleanColumn;
  }(_baseColumn.BaseColumn);
});
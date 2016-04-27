define(['exports', './base-column'], function (exports, _baseColumn) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.InputColumn = undefined;

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

  var InputColumn = exports.InputColumn = function (_BaseColumn) {
    _inherits(InputColumn, _BaseColumn);

    function InputColumn(config, template, grid, columnId) {
      _classCallCheck(this, InputColumn);

      var _this = _possibleConstructorReturn(this, _BaseColumn.call(this, config, template, grid, columnId));

      _this.filterValue = config['filter-value'];
      if (_this.filterValue === undefined) {
        var viewModelPropertyName = config['filter-value.bind'];
        if (viewModelPropertyName !== undefined) {
          _this.filterValue = _this.subscribe(viewModelPropertyName, 'filterValue');
        } else {
          _this.filterValue = '';
        }
      }
      return _this;
    }

    InputColumn.prototype.hasFilterValue = function hasFilterValue() {
      return this.filterValue !== '' && this.filterValue !== undefined;
    };

    InputColumn.prototype.matchFilter = function matchFilter(filteredValue) {
      if (filteredValue === undefined) {
        throw new Error('Filtered value can\'t be undefined!');
      }

      if (this.hasFilterValue()) {
        return filteredValue.toString().toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1;
      }

      return true;
    };

    InputColumn.prototype.getFilterValue = function getFilterValue() {
      if (this.hasFilterValue()) {
        var result = [{
          name: this.field,
          value: this.filterValue,
          valueType: 'string'
        }];

        return result;
      }

      return [];
    };

    InputColumn.prototype.compare = function compare(first, second) {
      var result = void 0;
      if (first > second) {
        result = 1;
      } else if (first < second) {
        result = -1;
      } else {
        result = 0;
      }

      if (this.isSortDirectionDesc()) {
        result *= -1;
      }

      return result;
    };

    return InputColumn;
  }(_baseColumn.BaseColumn);
});
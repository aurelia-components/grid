'use strict';

System.register(['./base-column'], function (_export, _context) {
  var BaseColumn, SelectColumn;

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

  return {
    setters: [function (_baseColumn) {
      BaseColumn = _baseColumn.BaseColumn;
    }],
    execute: function () {
      _export('SelectColumn', SelectColumn = function (_BaseColumn) {
        _inherits(SelectColumn, _BaseColumn);

        function SelectColumn(config, template, grid, columnId) {
          _classCallCheck(this, SelectColumn);

          var _this = _possibleConstructorReturn(this, _BaseColumn.call(this, config, template, grid, columnId));

          _this.filterValue = config['filter-value'];
          if (_this.filterValue === undefined) {
            var viewModelPropertyName = config['filter-value.bind'];
            if (viewModelPropertyName !== undefined) {
              _this.filterValue = _this.subscribe(viewModelPropertyName, 'filterValue');
            } else {
              _this.filterValue = undefined;
            }
          }

          var viewModelItemsPropertyName = config['filter-items.bind'];
          if (viewModelItemsPropertyName === undefined) {
            throw new Error('Argument Exception! ViewModel has to define "filter-items.bind" value!');
          }

          _this.items = _this.subscribe(viewModelItemsPropertyName, 'items');
          return _this;
        }

        SelectColumn.prototype.hasFilterValue = function hasFilterValue() {
          return this.filterValue !== undefined;
        };

        SelectColumn.prototype.matchFilter = function matchFilter(valueToFilter) {
          if (valueToFilter === undefined) {
            throw new Error('Value to filter can\'t be undefined!');
          }

          if (this.hasFilterValue()) {
            return this.filterValue === valueToFilter;
          }

          return true;
        };

        SelectColumn.prototype.getFilterValue = function getFilterValue() {
          if (this.hasFilterValue()) {
            var result = [{
              name: this.field,
              value: this.filterValue,
              valueType: 'select'
            }];

            return result;
          }

          return [];
        };

        SelectColumn.prototype.compare = function compare(first, second) {
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

        return SelectColumn;
      }(BaseColumn));

      _export('SelectColumn', SelectColumn);
    }
  };
});
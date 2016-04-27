define(['exports', './base-store'], function (exports, _baseStore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.LocalStore = undefined;

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

  var LocalStore = exports.LocalStore = function (_BaseStore) {
    _inherits(LocalStore, _BaseStore);

    function LocalStore(data, settings) {
      _classCallCheck(this, LocalStore);

      var _this = _possibleConstructorReturn(this, _BaseStore.call(this, settings));

      _this.data = data;
      return _this;
    }

    LocalStore.prototype.applySort = function applySort(data) {
      var columnDefinitions = this.sortProcessingOrder.map(function (sort) {
        return sort.column;
      });

      if (columnDefinitions.length > 0) {
        data = data.sort(function (a, b) {
          return columnDefinitions.map(function (column) {
            var propName = column.getFieldName();
            return column.compare(a[propName], b[propName]);
          }).reduce(function firstNonZeroValue(p, n) {
            return p ? p : n;
          }, 0);
        });
      }

      return data;
    };

    LocalStore.prototype.applyFilter = function applyFilter(data) {
      var _this2 = this;

      return data.filter(function (row) {
        var include = true;

        for (var i = _this2.columnDefinitions.length - 1; i >= 0; i--) {
          var col = _this2.columnDefinitions[i];
          if (col.hasFilter() === false) {
            continue;
          }

          var applyFilterAgainstValue = row[col.getFieldName()];
          if (col.matchFilter(applyFilterAgainstValue) === false) {
            include = false;
            break;
          }
        }

        return include;
      });
    };

    LocalStore.prototype.applyPagination = function applyPagination(data) {
      var start = (Number(this.page) - 1) * Number(this.pageSize);
      data = data.slice(start, start + Number(this.pageSize));

      return data;
    };

    LocalStore.prototype.filterAndSortPage = function filterAndSortPage(data) {
      var tempData = data;

      if (this.isFilterable()) {
        tempData = this.applyFilter(tempData);
      }

      if (this.isSortable()) {
        tempData = this.applySort(tempData);
      }

      if (this.isPageable()) {
        tempData = this.applyPagination(tempData);
      }

      return tempData;
    };

    LocalStore.prototype.refresh = function refresh(newData) {
      this.data = newData;
    };

    LocalStore.prototype.getData = function getData() {
      var data = this.filterAndSortPage(this.data);
      this.count = this.data.length;
      this.updatePager();
      return new Promise(function (resolve, reject) {
        resolve(data);
      });
    };

    return LocalStore;
  }(_baseStore.BaseStore);
});
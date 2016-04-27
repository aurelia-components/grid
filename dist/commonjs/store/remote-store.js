'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RemoteStore = undefined;

var _baseStore = require('./base-store');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RemoteStore = exports.RemoteStore = function (_BaseStore) {
  _inherits(RemoteStore, _BaseStore);

  function RemoteStore(read, settings) {
    _classCallCheck(this, RemoteStore);

    var _this = _possibleConstructorReturn(this, _BaseStore.call(this, settings));

    _this.read = read;
    if (typeof read !== 'function') {
      throw new Error('Argument Exception: "read" must be a function for loading data returning promise!');
    }
    return _this;
  }

  RemoteStore.prototype.getFiltersValuesAsQueryString = function getFiltersValuesAsQueryString() {
    var filters = [];
    for (var i = this.columnDefinitions.length - 1; i >= 0; i--) {
      var col = this.columnDefinitions[i];
      var filterQueryString = col.getQueryString();
      if (filterQueryString !== undefined) {
        filters.push(filterQueryString);
      }
    }

    return filters;
  };

  RemoteStore.prototype.getFiltersValues = function getFiltersValues() {
    var filters = [];
    for (var i = this.columnDefinitions.length - 1; i >= 0; i--) {
      var col = this.columnDefinitions[i];
      filters = filters.concat(col.getFilterValue());
    }

    return filters;
  };

  RemoteStore.prototype.getSorters = function getSorters() {
    return this.sortProcessingOrder.map(function (sorter) {
      return {
        name: sorter.name,
        value: sorter.value
      };
    });
  };

  RemoteStore.prototype.getData = function getData() {
    var _this2 = this;

    var queryValues = {
      filters: this.getFiltersValues(),
      paging: {
        page: this.page,
        count: window.Number(this.pageSize, 10)
      },
      sorters: this.getSorters()
    };

    return this.read(queryValues).then(function (result) {
      _this2.data = result.data;
      _this2.count = result.count;
      _this2.updatePager();

      return _this2.data;
    });
  };

  return RemoteStore;
}(_baseStore.BaseStore);
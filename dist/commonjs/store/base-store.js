'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseStore = exports.BaseStore = function () {
  function BaseStore(settings) {
    _classCallCheck(this, BaseStore);

    this.sortProcessingOrder = [];

    this.sortable = settings.sortable;
    this.filterable = settings.filterable;
    this.columnDefinitions = settings.columnDefinitions;
    this.pageable = settings.pageable;
    this.pageSize = settings.pageSize;
    this.page = settings.page;
    this.firstVisibleItem = 0;
    this.lastVisibleItem = 0;

    if (this.columnDefinitions === undefined) {
      throw new Error('Argument Exception: "columnDefinitions" setting must be deffined!');
    }
  }

  BaseStore.prototype.refresh = function refresh() {
    throw new Error('Not implemented method!');
  };

  BaseStore.prototype.getData = function getData() {
    throw new Error('Not implemented method!');
  };

  BaseStore.prototype.isFilterable = function isFilterable() {
    return this.filterable;
  };

  BaseStore.prototype.isSortable = function isSortable() {
    return this.sortable;
  };

  BaseStore.prototype.isPageable = function isPageable() {
    return this.pageable;
  };

  BaseStore.prototype.setPage = function setPage(page) {
    this.page = page;
  };

  BaseStore.prototype.setPageSize = function setPageSize(pageSize) {
    this.pageSize = pageSize;
  };

  BaseStore.prototype.updatePager = function updatePager() {
    if (this.pager) {
      this.pager.update(this.page, Number(this.pageSize), this.count);
    }

    this.firstVisibleItem = (this.page - 1) * Number(this.pageSize) + 1;
    this.lastVisibleItem = Math.min(this.page * Number(this.pageSize), this.count);
  };

  BaseStore.prototype.setPager = function setPager(pager) {
    this.pager = pager;
    this.updatePager();
  };

  BaseStore.prototype.changeSortProcessingOrder = function changeSortProcessingOrder(sort) {
    var index = this.sortProcessingOrder.findIndex(function (el, index) {
      if (el.column === sort.column) {
        return true;
      }

      return false;
    });

    if (index > -1) {
      this.sortProcessingOrder.splice(index, 1);
    }

    if (sort.value !== undefined) {
      this.sortProcessingOrder.push(sort);
    }

    return this.sortProcessingOrder;
  };

  BaseStore.prototype.applySortOptions = function applySortOptions(sorts) {
    var _this = this;

    this.sortProcessingOrder = [];
    sorts.forEach(function (sort) {
      return _this.changeSortProcessingOrder(sort);
    });
  };

  return BaseStore;
}();
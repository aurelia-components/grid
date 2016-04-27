export let BaseStore = class BaseStore {

  constructor(settings) {
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

  refresh() {
    throw new Error('Not implemented method!');
  }

  getData() {
    throw new Error('Not implemented method!');
  }

  isFilterable() {
    return this.filterable;
  }

  isSortable() {
    return this.sortable;
  }

  isPageable() {
    return this.pageable;
  }

  setPage(page) {
    this.page = page;
  }

  setPageSize(pageSize) {
    this.pageSize = pageSize;
  }

  updatePager() {
    if (this.pager) {
      this.pager.update(this.page, Number(this.pageSize), this.count);
    }

    this.firstVisibleItem = (this.page - 1) * Number(this.pageSize) + 1;
    this.lastVisibleItem = Math.min(this.page * Number(this.pageSize), this.count);
  }

  setPager(pager) {
    this.pager = pager;
    this.updatePager();
  }

  changeSortProcessingOrder(sort) {
    let index = this.sortProcessingOrder.findIndex((el, index) => {
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
  }

  applySortOptions(sorts) {
    this.sortProcessingOrder = [];
    sorts.forEach(sort => this.changeSortProcessingOrder(sort));
  }
};
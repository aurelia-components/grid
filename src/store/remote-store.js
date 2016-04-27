import {BaseStore} from './base-store';

export class RemoteStore extends BaseStore {
  constructor(read, settings) {
    super(settings);

    this.read = read;
    if (typeof read !== 'function') {
      throw new Error('Argument Exception: "read" must be a function for loading data returning promise!');
    }
  }

  getFiltersValuesAsQueryString() {
    var filters = [];
    for (let i = this.columnDefinitions.length - 1; i >= 0; i--) {
      let col = this.columnDefinitions[i];
      let filterQueryString = col.getQueryString();
      if (filterQueryString !== undefined) {
        filters.push(filterQueryString);
      }
    }

    return filters;
  }

  getFiltersValues() {
    let filters = [];
    for (let i = this.columnDefinitions.length - 1; i >= 0; i--) {
      let col = this.columnDefinitions[i];
      filters = filters.concat(col.getFilterValue());
    }

    return filters;
  }

  getSorters() {
    return this.sortProcessingOrder.map(sorter => {
      return {
        name: sorter.name,
        value: sorter.value
      };
    });
  }

  getData() {
    const queryValues = {
      filters: this.getFiltersValues(),
      paging: {
        page: this.page,
        count: window.Number(this.pageSize, 10)
      },
      sorters: this.getSorters()
    };

    return this.read(queryValues).then(result => {
      this.data = result.data;
      this.count = result.count;
      this.updatePager();

      return (this.data);
    });
  }
}

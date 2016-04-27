import {BaseStore} from './base-store';

export class LocalStore extends BaseStore {

  constructor(data, settings) {
    super(settings);
    this.data = data;
  }

  applySort(data) {
    let columnDefinitions = this.sortProcessingOrder.map(sort => {
      return sort.column;
    });

    if (columnDefinitions.length > 0) {
      data = data.sort((a, b) => {
        return columnDefinitions.map(column => {
          let propName = column.getFieldName();
          return column.compare(a[propName], b[propName]);
        }).reduce(function firstNonZeroValue(p, n) {
          return p ? p : n;
        }, 0);
      });
    }

    return data;
  }

  applyFilter(data) {
    return data.filter((row) => {
      let include = true;

      for (let i = this.columnDefinitions.length - 1; i >= 0; i--) {
        let col = this.columnDefinitions[i];
        if (col.hasFilter() === false) {
          continue;
        }

        let applyFilterAgainstValue = row[col.getFieldName()];
        if (col.matchFilter(applyFilterAgainstValue) === false) {
          include = false;
          break;
        }
      }

      return include;
    });
  }

  applyPagination(data) {
    let start = (Number(this.page) - 1) * Number(this.pageSize);
    data = data.slice(start, start + Number(this.pageSize));

    return data;
  }

  filterAndSortPage(data) {
    let tempData = data;

    if (this.isFilterable()) {
      tempData = this.applyFilter(tempData);
    }

    if (this.isSortable()) {
      tempData = this.applySort(tempData);
    }

    // todo: does this needs to be here?
    if (this.isPageable()) {
      tempData = this.applyPagination(tempData);
    }

    return tempData;
  }

  refresh(newData) {
    this.data = newData;
  }

  getData() {
    let data = this.filterAndSortPage(this.data);
    this.count = this.data.length;
    this.updatePager();
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  }
}

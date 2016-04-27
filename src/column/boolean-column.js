import {BaseColumn} from './base-column';

export class BooleanColumn extends BaseColumn {
  constructor(config, template, grid, columnId) {
    super(config, template, grid, columnId);

    switch (config['filter-value']) {
    case 'true':
      this.filterValue = true;
      break;
    case 'false':
      this.filterValue = false;
      break;
    default:
      this.filterValue = undefined;
    }

    if (this.filterValue === undefined) {
      const viewModelPropertyName = config['filter-value.bind'];
      if (viewModelPropertyName !== undefined) {
        this.filterValue = this.subscribe(viewModelPropertyName, 'filterValue');
      }
    }

    this._setFilterValues();
  }

  _setFilterValues() {
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
  }

  setColumnProperty(columnPropertyName, newValue) {
    this[columnPropertyName] = newValue;
    this._setFilterValues();
    this.updateFilter();
  }

  trueFilterToggle() {
    if (this.falseFilter) {
      this.trueFilter = !this.trueFilter;
      this.updateFilter();
    }
  }

  falseFilterToggle() {
    if (this.trueFilter) {
      this.falseFilter = !this.falseFilter;
      this.updateFilter();
    }
  }

  updateFilter() {
    if (this.trueFilter && this.falseFilter) {
      this.filterValue = undefined;
    } else if (this.trueFilter) {
      this.filterValue = true;
    } else if (this.falseFilter) {
      this.filterValue = false;
    }

    this.grid.updateFilters();
  }

  hasFilterValue() {
    return this.filterValue !== undefined;
  }

  matchFilter(filteredValue) {
    if (filteredValue === undefined) {
      throw new Error('Filtered value can\'t be undefined!');
    }

    if (this.hasFilterValue()) {
      return filteredValue === this.filterValue;
    }

    return true;
  }

  getFilterValue() {
    if (this.filterValue !== undefined) {
      let result = [{
        name: this.field,
        value: this.filterValue,
        type: '=',
        valueType: 'boolean'
      }];

      return result;
    }

    return [];
  }

  compare(x, y) {
    if (this.isSortDirectionDesc()) {
      return (x === y) ? 0 : x ? -1 : 1;
    } else {
      return (x === y) ? 0 : x ? 1 : -1;
    }
  }
}

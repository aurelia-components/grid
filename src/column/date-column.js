import {BaseColumn} from './base-column';
import moment from 'moment';

export class DateColumn extends BaseColumn {
  constructor(config, template, grid, columnId) {
    super(config, template, grid, columnId);

    this.filterValueFrom = this._setFilterDateValue('from') || this._subscribe('from.bind', 'filterValueFrom');
    this.filterValueTo = this._setFilterDateValue('to') || this._subscribe('to.bind', 'filterValueTo');
  }

  _subscribe(propName, columnPropertyName) {
    let viewModelPropertyName = this.config[propName];
    if (viewModelPropertyName === undefined) {
      return viewModelPropertyName;
    }

    const value = this.subscribe(viewModelPropertyName, columnPropertyName);

    return this._getMomentValue(value);
  }

  setColumnProperty(propertyName, newValue) {
    this[propertyName] = this._getMomentValue(newValue);
  }

  _getMomentValue(value, throwErrorIfNotValidDate) {
    if (value === undefined) {
      if (throwErrorIfNotValidDate) {
        throw new Error('Argument exception! Value is not defined!');
      } else {
        return null;
      }
    }

    const date = value && value.constructor.name === 'Moment' ? value : moment(value);

    if (date.isValid() === false) {
      if (throwErrorIfNotValidDate) {
        throw new Error(`Argument exception! Value: "${value}" is not a valid moment() argument!`);
      } else {
        return null;
      }
    }

    return date;
  }

  _setFilterDateValue(propName) {
    const value = this.config[propName];
    if (value !== undefined) {
      return this._getMomentValue(value);
    }

    return value;
  }

  hasFilterValue() {
    return this.filterValueFrom || this.filterValueTo;
  }

  matchFilter(filteredValue) {
    if (filteredValue === undefined) {
      throw new Error('Filtered value can\'t be undefined!');
    }

    let isAfter, isBefore;
    if (this.filterValueFrom && this.filterValueTo) {
      isAfter = this.filterValueFrom.isBefore(filteredValue);
      isBefore = this.filterValueTo.isAfter(filteredValue);
      return isAfter && isBefore;
    }

    if (this.filterValueFrom) {
      isAfter = this.filterValueFrom.isBefore(filteredValue);
      return isAfter;
    }

    if (this.filterValueTo) {
      isBefore = this.filterValueTo.isAfter(filteredValue);
      return isBefore;
    }

    return true;
  }

  getFilterValue() {
    if (this.filterValueFrom && this.filterValueTo) {
      return [{
        name: `${this.field}From`,
        value: this.filterValueFrom.format('YYYY-MM-DD'),
        type: '>',
        valueType: 'date'
      }, {
        name: `${this.field}To`,
        value: this.filterValueTo.format('YYYY-MM-DD'),
        type: '<',
        valueType: 'date'
      }];
    } else if (this.filterValueFrom) {
      return [{
        name: `${this.field}From`,
        value: this.filterValueFrom.format('YYYY-MM-DD'),
        type: '>',
        valueType: 'date'
      }];
    } else if (this.filterValueTo) {
      return [{
        name: `${this.field}To`,
        value: this.filterValueTo.format('YYYY-MM-DD'),
        type: '<',
        valueType: 'date'
      }];
    }

    return [];
  }

  compare(first, second) {
    let result;
    if (first.isAfter(second)) {
      result = 1;
    } else if (second.isAfter(first)) {
      result =  -1;
    } else {
      result = 0;
    }

    if (this.isSortDirectionDesc()) {
      result *= -1;
    }

    return result;
  }
}

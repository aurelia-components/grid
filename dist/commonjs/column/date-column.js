'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateColumn = undefined;

var _baseColumn = require('./base-column');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DateColumn = exports.DateColumn = function (_BaseColumn) {
  _inherits(DateColumn, _BaseColumn);

  function DateColumn(config, template, grid, columnId) {
    _classCallCheck(this, DateColumn);

    var _this = _possibleConstructorReturn(this, _BaseColumn.call(this, config, template, grid, columnId));

    _this.filterValueFrom = _this._setFilterDateValue('from') || _this._subscribe('from.bind', 'filterValueFrom');
    _this.filterValueTo = _this._setFilterDateValue('to') || _this._subscribe('to.bind', 'filterValueTo');
    return _this;
  }

  DateColumn.prototype._subscribe = function _subscribe(propName, columnPropertyName) {
    var viewModelPropertyName = this.config[propName];
    if (viewModelPropertyName === undefined) {
      return viewModelPropertyName;
    }

    var value = this.subscribe(viewModelPropertyName, columnPropertyName);

    return this._getMomentValue(value);
  };

  DateColumn.prototype.setColumnProperty = function setColumnProperty(propertyName, newValue) {
    this[propertyName] = this._getMomentValue(newValue);
  };

  DateColumn.prototype._getMomentValue = function _getMomentValue(value, throwErrorIfNotValidDate) {
    if (value === undefined) {
      if (throwErrorIfNotValidDate) {
        throw new Error('Argument exception! Value is not defined!');
      } else {
        return null;
      }
    }

    var date = value && value.constructor.name === 'Moment' ? value : (0, _moment2.default)(value);

    if (date.isValid() === false) {
      if (throwErrorIfNotValidDate) {
        throw new Error('Argument exception! Value: "' + value + '" is not a valid moment() argument!');
      } else {
        return null;
      }
    }

    return date;
  };

  DateColumn.prototype._setFilterDateValue = function _setFilterDateValue(propName) {
    var value = this.config[propName];
    if (value !== undefined) {
      return this._getMomentValue(value);
    }

    return value;
  };

  DateColumn.prototype.hasFilterValue = function hasFilterValue() {
    return this.filterValueFrom || this.filterValueTo;
  };

  DateColumn.prototype.matchFilter = function matchFilter(filteredValue) {
    if (filteredValue === undefined) {
      throw new Error('Filtered value can\'t be undefined!');
    }

    var isAfter = void 0,
        isBefore = void 0;
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
  };

  DateColumn.prototype.getFilterValue = function getFilterValue() {
    if (this.filterValueFrom && this.filterValueTo) {
      return [{
        name: this.field + 'From',
        value: this.filterValueFrom.format('YYYY-MM-DD'),
        type: '>',
        valueType: 'date'
      }, {
        name: this.field + 'To',
        value: this.filterValueTo.format('YYYY-MM-DD'),
        type: '<',
        valueType: 'date'
      }];
    } else if (this.filterValueFrom) {
      return [{
        name: this.field + 'From',
        value: this.filterValueFrom.format('YYYY-MM-DD'),
        type: '>',
        valueType: 'date'
      }];
    } else if (this.filterValueTo) {
      return [{
        name: this.field + 'To',
        value: this.filterValueTo.format('YYYY-MM-DD'),
        type: '<',
        valueType: 'date'
      }];
    }

    return [];
  };

  DateColumn.prototype.compare = function compare(first, second) {
    var result = void 0;
    if (first.isAfter(second)) {
      result = 1;
    } else if (second.isAfter(first)) {
      result = -1;
    } else {
      result = 0;
    }

    if (this.isSortDirectionDesc()) {
      result *= -1;
    }

    return result;
  };

  return DateColumn;
}(_baseColumn.BaseColumn);
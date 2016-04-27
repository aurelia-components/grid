define(['exports', '../column/date-column', '../column/boolean-column', '../column/input-column', '../column/select-column', '../grid-filter'], function (exports, _dateColumn, _booleanColumn, _inputColumn, _selectColumn, _gridFilter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ColumnDefinitionFactory = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var ColumnDefinitionFactory = exports.ColumnDefinitionFactory = function () {
    function ColumnDefinitionFactory(gridDefinition, grid) {
      _classCallCheck(this, ColumnDefinitionFactory);

      this.colDefinitions = gridDefinition.cols;
      this.rowAttrs = gridDefinition.rowAttrs;
      this.grid = grid;
    }

    ColumnDefinitionFactory.prototype.create = function create(columnsMetadata) {
      this.columnId = 1;
      if (columnsMetadata === undefined) {
        return this._createFromColumnDefintions();
      } else {
        return this._createFromColumnsMetadata(columnsMetadata);
      }
    };

    ColumnDefinitionFactory.prototype._createFromColumnDefintions = function _createFromColumnDefintions() {
      var _this = this;

      return this.colDefinitions.map(function (cd) {
        return _this._createColumnDefinition(cd.attr, cd.html);
      });
    };

    ColumnDefinitionFactory.prototype._createFromColumnsMetadata = function _createFromColumnsMetadata(columnsMetadata) {
      var _this2 = this;

      return columnsMetadata.map(function (cm) {
        var html = void 0;
        if (cm.html !== undefined) {
          html = cm.html;
          delete cm.html;
        } else {
          html = '${$item["' + cm.field + '"]}';
        }

        return _this2._createColumnDefinition(cm, html);
      });
    };

    ColumnDefinitionFactory.prototype._createColumnDefinition = function _createColumnDefinition(attr, html) {
      var col = void 0;
      switch (attr.filter) {
        case _gridFilter.gridFilter.input:
          col = new _inputColumn.InputColumn(attr, html, this.grid, this.columnId);
          break;
        case _gridFilter.gridFilter.dateFromTo:
          col = new _dateColumn.DateColumn(attr, html, this.grid, this.columnId);
          break;
        case _gridFilter.gridFilter.boolean:
          col = new _booleanColumn.BooleanColumn(attr, html, this.grid, this.columnId);
          break;
        case _gridFilter.gridFilter.select:
          col = new _selectColumn.SelectColumn(attr, html, this.grid, this.columnId);
          break;
        case undefined:
          col = new _inputColumn.InputColumn(attr, html, this.grid, this.columnId);
          break;
        default:
          throw new Error('No such grid filter defined: ' + attr.filter + '!');
      }

      this.columnId++;
      return col;
    };

    return ColumnDefinitionFactory;
  }();
});
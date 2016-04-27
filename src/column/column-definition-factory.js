import {DateColumn} from '../column/date-column';
import {BooleanColumn} from '../column/boolean-column';
import {InputColumn} from '../column/input-column';
import {SelectColumn} from '../column/select-column';
import {gridFilter} from '../grid-filter';

export class ColumnDefinitionFactory {
  constructor(gridDefinition, grid) {
    this.colDefinitions = gridDefinition.cols;
    this.rowAttrs = gridDefinition.rowAttrs;
    this.grid = grid;
  }

  create(columnsMetadata) {
    this.columnId = 1;
    if (columnsMetadata === undefined) {
      return this._createFromColumnDefintions();
    } else {
      return this._createFromColumnsMetadata(columnsMetadata);
    }
  }

  _createFromColumnDefintions() {
    return this.colDefinitions.map(cd => this._createColumnDefinition(cd.attr, cd.html));
  }

  _createFromColumnsMetadata(columnsMetadata) {
    return columnsMetadata.map(cm => {
      let html;
      if (cm.html !== undefined) {
        html = cm.html;
        delete cm.html;
      } else {
        html = '${$item["' + cm.field + '"]}';
      }

      return this._createColumnDefinition(cm, html);
    });
  }

  _createColumnDefinition(attr, html) {
    let col;
    switch (attr.filter) {
    case gridFilter.input:
      col = new InputColumn(attr, html, this.grid, this.columnId);
      break;
    case gridFilter.dateFromTo:
      col = new DateColumn(attr, html, this.grid, this.columnId);
      break;
    case gridFilter.boolean:
      col = new BooleanColumn(attr, html, this.grid, this.columnId);
      break;
    case gridFilter.select:
      col = new SelectColumn(attr, html, this.grid, this.columnId);
      break;
    case undefined:
      col = new InputColumn(attr, html, this.grid, this.columnId);
      break;
    default:
      throw new Error(`No such grid filter defined: ${attr.filter}!`);
    }

    this.columnId++;
    return col;
  }
}

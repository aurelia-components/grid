export class BaseColumn {
  specialColumns = {
    heading: true,
    nosort: true,
    filter: true,
    grid: true
  };

  constructor(config, template, grid, columnId) {
    this._subscriptions = [];
    this.config = config;
    this.template = template;
    this.field = config.field;
    this.grid = grid;
    this.id = columnId;

    this.heading = config.heading;
    if (this.heading === undefined) {
      const viewModelPropertyName = config['heading.bind'];
      if (viewModelPropertyName !== undefined) {
        this.heading = this.subscribe(viewModelPropertyName, 'heading');
      } else {
        this.heading = '';
      }
    }

    this.sort = config.nosort === undefined;
    this.filter = config.filter || false;

    if (!this.field && (this.sort || this.filter)) {
      throw new Error('field is required');
    }

    this.filterValue = config['filter-value'] || '';
  }

  hasFilter() {
    return this.filter;
  }

  hasFilterValue() {
    throw new Error('Unimplemented method!');
  }

  matchFilter(filteredValue) {
    throw new Error('Unimplemented method!');
  }

  getFilterValue() {
    throw new Error('Unimplemented method!');
  }

  compare(first, second) {
    throw new Error('Unimplemented method!');
  }

  createDOMElement() {
    let td = document.createElement('td');
    td.innerHTML = this.template;

    // Set attributes
    for (let prop in this.config) {
      if (this.config.hasOwnProperty(prop) && this.specialColumns[prop] === undefined) {
        td.setAttribute(prop, this.config[prop]);
      }
    }

    return td;
  }

  getFieldName() {
    return this.field;
  }

  changeDirectionSort() {
    switch (this.sortDirection) {
    case 'asc':
      this.sortDirection = 'desc';
      break;
    case 'desc':
      this.sortDirection = undefined;
      break;
    default:
      this.sortDirection = 'asc';
      break;
    }

    this.grid.changeSort({
      name: this.field,
      value: this.sortDirection,
      column: this
    });
  }

  setSortDirection(sortDirection) {
    this.sortDirection = sortDirection;
    let sort = {
      name: this.field,
      value: this.sortDirection,
      column: this
    };

    return sort;
  }

  isSortDirectionDesc() {
    return this.sortDirection === 'desc';
  }

  updateFilter() {
    this.grid.updateFilters();
  }

  _updateViewModelOnPropertyChange(viewModel, viewModelPropertyName, columnPropertyName) {
    const viewModelPropertyNameTokens = viewModelPropertyName.split('.');
    let subscription;
    if (viewModelPropertyNameTokens.length > 1) {
      subscription = this.grid.bindingEngine
        .propertyObserver(this, columnPropertyName)
        .subscribe((newValue, oldValue) => {
          let obj = viewModel;
          let i;
          for (i = 0; i < viewModelPropertyNameTokens.length - 1; i += 1) {
            obj = obj[viewModelPropertyNameTokens[i]];
          }

          obj[viewModelPropertyNameTokens[i]] = newValue;
        });
    } else {
      subscription = this.grid.bindingEngine
        .propertyObserver(this, columnPropertyName)
        .subscribe((newValue, oldValue) => {
          viewModel[viewModelPropertyName] = newValue;
        });
    }

    this._subscriptions.push(subscription);
  }

  subscribe(viewModelPropertyName, columnPropertyName) {
    if (viewModelPropertyName === undefined) {
      throw new Error('Argument exception! Argument "viewModelProperty" can\'t be empty!');
    }

    const viewModel = this.grid.parent;
    const viewModelPropertyNameTokens = viewModelPropertyName.split('.');
    let subscription, value;
    if (viewModelPropertyNameTokens.length > 1) {
      value = viewModelPropertyNameTokens.reduce((obj, token) => obj = obj[token], viewModel);

      subscription = this.grid.bindingEngine
        .expressionObserver(viewModel, viewModelPropertyName)
        .subscribe((newValue, oldValue) => {
          this.setColumnProperty(columnPropertyName, newValue);
        });
    } else {
      value = viewModel[viewModelPropertyName];
      subscription = this.grid.bindingEngine
        .propertyObserver(viewModel, viewModelPropertyName)
        .subscribe((newValue, oldValue) => {
          this.setColumnProperty(columnPropertyName, newValue);
        });
    }

    this._subscriptions.push(subscription);
    this._updateViewModelOnPropertyChange(viewModel, viewModelPropertyName, columnPropertyName);

    return value;
  }

  setColumnProperty(columnPropertyName, newValue) {
    this[columnPropertyName] = newValue;
    this.updateFilter();
  }

  unsubscribe() {
    this._subscriptions.forEach(s => s.dispose());
  }
}

import {LocalStore} from './local-store';
import {RemoteStore} from './remote-store';

export class StoreManager {
  constructor(grid) {
    //this.grid = grid;
    this.dataStore = this._getDataStore(grid);
  }

  getDataStore() {
    return this.dataStore;
  }

  _subscribeToDataCollectionChanges(grid) {
    this.dataCollectionSubscription = grid.bindingEngine
      .collectionObserver(grid.data)
      .subscribe(collectionChangeInfo => {
        grid.refresh();
      });
  }

  _getDataStore(grid) {
    const settings = {
      sortable: grid.sortable,
      filterable: grid.filterable,
      columnDefinitions: grid.columns,
      pageable: grid.pageable,
      pageSize: grid.pageSize,
      page: grid.page
    };
    let dataStore;
    if (grid.data !== null) {
      dataStore = new LocalStore(grid.data, settings);
      // todo: unsubscribe!!!!
      this._subscribeToDataCollectionChanges(grid);
      this.dataPropertySubscription = grid.bindingEngine
        .propertyObserver(grid, 'data')
        .subscribe((newItems, oldItems) => {
          this.dataCollectionSubscription.dispose();
          this._subscribeToDataCollectionChanges(grid);
          dataStore.refresh(newItems);
          grid.refresh();
        });
    } else {
      dataStore = new RemoteStore(grid.read, settings);
    }

    return dataStore;
  }

  unsubscribe() {
    if (this.dataPropertySubscription !== undefined) {
      this.dataPropertySubscription.dispose();
    }

    if (this.dataCollectionSubscription !== undefined) {
      this.dataCollectionSubscription.dispose();
    }
  }
}

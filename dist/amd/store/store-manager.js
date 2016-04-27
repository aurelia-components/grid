define(['exports', './local-store', './remote-store'], function (exports, _localStore, _remoteStore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.StoreManager = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var StoreManager = exports.StoreManager = function () {
    function StoreManager(grid) {
      _classCallCheck(this, StoreManager);

      this.dataStore = this._getDataStore(grid);
    }

    StoreManager.prototype.getDataStore = function getDataStore() {
      return this.dataStore;
    };

    StoreManager.prototype._subscribeToDataCollectionChanges = function _subscribeToDataCollectionChanges(grid) {
      this.dataCollectionSubscription = grid.bindingEngine.collectionObserver(grid.data).subscribe(function (collectionChangeInfo) {
        grid.refresh();
      });
    };

    StoreManager.prototype._getDataStore = function _getDataStore(grid) {
      var _this = this;

      var settings = {
        sortable: grid.sortable,
        filterable: grid.filterable,
        columnDefinitions: grid.columns,
        pageable: grid.pageable,
        pageSize: grid.pageSize,
        page: grid.page
      };
      var dataStore = void 0;
      if (grid.data !== null) {
        dataStore = new _localStore.LocalStore(grid.data, settings);

        this._subscribeToDataCollectionChanges(grid);
        this.dataPropertySubscription = grid.bindingEngine.propertyObserver(grid, 'data').subscribe(function (newItems, oldItems) {
          _this.dataCollectionSubscription.dispose();
          _this._subscribeToDataCollectionChanges(grid);
          dataStore.refresh(newItems);
          grid.refresh();
        });
      } else {
        dataStore = new _remoteStore.RemoteStore(grid.read, settings);
      }

      return dataStore;
    };

    StoreManager.prototype.unsubscribe = function unsubscribe() {
      if (this.dataPropertySubscription !== undefined) {
        this.dataPropertySubscription.dispose();
      }

      if (this.dataCollectionSubscription !== undefined) {
        this.dataCollectionSubscription.dispose();
      }
    };

    return StoreManager;
  }();
});
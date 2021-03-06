'use strict';

System.register(['./local-store', './remote-store'], function (_export, _context) {
  var LocalStore, RemoteStore, StoreManager;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_localStore) {
      LocalStore = _localStore.LocalStore;
    }, function (_remoteStore) {
      RemoteStore = _remoteStore.RemoteStore;
    }],
    execute: function () {
      _export('StoreManager', StoreManager = function () {
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
            dataStore = new LocalStore(grid.data, settings);

            this._subscribeToDataCollectionChanges(grid);
            this.dataPropertySubscription = grid.bindingEngine.propertyObserver(grid, 'data').subscribe(function (newItems, oldItems) {
              _this.dataCollectionSubscription.dispose();
              _this._subscribeToDataCollectionChanges(grid);
              dataStore.refresh(newItems);
              grid.refresh();
            });
          } else {
            dataStore = new RemoteStore(grid.read, settings);
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
      }());

      _export('StoreManager', StoreManager);
    }
  };
});
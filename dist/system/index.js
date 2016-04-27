'use strict';

System.register([], function (_export, _context) {
  return {
    setters: [],
    execute: function () {
      function configure(aurelia) {
        aurelia.globalResources('./grid/grid');
      }

      _export('configure', configure);
    }
  };
});
'use strict';

System.register([], function (_export, _context) {
  var customElementHelper;
  return {
    setters: [],
    execute: function () {
      _export('customElementHelper', customElementHelper = {
        dispatchEvent: function dispatchEvent(element, eventName, data) {
          var changeEvent = void 0;
          if (window.CustomEvent) {
            changeEvent = new CustomEvent(eventName, {
              detail: data,
              bubbles: true
            });
          } else {
            changeEvent = document.createEvent('CustomEvent');
            changeEvent.initCustomEvent(eventName, true, true, data);
          }

          element.dispatchEvent(changeEvent);
        },
        getAureliaViewModels: function getAureliaViewModels(element, selector) {
          return Array.from(element.getElementsByTagName(selector)).map(function (el) {
            if (el.au && el.au.controller) {
              return el.au.controller.viewModel;
            } else {
              throw new Error('Not an aurelia view model!');
            }
          });
        },
        debounce: function debounce(func, wait) {
          var timeout;

          return function () {
            var context = this,
                args = arguments;

            var later = function later() {
              timeout = null;
              func.apply(context, args);
            };

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
          };
        }
      });

      _export('customElementHelper', customElementHelper);
    }
  };
});
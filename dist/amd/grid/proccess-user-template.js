define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.processUserTemplate = processUserTemplate;
  function processUserTemplate(viewCompiler, viewResources, element, instruction) {
    var paginationElement = element.querySelector('grid-pagination');

    var rowElement = element.querySelector('grid-row');
    var columnElements = Array.prototype.slice.call(rowElement.querySelectorAll('grid-col'));

    var cols = columnElements.map(function (c) {
      return {
        attr: getAttributesHash(c.attributes),
        html: c.innerHTML
      };
    });

    var rowAttrs = getAttributesHash(rowElement.attributes);
    var paginationAttrs = paginationElement === null ? null : getAttributesHash(paginationElement.attributes);

    instruction.gridDefinition = {
      paginationAttrs: paginationAttrs,
      rowAttrs: rowAttrs,
      cols: cols
    };

    return true;
  }

  function getAttributesHash(attributes) {
    return Array.prototype.slice.call(attributes).reduce(function (acc, attribute) {
      acc[attribute.name] = attribute.value;
      return acc;
    }, {});
  }
});
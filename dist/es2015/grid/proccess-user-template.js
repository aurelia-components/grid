export function processUserTemplate(viewCompiler, viewResources, element, instruction) {
  let paginationElement = element.querySelector('grid-pagination');

  let rowElement = element.querySelector('grid-row');
  let columnElements = Array.prototype.slice.call(rowElement.querySelectorAll('grid-col'));

  let cols = columnElements.map(c => {
    return {
      attr: getAttributesHash(c.attributes),
      html: c.innerHTML
    };
  });

  let rowAttrs = getAttributesHash(rowElement.attributes);
  let paginationAttrs = paginationElement === null ? null : getAttributesHash(paginationElement.attributes);

  instruction.gridDefinition = {
    paginationAttrs: paginationAttrs,
    rowAttrs: rowAttrs,
    cols: cols
  };

  return true;
}

function getAttributesHash(attributes) {
  return Array.prototype.slice.call(attributes).reduce((acc, attribute) => {
    acc[attribute.name] = attribute.value;
    return acc;
  }, {});
}
export function processUserTemplate(viewCompiler, viewResources, element, instruction) {
  // todo: implement - place pagination options onto this custom element
  let paginationElement = element.querySelector('grid-pagination');
  // Get any col tags from the content
  let rowElement = element.querySelector('grid-row');
  let columnElements = Array.prototype.slice.call(rowElement.querySelectorAll('grid-col'));

  let cols = columnElements.map(c => {
    return {
      attr: getAttributesHash(c.attributes),
      html: c.innerHTML
    };
  });

  // Pull any row attrs into a hash object
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
  return Array.prototype.slice.call(attributes)
    .reduce((acc, attribute) => {
      acc[attribute.name] = attribute.value;
      return acc;
    }, {});
}

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import { bindable, customElement } from 'aurelia-framework';

export let Pager = (_dec = customElement('pager'), _dec(_class = (_class2 = class Pager {
  constructor() {
    _initDefineProp(this, 'onPageChanged', _descriptor, this);

    _initDefineProp(this, 'numToShow', _descriptor2, this);

    this.nextDisabled = false;
    this.prevDisabled = false;

    _initDefineProp(this, 'showFirstLastButtons', _descriptor3, this);

    _initDefineProp(this, 'showJumpButtons', _descriptor4, this);

    this.page = 1;
    this.pageCount = 0;
    this.pages = [];
  }

  changePage(page) {
    const oldPage = this.page;
    this.page = this.cap(page);
    if (oldPage !== this.page) {
      this.onPageChanged(this.page);
    }
  }

  update(page, pagesize, totalItems) {
    this.page = page;
    this.totalItems = totalItems;
    this.pageSize = pagesize;

    this.createPages();
  }

  cap(page) {
    if (page < 1) {
      return 1;
    } else if (page > this.pageCount) {
      return this.pageCount;
    } else {
      return page;
    }
  }

  createPages() {
    this.pageCount = Math.ceil(this.totalItems / this.pageSize);
    this.page = this.cap(this.page);

    let numToRender = this.pageCount < this.numToShow ? this.pageCount : this.numToShow;

    let indicatorPosition = Math.ceil(numToRender / 2);

    let firstPageNumber = this.page - indicatorPosition + 1;

    if (firstPageNumber < 1) {
      firstPageNumber = 1;
    }

    let lastPageNumber = firstPageNumber + numToRender - 1;

    if (lastPageNumber > this.pageCount) {
      let dif = this.pageCount - lastPageNumber;

      firstPageNumber += dif;
      lastPageNumber += dif;
    }

    let pages = [];

    for (var i = firstPageNumber; i <= lastPageNumber; i++) {
      pages.push(i);
    }

    this.pages = pages;

    this.updateButtons();
  }

  updateButtons() {
    this.nextDisabled = this.page === this.pageCount;
    this.prevDisabled = this.page === 1;
  }

  next() {
    this.changePage(this.page + 1);
  }

  nextJump() {
    this.changePage(this.page + this.numToShow);
  }

  prev() {
    this.changePage(this.page - 1);
  }

  prevJump() {
    this.changePage(this.page - this.numToShow);
  }

  first() {
    this.changePage(1);
  }

  last() {
    this.changePage(this.pageCount);
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'onPageChanged', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'numToShow', [bindable], {
  enumerable: true,
  initializer: function () {
    return 5;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'showFirstLastButtons', [bindable], {
  enumerable: true,
  initializer: function () {
    return true;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'showJumpButtons', [bindable], {
  enumerable: true,
  initializer: function () {
    return true;
  }
})), _class2)) || _class);
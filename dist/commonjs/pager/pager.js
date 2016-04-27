'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pager = undefined;

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

var _aureliaFramework = require('aurelia-framework');

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var Pager = exports.Pager = (_dec = (0, _aureliaFramework.customElement)('pager'), _dec(_class = (_class2 = function () {
  function Pager() {
    _classCallCheck(this, Pager);

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

  Pager.prototype.changePage = function changePage(page) {
    var oldPage = this.page;
    this.page = this.cap(page);
    if (oldPage !== this.page) {
      this.onPageChanged(this.page);
    }
  };

  Pager.prototype.update = function update(page, pagesize, totalItems) {
    this.page = page;
    this.totalItems = totalItems;
    this.pageSize = pagesize;

    this.createPages();
  };

  Pager.prototype.cap = function cap(page) {
    if (page < 1) {
      return 1;
    } else if (page > this.pageCount) {
      return this.pageCount;
    } else {
      return page;
    }
  };

  Pager.prototype.createPages = function createPages() {
    this.pageCount = Math.ceil(this.totalItems / this.pageSize);
    this.page = this.cap(this.page);

    var numToRender = this.pageCount < this.numToShow ? this.pageCount : this.numToShow;

    var indicatorPosition = Math.ceil(numToRender / 2);

    var firstPageNumber = this.page - indicatorPosition + 1;

    if (firstPageNumber < 1) {
      firstPageNumber = 1;
    }

    var lastPageNumber = firstPageNumber + numToRender - 1;

    if (lastPageNumber > this.pageCount) {
      var dif = this.pageCount - lastPageNumber;

      firstPageNumber += dif;
      lastPageNumber += dif;
    }

    var pages = [];

    for (var i = firstPageNumber; i <= lastPageNumber; i++) {
      pages.push(i);
    }

    this.pages = pages;

    this.updateButtons();
  };

  Pager.prototype.updateButtons = function updateButtons() {
    this.nextDisabled = this.page === this.pageCount;
    this.prevDisabled = this.page === 1;
  };

  Pager.prototype.next = function next() {
    this.changePage(this.page + 1);
  };

  Pager.prototype.nextJump = function nextJump() {
    this.changePage(this.page + this.numToShow);
  };

  Pager.prototype.prev = function prev() {
    this.changePage(this.page - 1);
  };

  Pager.prototype.prevJump = function prevJump() {
    this.changePage(this.page - this.numToShow);
  };

  Pager.prototype.first = function first() {
    this.changePage(1);
  };

  Pager.prototype.last = function last() {
    this.changePage(this.pageCount);
  };

  return Pager;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'onPageChanged', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'numToShow', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return 5;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'showFirstLastButtons', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'showJumpButtons', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
})), _class2)) || _class);
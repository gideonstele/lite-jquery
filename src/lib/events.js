import ys from '../tools/ys';

function createDelegate(_this, el, selector, type, fn, capture) {

  el.addEventListener(type, function (e) {
    const target = e.target || e.srcElement;
    e.delegateTarget = _this.closest.call([target], selector, el);
    if (e.delegateTarget) fn.call(el, e);
  }, capture);
}

function distoryDelegate(el, type, fn, capture) {
  el.removeEventListener(type, fn, capture);
}

/**
 * Bind to `event` and invoke `fn(e)`. When
 * a `selector` is given then events are delegated.
 *
 * @param {String} event
 * @param {String} [selector]
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {List}
 * @api public
 */
export function on(event, selector, fn, capture) {
  const _this = this;
  if (ys.str(selector)) {
    return this.forEach(function () {
      fn._delegate = createDelegate(_this, this, selector, event, fn, capture);
    });
  }

  capture = fn;
  fn = selector;

  return this.forEach(function () {
    this.addEventListener(event, fn, capture);
  });
}

export function off(event, selector, fn, capture) {
  if (ys.str(selector)) {
    return this.forEach(function () {
      distoryDelegate(this, event, fn, capture);
    });
  }

  capture = fn;
  fn = selector;

  return this.forEach(function () {
    this.removeEventListener(event, fn, capture);
  });
}

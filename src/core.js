/**
 * @module Core
 */

import { doc, quickExpr } from './config/const';
import { getExpando } from './config/var';
import ys from './tools/ys';
import { trimLeft } from './tools/string';
import parseHTML from './lib/parseHTML';
import { qsa, matchSelector, contains } from './lib/qsa';
import { closest } from './lib/selector';
import { removeAttr, attr, prop, hasAttr, value } from './lib/attributes';
import { on, one, off } from './jquery/events';

function isHTML(str) {
  // Faster than running regex, if str starts with `<` and ends with `>`, assume it's HTML
  if (str.charAt(0) === '<' && str.charAt(str.length - 1) === '>' && str.length >= 3) return true;

  // Run the regex
  var match = quickExpr.exec(str);
  return !!(match && match[1]);
}

/**
 * Remake the list
 *
 * @param {String|ELement|context} context
 * @return {List}
 * @api private
 */
function List(els = [], selector) {
  const len = this.length = els.length;
  for (let i = 0; i < len; i++) {
    this[i] = els[i];
  }
  this.selector = selector;
}
List.fn = List.prototype;
List.fn.length = 0;
List.fn.splice = Array.prototype.splice;
List.fn.forEach = List.fn.each = function (callback) {
  const l = this.length;
  let t;
  for (let i = 0; i < l; i++) {
    t = this[i];

    if (callback && callback.call(t, i, t) === false) {
      return this;
    }
  }
  return this;
};

// add attributes
List.fn.removeAttr = removeAttr;
List.fn.hasAttr = hasAttr;
List.fn.attr = attr;
List.fn.prop = prop;
List.fn.val = value;

// add dom operator
List.fn.closest = List.fn.parent = closest;

/**
 * @name on
 * @param {string, object} event
 * @param {string} [selector]
 * @param {function} [fn]
 * @param {object} [options]
 */
List.fn.on = function (event, selector, fn, options) {

  /**
   * @description Event can be a map of types/handlers
   * @argument event = { type1: fn1, type2: fn2 }
   * @argument selector = fn || selector
   * @argument options = fn || options
   */
  if (ys.obj(event)) {

    // ( types-Object, selector, options)
    if (ys.str(selector)) {
      options = fn;
    }

    if (ys.obj(selector)) {
      options = selector;
      selector = undefined;
    }

    fn = undefined;

    for (let name in event) {
      on(this, name, selector, event[name], options);
    }

    return this;
  }

  /**
   * @argument {string} event
   * @argument {string} [selector]
   * @argument {function} fn
   */
  if (!ys.str(selector)) {
    options = fn;
    fn = selector;
    selector = undefined;
  }
  on(this, event, selector, fn, options);
  return this;
};

List.fn.one = List.fn.once = function (event, selector, fn, options) {
  /**
   * @description Event can be a map of types/handlers
   * @argument event = { type1: fn1, type2: fn2 }
   * @argument selector = fn || selector
   * @argument options = fn || options
   */
  if (ys.obj(event)) {

    // ( types-Object, selector, options)
    if (ys.str(selector)) {
      options = fn;
    }

    if (ys.obj(selector)) {
      options = selector;
      selector = undefined;
    }

    fn = undefined;

    for (let name in event) {
      one(this, name, selector, event[name], options);
    }

    return this;
  }

  /**
   * @argument {string} event
   * @argument {string} [selector]
   * @argument {function} fn
   */
  if (!ys.str(selector)) {
    options = fn;
    fn = selector;
    selector = undefined;
  }

  one(this, event, selector, fn, options);
  return this;
};

List.fn.off = function (event, selector, fn) {
  off(this, event, selector, fn);
  return this;
};


/**
 * Return a dom `List` for the given
 * `html`, selector, or element.
 *
 * @param {String|Element|List} selector
 * @param {String|ELement|context} context
 * @return {List}
 * @api public
 */
function dom(selector, context = doc) {
  // array like
  if (ys.array(selector)) {
    return new List(selector);
  }

  // List
  if (selector instanceof List) {
    return selector;
  }

  // nodeName
  if (selector.nodeName) {
    return new List([selector]);
  }

  if (!ys.str(selector)) {
    throw new TypeError('invalid selector');
  }

  // html
  const htmlSelector = trimLeft(selector);
  if (isHTML(htmlSelector)) {
    return new List([parseHTML(htmlSelector)], htmlSelector);
  }

  // selector
  const _context = context ? ((context instanceof List) ? context[0] : context) : doc;

  return new List(dom.qsa(selector, _context), selector);
}

dom.fn = List.fn;

dom.List = List;

dom.isHTML = isHTML;

dom.expando = List.expando = getExpando();

dom.contains = contains;
/**
 * @description 根据选择符查询dom集合
 * @override 可由第三方重写覆盖
 */
dom.query = dom.qsa = qsa;

/**
 * @description 检测给定的元素是否匹配给定的选择符
 * @override 可由第三方重写覆盖
 */
dom.match = dom.matches = dom.matchSelector = matchSelector;

export default dom;

import {
  doc,
  quickExpr
} from './config/const';
import ys from './tools/ys';
import {
  trimLeft
} from './tools/string';
import parseHTML from './lib/parseHTML';
import { removeAttr, attr, prop, hasAttr, value } from './lib/attributes';
import { on, off } from './lib/events';
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
List.fn.closest = List.fn.parent = function (selector, scope = doc.documentElement) {
  let el = this[0];
  while (el && el !== scope) {
    if (dom.match(el, selector)) {
      return el;
    }
    el = el.parentNode;
  }
  return dom.match(el, selector) ? el : null;
};

// events
List.fn.on = on;
List.fn.off = off;


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

/**
 * @description 根据选择符查询dom集合
 * @override 可由第三方重写覆盖
 */
dom.query = dom.qsa = function (selector, el = doc) {
  return el.querySelectorAll(selector);
};

const matches = Element.prototype.matches
  || Element.prototype.webkitMatchesSelector
  || Element.prototype.mozMatchesSelector
  || Element.prototype.msMatchesSelector
  || Element.prototype.oMatchesSelector;

/**
 * @description 检测给定的元素是否匹配给定的选择符
 * @override 可由第三方重写覆盖
 */
dom.match = dom.matches = dom.matchSelector = function (el, selector) {
  if (!el || el.nodeType !== 1) {
    return false;
  }
  if (matches) {
    return matches.call(el, selector);
  }
  const nodes = dom.qsa(selector, el.parentNode);
  for (let i = 0; i < nodes.length; ++i) {
    if (nodes[i] === el) return true;
  }
  return false;
};

export default dom;

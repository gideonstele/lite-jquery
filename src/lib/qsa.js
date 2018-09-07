import { doc } from '../config/const';

const matches = Element.prototype.matches ||
  Element.prototype.webkitMatchesSelector ||
  Element.prototype.mozMatchesSelector ||
  Element.prototype.msMatchesSelector ||
  Element.prototype.oMatchesSelector;

export function qsa(selector, el = doc) {
  return el.querySelectorAll(selector);
}

export function matchSelector(el, selector) {
  if (!el || el.nodeType !== 1) {
    return false;
  }
  if (matches) {
    return matches.call(el, selector);
  }
  const nodes = qsa(selector, el.parentNode);
  for (let i = 0; i < nodes.length; ++i) {
    if (nodes[i] === el) return true;
  }
  return false;
};

export function contains(target, el) {
  const adown = target.nodeType === 9 ? target.documentElement : target;
  const bup = el && el.parentNode;
  return adown === bup || !!(bup && bup.nodeType === 1 && adown.contains && adown.contains(bup));
}

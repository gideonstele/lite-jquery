import { doc, docEl, rnative } from '../config/const';

const matches =
  Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;

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
}

export function matchSelectors(els, selector) {
  return Array.prototype.reduce.call(
    els,
    function(reducer, el, index) {
      if (matchSelector(el, selector)) {
        reducer.push(el);
      }
      return reducer;
    },
    []
  );
}

/* Contains
  ---------------------------------------------------------------------- */
/**
 * @export contains
 * @see https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L850
 * @param {Element,NodeList} container
 * @param {Element} contained
 */
export const contains =
  rnative.test(docEl.compareDocumentPosition) || rnative.test(docEl.contains)
    ? function(a, b) {
        var adown = a.nodeType === 9 ? a.documentElement : a,
          bup = b && b.parentNode;
        return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
      }
    : function(a, b) {
        if (b) {
          while ((b = b.parentNode)) {
            if (b === a) {
              return true;
            }
          }
        }
        return false;
      };

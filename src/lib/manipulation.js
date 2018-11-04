import { findFilter } from '../jquery/findFilter';

/**
 *
 * @see https://github.com/jquery/jquery/blob/master/src/manipulation.js#L126
 * @param {ArrayLike<>}
 */

/**
 *
 * @export remove
 * @see https://github.com/jquery/jquery/blob/master/src/manipulation.js#L216
 * @param {Element} el
 * @param {String} string
 * @returns
 */
export function remove(el, selector) {
  let nodes = selector ? findFilter(selector, el) : el;
  let node;

  for (let i = 0; (node = nodes[i]) != null; i++) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }

  return el;
}

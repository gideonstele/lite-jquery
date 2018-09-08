import ys from '../tools/ys';
import {
  difference
} from 'lodash-es';
import {
  matchSelector,
  matchSelectors
} from '../lib/qsa';
import {
  grep
} from './core';

/**
 *
 * @callback https://github.com/jquery/jquery/blob/f997241f0011ed728be71002bc703c7a0d3f01e5/src/traversing/findFilter.js#L12
 * @param {ArrayLike<Element>} els
 * @param {Function, Element, ArrayLike<Element>} qualifier
 * @param {Boolean} not
 * @returns
 */
export function winnow(els, qualifier, not) {
  if (ys.func(qualifier)) {
    return grep(els, function (el, i) {
      return !!qualifier.call(el, i, el) !== not;
    });
  }

  if (qualifier.nodeType) {
    return grep(els, function (el) {
      return (el === qualifier) !== not;
    });
  }

  if (typeof qualifier !== 'string') {
    return grep(els, function (el) {
      return ([].indexOf.call(qualifier, el) > -1) !== not;
    });
  }

  return findFilter(qualifier, els, not);

}

export function findFilter(expr, els, not) {
  const el = els[0];
  if (els.length === 1 && el.nodeType === 1) {
    const result = matchSelector(el, expr);
    if (not) {
      return result ? [] : [el];
    }
    return result ? [el] : [];
  }
  const matches = matchSelectors(grep(els, function (el) {
    return el.nodeType === 1;
  }), expr);
  if (not) {
    return difference(els, matches);
  }
  return matches;
}

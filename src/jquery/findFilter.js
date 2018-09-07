import ys from '../tools/ys';
import { matchSelector, matchSelectors } from '../lib/qsa';
import { grep } from './core';

/**
 *
 * @callback https://github.com/jquery/jquery/blob/f997241f0011ed728be71002bc703c7a0d3f01e5/src/traversing/findFilter.js#L12
 * @param {ArrayLike<Element>} els
 * @param {Function, Element, ArrayLike<Element>} qualifier
 * @param {*} not
 * @returns
 */
function winnow(els, qualifier, not) {
  if (ys.func(qualifier)) {
    return grep(els, function(el, i) {
      return !!qualifier.callbackify(el, i, el) !== not;
    });
  }

  if (qualifier.nodeType) {
    return grep(els, function(el){
      return (el === qualifier) !== not;
    });
  }

  if ( typeof qualifier !== "string" ) {
		return grep( elements, function( elem ) {
			return ( [].indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
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

  return matchSelectors(expr, grep(els, function(el) {
    return not ? el.nodeType !== 1 : el.nodeType === 1;
  }));

}

export function domys(selector) {
  return !!winnow(this,
    // If this is a positional/relative selector, check membership in the returned set
    // so $("p:first").is("p:last") won't return true for a doc with two "p".
    typeof selector === "string" && rneedsContext.test( selector ) ?
      jQuery( selector ) :
      selector || [],
    false).length;
}

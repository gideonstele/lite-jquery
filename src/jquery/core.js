/**
 *
 * @module 从jquery/core和sizzle中移植的部分代码
 */
import {
  contains
} from '../lib/qsa';
import {
  getExpando
} from '../config/var';
/**
 *
 * @export
 * @see https://github.com/jquery/jquery/blob/master/src/core.js#L309
 * @param {ArrayLike<Elements>} els
 * @param {Function} callback
 * @param {Boolean} invert
 */
export function grep(els, callback, invert) {
  const matches = [],
    callbackExpect = !invert;

  // Go through the array, only saving the items
  // that pass the validator function
  for (let i = 0, length = els.length; i < length; i++) {
    const callbackInverse = !callback(els[i], i);
    if (callbackInverse !== callbackExpect) {
      matches.push(els[i]);
    }
  }

  return matches;
}

/**
 * @see https://github.com/jquery/jquery/blob/master/src/selector-native.js#L37
 */
var sortInput, hasDuplicate;
const sortOrder = function (a, b) {
  // Flag for duplicate removal
  if (a === b) {
    hasDuplicate = true;
    return 0;
  }
  // Sort on method existence if only one input has compareDocumentPosition
  let compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
  if (compare) {
    return compare;
  }
  // Calculate position if both inputs belong to the same document
  compare = (a.ownerDocument || a) === (b.ownerDocument || b) ?
    a.compareDocumentPosition(b) :
    // Otherwise we know they are disconnected
    1;

  // Disconnected nodes
  if (compare & 1) {
    // Choose the first element that is related to our preferred document
    if (a === document || a.ownerDocument === document &&
      contains(document, a)) {
      return -1;
    }
    if (b === document || b.ownerDocument === document &&
      contains(document, b)) {
      return 1;
    }
    // Maintain original order
    return sortInput ?
      (Array.prototype.indexOf.call(sortInput, a) - Array.prototype.indexOf.call(sortInput, b)) :
      0;
  }

  return compare & 4 ? -1 : 1;

};

const sortStable = getExpando().split('').sort(sortOrder).join('') === getExpando();
/**
 *
 * @export
 * @see https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L1048
 * @description Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
export function uniqueSort(results) {
  const duplicates = [];
  let i = 0,
    j = 0,
    el;
  hasDuplicate = false;
  sortInput = !sortStable && (
    results.slice ? results.slice(results, 0) : Array.prototype.slice.call(results, 0));

  Array.prototype.sort.call(results, sortOrder);

  if (hasDuplicate) {
    while ((el = results[i++])) {
      if (el === results[i]) {
        j = duplicates.push(i);
      }
    }
    while (j--) {
      results.splice(duplicates[j], 1);
    }
  }

  // Clear input after sorting to release objects
  // See https://github.com/jquery/sizzle/pull/225
  sortInput = null;

  return results;

}

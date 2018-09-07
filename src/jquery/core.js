

/**
 *
 * @export
 * @callback https://github.com/jquery/jquery/blob/master/src/core.js#L309
 * @param {ArrayLike<Elements>} els
 * @param {Function} callback
 * @param {Boolean} invert
 */
export function grep(els, callback, invert) {
  const matches = [], callbackExpect = !invert;

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

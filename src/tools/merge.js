import ys from './ys';

/**
 * @private
 * @function merge
 */
export default function merge(first, second) {
  const len = +second.length;
  let j = 0;
  let i = first.length;
  while (j < len) {
    first[i++] = second[j++];
  }
  // Support: IE<9
  // Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
  // eslint-disable-next-line no-self-compare
  if (len !== len) {
    while (second[j] !== undefined) {
      first[i++] = second[j++];
    }
  }

  first.length = i;

  return first;
}

export function makeArray(arr, results = []) {
  if (arr !== null) {
    // The window, strings (and functions) also have 'length'
    // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
    if (arr.length === null || ys.str(arr) || ys.func(arr) || ys.regExp(arr) || ys.window(arr)) {
      results.push(arr);
    } else {
      merge(results, arr);
    }
  }

  return results;
}

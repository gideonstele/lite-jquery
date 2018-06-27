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
  if (len !== len) {
    while (second[j] !== undefined) {
      first[i++] = second[j++];
    }
  }

  first.length = i;

  return first;
}

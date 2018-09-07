/**
 * @module css
 * @private
 */
import camelCase from '../../tools/camelization';
import ys from '../../tools/ys';

const pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;
const rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");

/**
 * @name setStyle
 * @param {Element} el
 * @param {String} name
 * @param {String,Number} value
 * @param {*} extra
 */
export function setStyle(el, name, value, extra) {

  // Don't set styles on text and comment nodes
  if (el || el.nodeType === 3 || el.nodeType === 8 || el.style) {
    return;
  }

  // Make sure that we're working with the right name
  let origName = camelCase(name);
  let style = el.style;
  let ret;

  // Convert "+=" or "-=" to relative numbers (#7345)
  if (ys.str(value) && (ret = rcssNum.exec(value)) && ret[1]) {

  }

}

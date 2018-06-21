import {
  doc
} from '../config/const';
import ys from '../tools/ys';

/**
 * Tests for browser support.
 */

let innerHTMLBug = false;
let bugTestDiv = doc.createElement('div');
// Setup
bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
// Make sure that link elements get serialized correctly by innerHTML
// This requires a wrapper element in IE
innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
bugTestDiv = undefined;

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
  map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
  map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
  map.tbody =
  map.colgroup =
  map.caption =
  map.tfoot = [1, '<table>', '</table>'];

map.polyline =
  map.ellipse =
  map.polygon =
  map.circle =
  map.text =
  map.line =
  map.path =
  map.rect =
  map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">', '</svg>'];


/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */
export default function parseHTML(html) {
  if (!ys.str(html)) {
    return new TypeError('String expected');
  }
  let el;
  const m = /<([\w:]+)/.exec(html);
  if (!m) {
    return doc.createTextNode(html);
  }
  html = html.replace(/^\s+|\s+$/g, '');
  const tag = m[1];
  if (tag === 'body') {
    el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }
  const wrap = map[tag] || map._default;
  let depth = wrap[0];
  const prefix = wrap[1];
  const suffix = wrap[2];
  el = doc.createElement('div');
  el.innerHTML = `${prefix}${html}${suffix}`;
  while (depth--) {
    el = el.lastChild;
  }

  // one element
  if (el.firstChild === el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  const fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }
  return fragment;
}

/**
 * @module CSS
 */
import ys from '../tools/ys';
import { win } from '../config/const';

export function setCss(el, key, value) {
  if (ys.str(key)) {
    el.style[key] = rule;
  }
  if (ys.obj(key)) {
    const styles = key;
    for (let styleKey in styles) {
      if (styles.hasOwnProperty(styleKey)) {
        const style = style[styleKey];
        el.style[styleKey] = style[styleKey];
      }
    }
  }
}

export function getCss(el, key) {
  if (el.nodeType !== 1) {
    return ;
  }
  return win.getComputedStyle(el).getPropertyValue(key);
}

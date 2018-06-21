/**
 * @module Selector
 */
import { doc } from '../config/const';
import { matchSelector } from './qsa';

export function closest(selector, scope = doc.documentElement) {
  let el = this[0];
  while (el && el !== scope) {
    if (matchSelector(el, selector)) {
      return el;
    }
    el = el.parentNode;
  }
  return matchSelector(el, selector) ? el : null;
};

/**
 * @description 检测类型
 */

import { isError, isFunction, isArray, isEmpty, isObject, isPlainObject, isBoolean } from 'lodash-es';
import { loc } from '../config/const';

const ys = {
  obj: isObject,
  plainObject: isPlainObject,
  array: isArray,
  func: isFunction,
  bool: isBoolean,
  empty: isEmpty,
  err: isError,
  arguments(val) {
    return Object.prototype.toString(val) === '[object Arguments]';
  },
  str(input) {
    return input != null && (input.constructor + '').indexOf('String') > -1;
  },
  regExp(val) {
    return Object.prototype.toString(val) === '[object RegExp]';
  },
  date(val) {
    return Object.prototype.toString(val) === '[object Date]';
  },
  element(val) {
    return val.nodeType === 1;
  },
  window(val) {
    return val !== null && val === val.window;
  },
  isBuffer(obj) {
    return !!(
      obj != null &&
      (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
        (obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)))
    );
  },
  HTTPS() {
    return loc.protocol === 'https:';
  },
  thenable(f) {
    return f && ys.func(f.then);
  }
};

export default ys;

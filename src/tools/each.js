import ys from './ys';

/**
 * Iterate string chars.
 *
 * @param {String} obj
 * @param {Function} fn
 * @param {Object} ctx
 * @api private
 */
function eachString(obj, fn, ctx) {
  for (let i = 0; i < obj.length; ++i) {
    fn.call(ctx, obj.charAt(i), i);
  }
}

/**
 * Iterate object keys.
 *
 * @param {Object} obj
 * @param {Function} fn
 * @param {Object} ctx
 * @api private
 */
function eachObject(obj, fn, ctx) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      fn.call(ctx, key, obj[key]);
    }
  }
}

/**
 * Iterate array-ish.
 *
 * @param {Array|Object} obj
 * @param {Function} fn
 * @param {Object} ctx
 * @api private
 */
function eachArray(obj, fn, ctx) {
  for (var i = 0; i < obj.length; ++i) {
    fn.call(ctx, obj[i], i);
  }
}

export default function each(obj, fn, ctx) {
  ctx = ctx || this;
  if (ys.array(obj)) {
    return eachArray(obj, fn, ctx);
  } else if (ys.obj(obj)) {
    return eachObject(obj, fn, ctx);
  } else if (ys.str(obj)) {
    return eachString(obj, fn, ctx);
  }
}

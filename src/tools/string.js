/**
 * @module tools/string
 * @description 处理字符串相关内容
 */

/**
 * @function startsWith
 * @description 检测字符串是否以给定的字符串开始
 * @param {string} str - 被检测的字符串
 * @param {string} part - 开始字符串
 * @returns {boolean}
 */
export function startsWith(str, part) {
  if ('string' !== typeof str) {
    return TypeError();
  }
  return str.indexOf(part) === 0;
}

/**
 * @function endsWith
 * @description 检测字符串是否以给定的字符串结尾
 * @param {string} str - 被检测的字符串
 * @param {string} part - 结尾字符串
 * @param {string} len
 * @returns {boolean}
 */
export function endsWith(str, part, len) {
  if ('string' !== typeof str) {
    return TypeError();
  }
  if (len === undefined || len > str.length) {
    len = str.length;
  }
  return str.substring(len - part.length, len) === part;
}

export function trim(str) {
  if (str.trim) return str.trim();
  return str ? str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '') : '';
}

export function trimLeft(str) {
  if (str.trimLeft) return str.trimLeft();
  return str.replace(/^\s*/, '');
}

export function trimRight(str) {
  if (str.trimRight) return str.trimRight();
  return str.replace(/^\s*/, '');
}

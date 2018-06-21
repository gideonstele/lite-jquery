/**
 * @module Events
 */
import { cloneDeep } from 'lodash-es';
import { rspace, rtypenamespace } from '../config/const';
import { getExpando } from '../config/var';
import { closest } from "./selector";
import Data from './data';

let count = 0;

/**
 * @description handler cache and namespaces cache
 * @attribute special 特殊事件
 */
const objEvent = {
  /**
   * @property cache
   * @description 对每一次绑定进行对应的描述
   *   例如
   *   ```javascript
   *   [cacheId]: {
   *      id: [cacheId],
   *      selector: String,
   *      ns_str: String,
   *      originEventType: String,
   *      eventType: String,
   *      handler: Array<String> function.guid
   *   }
   *   ```
   * @property namespaces
   * @description 对命名空间映射关系进行缓存
   *   例如
   *   ```javascript
   *   [eventname]: {
   *     [namespace1]: Array<String>,
   *     ...
   *   }
   *   ```
   * @property handlers
   * @description 对每个事件回调进行缓存
   *   例如
   *   ```javascript
   *
   *   ```
  */
  cache: {},
  namespace: {},
  handlers: {},
  data: new Data(),
  guid: 1,
  special: {
    focus: {
      delegateType: 'focusin'
    },
    blur: {
      delegateType: 'focusout'
    },
  }
};

/**
 * Shorthand for `addEventListener`. Supports event delegation if a filter (`selector`) is provided.
 *
 * @param {List} self
 * @param {String} eventNames List of space-separated event types to be added to the element(s)
 * @param {String} [selector] Selector to filter descendants that delegate the event to this element.
 * @param {Function} handler Event handler
 * @param {Object} options={capture: false, once: false, data: {}}
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').on('click', callback);
 *     $('.item').on('click.yourEventName', callback);
 *     $('.container').on('click focus', '.item', handler);
 */

export function on(self, eventNames, selector, handler, options) {

  if (!eventNames) {
    throw new Error('Event must have one name at least.');
  }

  handler.guid = handler.guid || objEvent.guid++;

  // 尝试取出多个事件
  // 例如 'click mousedown' => ['click', 'mousedown']
  (eventNames.match(rspace) || ['']).forEach(eventName => {

    // 尝试取出事件的命名空间
    // 例如 'mouseover.a.b' => ['mouseover.a.b', 'mouseover', 'a.b']
    const tmp = rtypenamespace.exec(eventName) || [];
    // 取出事件类型， 例如 mouserover
    let eventType = tmp[1];
    // 取出事件命名空间并分解命名空间，如 'a.b' => ['a', 'b']
    const ns_str = tmp[2] || '';
    const namespaces = ns_str.split('.').sort();

    // There *must* be a type, no attaching namespace-only handlers
    if (!eventType) {
      return;
    }

    // 事件是否会改变当前状态，如果会则使用特殊事件
    let special = objEvent.special[eventType] || {};

    // 根据是否已定义selector，决定使用哪个特殊事件api，如果没有非特殊事件，则用type
    const originEventType = eventType;
    eventType = (selector ? special.delegateType : special.bindType) || eventType;

    // type状态发生改变，重新定义特殊事件
    special = objEvent.special[eventType] || {};

    // 建立对应代理的缓存
    let cacheId; // = getExpando() + (count++);
    for (let eventKey in objEvent.cache) {
      const _cache = objEvent.cache[eventKey];
      if (_cache.selector === selector && _cache.ns_str === ns_str && _cache.eventType === eventType) {
        cacheId = eventKey;
        break;
      }
    }
    if (!cacheId) {
      cacheId = getExpando() + (count++);
    }
    objEvent.cache[cacheId] = objEvent.cache[cacheId] || {};
    let handlerGuids = objEvent.cache[cacheId].handler;
    objEvent.cache[cacheId] = cloneDeep({
      id: cacheId,
      selector,
      ns_str,
      originEventType,
      eventType,
    }, objEvent.cache[cacheId]);

    objEvent.cache[cacheId].handler = handlerGuids ? [handler.guid].concat(handlerGuids) : [handler.guid];

    // 如果存在命名空间，则加入命名空间映射
    if (namespaces.length) {
      objEvent.namespace[eventType] = objEvent.namespace[eventType] || [];
      const nsEventType = objEvent.namespace[eventType];
      namespaces.forEach(ns => {
        if (!nsEventType[ns]) {
          nsEventType[ns] = [];
        }
        nsEventType[ns].push(cacheId);
      });
    }

    self.each(function () {
      const el = this;

    });
  });
}

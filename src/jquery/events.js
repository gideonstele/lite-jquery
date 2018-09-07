import extend from '../tools/extend';
import ys from '../tools/ys';
import each from '../tools/each';
import {
  qsa,
  matchSelector,
  contains
} from '../lib/qsa';
import Data from '../lib/data';
import {
  getExpando
} from '../config/var';
import {
  rtypenamespace,
  rspace,
  doc
} from '../config/const';
import {
  makeArray
} from '../tools/merge';

const rkeyEvent = /^key/;
const rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;
const rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;
const stopPropagationCallback = function (e) {
  e.stopPropagation();
};
// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
  try {
    return document.activeElement;
  } catch (err) {}
}

let guid = 1;

function returnTrue() {
  return true;
}

function returnFalse() {
  return false;
}

function nodeName(elem, name) {
  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
}

const objEvent = {
  data: new Data(),
  global: {},
  special: {
    load: {
      // Prevent triggered image.load events from bubbling to window.load
      noBubble: true
    },
    focus: {
      delegateType: 'focusin',

      // Fire native event if possible so blur/focus sequence is correct
      trigger() {
        if (this !== safeActiveElement() && this.focus) {
          this.focus();
          return false;
        }
      }
    },
    blur: {
      delegateType: 'focusout',
      trigger() {
        if (this === safeActiveElement() && this.blur) {
          this.blur();
          return false;
        }
      }
    },
    click: {
      // For checkbox, fire native event so checked state will be right
      trigger() {
        if (this.type === 'checkbox' && this.click && nodeName(this, 'input')) {
          this.click();
          return false;
        }
      },
      // For cross-browser consistency, don't fire native .click() on links
      _default(event) {
        return nodeName(event.target, 'a');
      }
    },
    beforeunload: {
      postDispatch(event) {
        // Support: Firefox 20+
        // Firefox doesn't alert if the returnValue field is not set.
        if (event.result !== undefined && event.originalEvent) {
          event.originalEvent.returnValue = event.result;
        }
      }
    }
  },
  fix(originalEvent) {
    return originalEvent[getExpando()] ? originalEvent : new LiteEvent(originalEvent);
  },
  add(el, types, selector, data, handler) {
    let handleObjIn, handlers, tmp, type, origType, namespaces, events, eventHandle, special;
    const elData = objEvent.data.get(el);

    // Don't attach events to noData or text/comment nodes (but allow plain objects)
    if (!elData) {
      return;
    }

    // Caller can pass in an object of custom data in lieu of the handler
    if (handler.handler) {
      handleObjIn = handler;
      handler = handleObjIn.handler;
      selector = handleObjIn.selector;
    }

    // Ensure that invalid selectors throw exceptions at attach time
    // Evaluate against documentElement in case elem is a non-element node (e.g., document)
    if (selector) {
      matchSelector(document.documentElement, selector);
    }

    // Make sure that the handler has a unique ID, used to find/remove it later
    if (!handler.guid) {
      handler.guid = guid++;
    }

    // Init the element's event structure and main handler, if this is the first
    if (!(events = elData.events)) {
      events = elData.events = {};
    }

    if (!(eventHandle = elData.handle)) {
      eventHandle = elData.handle = function (e) {

        // Discard the second event of a objEvent.trigger() and
        // when an event is called after a page has unloaded
        return objEvent.triggered !== e.type ?
          objEvent.dispatch.apply(el, arguments) : undefined;
      };
    }

    // Handle multiple events separated by a space
    types = (types || '').match(rspace) || [''];
    let t = types.length;
    while (t--) {
      tmp = rtypenamespace.exec(types[t]) || [];
      type = origType = tmp[1];
      namespaces = (tmp[2] || '').split('.').sort();

      // There *must* be a type, no attaching namespace-only handlers
      if (!type) {
        continue;
      }

      // If event changes its type, use the special event handlers for the changed type
      special = objEvent.special[type] || {};

      // If selector defined, determine special event api type, otherwise given type
      type = (selector ? special.delegateType : special.bindType) || type;

      // Update special based on newly reset type
      special = objEvent.special[type] || {};

      // handleObj is passed to all event handlers
      const handleObj = extend(true, {
        type: type,
        origType: origType,
        data: data,
        handler,
        guid: handler.guid,
        selector: selector,
        namespace: namespaces.join('.')
      }, handleObjIn);

      // Init the event handler queue if we're the first
      if (!(handlers = events[type])) {
        handlers = events[type] = [];
        handlers.delegateCount = 0;

        // Only use addEventListener if the special events handler returns false
        if (!special.setup || special.setup.call(el, data, namespaces, eventHandle) === false) {
          if (el.addEventListener) {
            el.addEventListener(type, eventHandle);
          }
        }
      }

      if (special.add) {
        special.add.call(el, handleObj);

        if (!handleObj.handler.guid) {
          handleObj.handler.guid = handler.guid;
        }
      }

      // Add to the element's handler list, delegates in front
      if (selector) {
        handlers.splice(handlers.delegateCount++, 0, handleObj);
      } else {
        handlers.push(handleObj);
      }

      objEvent.global[type] = true;

    }
  },
  dispatch(nativeEvent) {
    // Make a writable jQuery.Event from the native event object
    let event = objEvent.fix(nativeEvent);
    let matched, handleObj;
    let args = new Array(arguments.length);
    let handlers = (objEvent.data.get(this, 'events') || {})[event.type] || [];
    let special = objEvent.special[event.type] || {};

    // Use the fix-ed jQuery.Event rather than the (read-only) native event
    args[0] = event;
    for (let i = 1; i < arguments.length; i++) {
      args[i] = arguments[i];
    }
    event.delegateTarget = this;

    // Call the preDispatch hook for the mapped type, and let it bail if desired
    if (special.preDispatch && special.preDispatch.call(this, event) === false) {
      return;
    }
    // Determine handlers
    let handlerQueue = objEvent.handlers.call(this, event, handlers);

    // Run delegates first; they may want to stop propagation beneath us
    let i = 0;
    while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
      event.currentTarget = matched.el;

      let j = 0;
      while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
        // Triggered event must either 1) have no namespace, or 2) have namespace(s)
        // a subset or equal to those in the bound event (both can have no namespace).
        if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {
          event.handleObj = handleObj;
          event.data = handleObj.data;

          const ret = ((objEvent.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.el, args);

          if (ret !== undefined) {
            if ((event.result = ret) === false) {
              event.preventDefault();
              event.stopPropagation();
            }
          }
        }
      }
    }

    // Call the postDispatch hook for the mapped type
    if (special.postDispatch) {
      special.postDispatch.call(this, event);
    }

    return event.result;

  },
  handlers(event, handlers) {
    let handleObj, sel, matchedHandlers, matchedSelectors;
    let handlerQueue = [];
    let delegateCount = handlers.delegateCount;
    let cur = event.target;

    // Find delegate handlers

    // Support: IE <=9
    // Black-hole SVG <use> instance trees (trac-13180)

    // Support: Firefox <=42
    // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
    // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
    // Support: IE 11 only
    // ...but not arrow key 'clicks' of radio inputs, which can have `button` -1 (gh-2343)

    if (delegateCount && cur.nodeType && !(event.type === 'click' && event.button >= 1)) {

      for (; cur !== this; cur = cur.parentNode || this) {

        // Don't check non-elements (#13208)
        // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
        if (cur.nodeType === 1 && !(event.type === 'click' && cur.disabled === true)) {
          matchedHandlers = [];
          matchedSelectors = {};
          for (let i = 0; i < delegateCount; i++) {
            handleObj = handlers[i];

            // Don't conflict with Object.prototype properties (#13203)
            sel = handleObj.selector + ' ';

            if (matchedSelectors[sel] === undefined) {
              matchedSelectors[sel] = (function () {
                const selects = qsa(sel, this);
                const result = [];
                for (let i = 0; i < selects.length; i++) {
                  if (selects[i] === cur) {
                    result.push(selects[i]);
                  }
                }
                console.log('cur', cur, `matchedSelectors[${sel}]`, result);
                return result.length;
              })();
            }
            if (matchedSelectors[sel]) {
              matchedHandlers.push(handleObj);
            }
          }
          if (matchedHandlers.length) {
            handlerQueue.push({
              el: cur,
              handlers: matchedHandlers
            });
          }

        }
      }

    }

    // Add the remaining (directly-bound) handlers
    cur = this;
    if (delegateCount < handlers.length) {
      handlerQueue.push({
        el: cur,
        handlers: handlers.slice(delegateCount)
      });
    }

    return handlerQueue;
  },
  remove(el, types, handler, selector, mappedTypes) {
    const elData = objEvent.data.hasData(el) && objEvent.data.get(el);
    let events = elData.events;
    let origType;

    if (!elData || !events) {
      return;
    }

    // Once for each type.namespace in types; type may be omitted
    types = (types || '').match(rspace) || [''];
    let t = types.length;
    while (t--) {
      let tmp = rtypenamespace.exec(types[t]) || [];
      let type = origType = tmp[1];
      let namespaces = (tmp[2] || '').split('.').sort();

      // Unbind all events (on this namespace, if provided) for the element
      if (!type) {
        for (type in events) {
          objEvent.remove(el, type + types[t], handler, selector, true);
        }
        continue;
      }

      let special = objEvent.special[type] || {};
      type = (selector ? special.delegateType : special.bindType) || type;
      let handlers = events[type] || [];
      tmp = tmp[2] && new RegExp(`(^|\\.)${namespaces.join('\\.(?:.*\\.|)')}(\\.|$)`);

      // Remove matching events
      let j;
      const originCount = handlers.length;
      while (j--) {
        let handleObj = handlers[j];

        if ((mappedTypes || origType === handleObj.origType) &&
          (!handler || handler.guid === handleObj.guid) &&
          (!tmp || tmp.test(handleObj.namespace)) &&
          (!selector || selector === handleObj.selector || selector === '**' && handleObj.selector)) {
          handlers.splice(j, 1);

          if (handleObj.selector) {
            handlers.delegateCount--;
          }
          if (special.remove) {
            special.remove.call(el, handleObj);
          }
        }
      }

      // Remove generic event handler if we removed something and no more handlers exist
      // (avoids potential for endless recursion during removal of special event handlers)
      if (originCount && !handlers.length) {
        if (!special.teardown || special.teardown.call(el, namespaces, elData.handle) === false) {
          removeLiteEvent(el, type, elData.handle);
        }
        delete events[type];
      }
    }

    // Remove data and the expando if it's no longer used
    if (ys.empty(events)) {
      objEvent.data.remove(el, 'handle events');
    }
  }
};

export function LiteEvent(src, props) {

  // Allow instantiation without the 'new' keyword
  if (!(this instanceof LiteEvent)) {
    return new LiteEvent(src, props);
  }

  // Event object
  if (src && src.type) {
    this.originalEvent = src;
    this.type = src.type;

    // Events bubbling up the document may have been marked as prevented
    // by a handler lower down the tree; reflect the correct value.
    this.isDefaultPrevented = src.defaultPrevented ||
      src.defaultPrevented === undefined &&

      // Support: Android <=2.3 only
      src.returnValue === false ? returnTrue : returnFalse;

    // Create target properties
    // Support: Safari <=6 - 7 only
    // Target should not be a text node
    this.target = (src.target && src.target.nodeType === 3) ? src.target.parentNode : src.target;
    this.currentTarget = src.currentTarget;
    this.relatedTarget = src.relatedTarget;

  } else {
    // Event type
    this.type = src;
  }

  // Put explicitly provided properties onto the event object
  if (props) {
    extend(this, props);
  }

  // Create a timestamp if incoming event doesn't have one
  this.timeStamp = src && src.timeStamp || Date.now();

  this[getExpando()] = true;
}

export function removeLiteEvent(el, type, handle) {
  // This 'if' is needed for plain objects
  if (el.removeEventListener) {
    el.removeEventListener(type, handle);
  }
}

LiteEvent.prototype = {
  constructor: LiteEvent,
  isDefaultPrevented: returnFalse,
  isPropagationStopped: returnFalse,
  isImmediatePropagationStopped: returnFalse,
  isSimulated: false,

  preventDefault() {
    const e = this.originalEvent;
    this.isDefaultPrevented = returnTrue;

    if (e && !this.isSimulated) {
      e.preventDefault();
    }
  },
  stopPropagation() {
    const e = this.originalEvent;
    this.isPropagationStopped = returnTrue;
    if (e && !this.isSimulated) {
      e.stopPropagation();
    }
  },
  stopImmediatePropagation() {
    const e = this.originalEvent;
    this.isImmediatePropagationStopped = returnTrue;
    if (e && !this.isSimulated) {
      e.stopImmediatePropagation();
    }
    this.stopPropagation();
  }
};

/* trigger for event */
/**
 * @description trigger
 * @private
 */
export function trigger(event, data, el, onlyHandlers) {
  const eventPath = [el || doc];
  let type = event.hasOwnProperty('type') ? event.type : event;
  let namespaces = event.hasOwnProperty('namespace') ? event.namespace.split('.') : [];

  let lastElement, tmp, cur;
  cur = lastElement = tmp = el = el || doc;

  // Don't do events on test and commment nodes
  if (el.nodeType === 3 || el.nodeType === 0) {
    return;
  }

  // focus/blur morphs to focusin/out; ensure w're not firing them right noew.
  if (rfocusMorph.test(objEvent.triggered)) {
    return;
  }

  if (type.indexOf('.') > -1) {
    // Namespaced trigger; create a regexp to match event type in handle()
    namespaces = type.split('.');
    type = namespaces.shift();
    namespaces.sort();
  }

  let ontype = type.indexOf(':') < 0 && 'on' + type;

  // Caller can pass in a jQuery.Event object, Object, or just an event type string
  event = event[getExpando()] ? event : new LiteEvent(type, ys.obj(event) && event);

  // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
  event.isTrigger = onlyHandlers ? 2 : 3;
  event.namespace = namespaces.join('.');
  event.rnamespace = event.namespace ? new RegExp('(^|\\.)' + namespaces.join('\\.()?:.*\\.') + '(\\.|$)') : null;

  // Clean up the event in case it is being reused
  event.result = undefined;
  if (!event.target) {
    event.target = el;
  }

  // Clone any incoming data and prepend the event, creating the handler arg list
  // eslint-disable-next-line eqeqeq
  data = data == null ? [event] : makeArray(data, [event]);

  // Allow special events to draw outside the lines
  let special = objEvent.special[type] || {};
  if (!onlyHandlers && special.trigger && special.trigger.apply(el, data) === false) {
    return;
  }

  // Determine event propagation path in advance, per W3C events spec (#9951)
  // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
  let bubbleType;
  if (!onlyHandlers && !special.noBubble && !ys.window(el)) {
    bubbleType = special.delegateType || type;
    if (!rfocusMorph.test(bubbleType + type)) {
      cur = cur.parentNode;
    }
    for (; cur; cur = cur.parentNode) {
      eventPath.push(cur);
      tmp = cur;
    }

    // Only add window if we got to document (e.g., not plain obj or detached DOM)
    if (tmp === (el.ownerDocument || doc)) {
      eventPath.push(tmp.defaultView || tmp.parentWindow || window);
    }
  }

  // Fire handlers on the event path
  let i = 0;
  while ((cur = eventPath[i++]) && !event.isImmediatePropagationStopped()) {
    lastElement = cur;
    event.type = i > 1 ? bubbleType : special.bindType || type;

    // jQuery handler
    let handle = (objEvent.data.get(cur, 'events') || {})[event.type] && objEvent.data.get(cur, 'handle');
    if (handle) {
      handle.apply(cur, data);
    }

    // Native handler
    handle = ontype && cur[ontype];
    if (handle && handle.apply && (cur.nodeType === 1 || cur.nodeType === 9)) {
      event.result = handle.apply(cur, data);
      if (event.result === false) {
        event.preventDefault();
      }
    }
  }
  event.type = type;

  // If nobody prevented the default action, do it now
  if (!onlyHandlers && !event.isDefaultPrevented()) {
    if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && (el.nodeType === 1 || el.nodeType === 9)) {

      // Call a native DOM method on the target with the same name as the event.
      // Don't do default actions on window, that's where global variables be (#6170)
      if (ontype && ys.func(el[type]) && ys.window(el)) {

        // Don't re-trigger an onFOO event when we call its FOO() method
        tmp = el[ontype];
        if (tmp) {
          el[ontype] = null;
        }

        // Prevent re-triggering of the same event, since we already bubbled it above
        objEvent.triggered = type;

        if (event.isPropagationStopped()) {
          lastElement.addEventListener(type, stopPropagationCallback);
        }

        el[type]();

        if (event.isPropagationStopped()) {
          lastElement.removeEventListener(type, stopPropagationCallback);
        }

        objEvent.triggered = undefined;

        if (tmp) {
          el[ontype] = tmp;
        }
      }
    }
  }

  return event.result;
};
// Piggyback on a donor event to simulate a different one
// Used only for `focus(in | out)` events
export function simulate(type, el, event) {
  const e = extend(new LiteEvent(), event, {
    type,
    isSimulated: true
  });

  trigger(e, null, el);
}


/**
 * @description 为 Event 原型添加特殊属性或方法
 * @private
 */
each({
  altKey: true,
  bubbles: true,
  cancelable: true,
  changedTouches: true,
  ctrlKey: true,
  detail: true,
  eventPhase: true,
  metaKey: true,
  pageX: true,
  pageY: true,
  shiftKey: true,
  view: true,
  'char': true,
  code: true,
  charCode: true,
  key: true,
  keyCode: true,
  button: true,
  buttons: true,
  clientX: true,
  clientY: true,
  offsetX: true,
  offsetY: true,
  pointerId: true,
  pointerType: true,
  screenX: true,
  screenY: true,
  targetTouches: true,
  toElement: true,
  touches: true,

  which: function (event) {
    var button = event.button;

    // Add which for key events
    if (event.which == null && rkeyEvent.test(event.type)) {
      return event.charCode != null ? event.charCode : event.keyCode;
    }

    // Add which for click: 1 === left; 2 === middle; 3 === right
    if (!event.which && button !== undefined && rmouseEvent.test(event.type)) {
      if (button & 1) {
        return 1;
      }

      if (button & 2) {
        return 3;
      }

      if (button & 4) {
        return 2;
      }

      return 0;
    }

    return event.which;
  }
}, function (name, hook) {
  Object.defineProperty(Event.prototype, name, {
    enumerable: true,
    configurable: true,
    get: ys.func(hook) ?
      function () {
        if (this.originalEvent) {
          return hook(this.originalEvent);
        }
      } : function () {
        if (this.originalEvent) {
          return this.originalEvent[name];
        }
      },

    set: function (value) {
      Object.defineProperty(this, name, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: value
      });
    }
  });
});

each({
  mouseenter: 'mouseover',
  mouseleave: 'mouseout',
  pointerenter: 'pointerover',
  pointerleave: 'pointerout'
}, function (orig, fix) {
  objEvent.special[orig] = {
    delegateType: fix,
    bindType: fix,
    handle(event) {
      const target = this;
      const related = event.relatedTarget;
      const handleObj = event.handleObj;
      let ret;
      // For mouseenter/leave call the handler if related is outside the target.
      // NB: No relatedTarget if the mouse left/entered the browser window
      if (!related || (related !== target && !contains(target, related))) {
        event.type = handleObj.origType;
        ret = handleObj.handler.apply(this, arguments);
        event.type = fix;
      }
      return ret;
    }
  };
});

const defaultOptions = {
  one: false,
  data: {}
};

/**
 * Bind to `event` and invoke `fn(e)`. When
 * a `selector` is given then events are delegated.
 *
 * @param {String} events
 * @param {String} [selector]
 * @param {Function} fn
 * @param {Object} options
 * @return {List}
 */
export function on(els, event, selector, fn, options) {
  options = extend(options, defaultOptions);
  return els.each(function () {
    const el = this;
    // add event
    objEvent.add(el, event, selector, options.data, fn);
  });
}

export function one(els, event, selector, fn, options) {
  const origFn = fn;
  fn = function (event) {

    // Can use an empty set, since event contains the info
    off(els, event, selector, fn);
    return origFn.apply(this, arguments);
  };

  // Use same guid so caller can remove using origFn
  fn.guid = origFn.guid || (origFn.guid = guid++);

  return els.each(function () {
    const el = this;
    // add event
    objEvent.add(el, event, selector, options.data, fn);
  });
}

export function off(self, types, selector, fn) {

  if (types && types.preventDefault && types.handleObj) {

    // ( event )  dispatched LiteEvent
    let handleObj = event.handleObj;
    const tmpList = new self.constructor(types.delegateTarget);
    off(
      tmpList,
      handleObj.namespace ?
      handleObj.origType + '.' + handleObj.namespace :
      handleObj.origType,
      handleObj.selector,
      handleObj.handler
    );
    return;
  }
  if (ys.obj(event)) {

    // ( types-object [, selector] )
    for (let type in types) {
      off(self, type, selector, types[type]);
    }
    return this;
  }
  if (selector === false || ys.func(selector)) {

    // ( types [, fn] )
    fn = selector;
    selector = undefined;
  }
  if (fn === false) {
    fn = returnFalse;
  }
  return self.each(function () {
    objEvent.remove(this, types, fn, selector);
  });
}

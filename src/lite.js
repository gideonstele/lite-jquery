/* eslint-disable */
import {
  ys
} from '../lib/util';

const doc = document;
const win = window;
const ELEMENT_NODE = 1;
const f = function () {};

export const warn = (console && console.warn) || f;
export const log = (console && console.log) || f;

if (typeof doc === 'undefined') {
  console.warn(
    'STAT Error: The Document as The Global Object does NOT exist! '
  );
}

if (typeof win === 'undefined') {
  console.warn('STAT Error: The Window as The Global Object does NOT exist! ');
}

if (!('querySelectorAll' in doc)) {
  console.warn('STAT Error: The Method of querySelector does NOT exist! ');
}


if (typeof doc === 'undefined') {
  console.warn(
    'STAT Error: The Document as The Global Object does NOT exist! '
  );
}

if (typeof win === 'undefined') {
  console.warn('STAT Error: The Window as The Global Object does NOT exist! ');
}

if (!('querySelectorAll' in doc)) {
  console.warn('STAT Error: The Method of querySelector does NOT exist! ');
}

function wrap(dom = [], selector) {
  Object.setPrototypeOf ?
    Object.setPrototypeOf(dom, $.fn) :
    (dom.__proto__ = $.fn);
  dom.selector = selector || '';
  return dom;
}

const idSelectorRE = /^([\w-]+)s/,
  classSelectorRE = /^\.([\w-]+)$/,
  tagSelectorRE = /^[\w-]+$/,
  spaceRE = /\s+/g;

/**
 * @desc closest polyfill for Any Browser
 *
 */
(function (ElementProto) {
	if (typeof ElementProto.matches !== 'function') {
		ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
			var element = this;
			var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
			var index = 0;

			while (elements[index] && elements[index] !== element) {
				++index;
			}

			return Boolean(elements[index]);
		};
	}

	if (typeof ElementProto.closest !== 'function') {
		ElementProto.closest = function closest(selector) {
			var element = this;

			while (element && element.nodeType === 1) {
				if (element.matches(selector)) {
					return element;
				}

				element = element.parentNode;
			}

			return null;
		};
	}
})(win.Element.prototype);

/**
 * @desc addEvent polyfill for IE
 */
(function () {
  if (win.addEventListener) return; // No need to polyfill

  function docHijack(p) {
    var old = doc[p];
    doc[p] = function (v) {
      return addListen(old(v));
    };
  }

  function addEvent(on, fn, self) {
    return (self = this).attachEvent('on' + on, function (e) {
      e = e || win.event;
      e.preventDefault =
        e.preventDefault ||
        function () {
          e.returnValue = false;
        };
      e.stopPropagation =
        e.stopPropagation ||
        function () {
          e.cancelBubble = true;
        };
      fn.call(self, e);
    });
  }

  function addListen(obj, i) {
    if ((i = obj.length))
      while (i--) obj[i].addEventListener = addEvent;
    else obj.addEventListener = addEvent;
    return obj;
  }

  addListen([doc, win]);
  if ('Element' in win) win.Element.prototype.addEventListener = addEvent;
  // IE8
  else {
    // IE < 8
    doc.attachEvent('onreadystatechange', function () {
      addListen(doc.all);
    }); // Make sure we also init at domReady
    docHijack('getElementsByTagName');
    docHijack('getElementById');
    docHijack('createElement');
    addListen(doc.all);
  }
})();

/**
 * @name jqlite
 */
const $ = function (selector, context = doc) {
  const type = typeof selector;
  if (!selector) {
    return wrap();
  }

  if (type === 'function') {
    return $.ready(selector);
  }

  if (selector._l) {
    return selector;
  }

  if (ys.array(selector)) {
    return wrap(
      [].slice.call(selector).filter(function (item) {
        return item != null;
      }),
      selector
    );
  }

  if (type === 'object') {
    return wrap([selector], '');
  }

  if (type === 'string') {
    selector = selector.trim();

    if (selector[0] === '<') {
      const nodes = $.fragment(selector);
      return wrap(nodes, '');
    }

    if (idSelectorRE.test(selector)) {
      let found = doc.getElementById(RegExp.$1);
      return wrap(found ? [found] : [], selector);
    }

    return wrap($.qsa(selector, context), selector);
  }

  return wrap();
};

$.qsa = $.prototype.qsa = function (selector, context = doc) {
  selector = selector.trim();
  return [].slice.call(
    classSelectorRE.test(selector) ?
    context.getElementsByClassName(RegExp.$1) :
    tagSelectorRE.test(selector) ?
    context.getElementsByTagName(selector) :
    context.querySelectorAll(selector)
  );
};

/**
* Delegate event `type` to `selector`
* and invoke `fn(e)`. A callback function
* is returned which may be passed to `.unbind()`.
*
* @param {Element} el
* @param {String} selector
* @param {String} type
* @param {Function} fn
* @param {Boolean} capture
* @return {Function}
* @api public
*/
function bindDelegate(el, selector, type, fn, capture) {
  el.addEventListener(type, function (e) {
    const target = e.target || e.srcElement;
    e.delegateTarget = target.closest(selector);
    if (e.delegateTarget) fn.call(el, e);
  }, capture);
}

$.fragment = function (html) {
  let d = doc.createElement('div');
  let nodes;
  d.innerHTML = html;
  nodes = d.children;
  d = null;
  return [].slice.call(nodes);
};

$.ready = function (fn) {
  const fns = [],
    hack = doc && doc.documentElement.doScroll,
    domContentLoaded = 'DOMContentLoaded';
  let listener;
  let loaded =
    doc && (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);
  if (!loaded && doc) {
    doc.addEventListener(
      domContentLoaded,
      (listener = function () {
        doc.removeEventListener(domContentLoaded, listener);
        loaded = 1;
        while ((listener = fns.shift())) listener();
      })
    );
  }
  return loaded ? setTimeout(fn, 0) : fns.push(fn);
};

function getEvents(event) {
  if (event.indexOf(' ') > -1) {
    return event.split(' ');
  }
  return [event];
}

$.Event = function (type, props) {
  return 'CustomEvent' in win ?
    win.CustomEvent(type, props) :
    win.Event(type, props);
};

$.fn = $.prototype = {
  constructor: $,

  _l: true,

  each(callback) {
    const l = this.length;
    let t;
    for (let i = 0; i < l; i++) {
      t = this[i];

      if (callback && callback.call(t, i, t, this) === false) {
        return this;
      }
    }
    return this;
  },

  slice() {
    return $([].slice.apply(this, arguments));
  },

  is(selector, element) {
    element = element || this[0];
    if (element && element.nodeType) {
      return element === selector ?
        true :
        typeof selector === 'string' && element.matches(selector);
    }
    return false;
  },

  closet(selector) {
    const element = this[0];
    let dom =
      element && typeof selector === 'string' ?
      element.closest(selector) :
      this.is(selector, element) ?
      element :
      null;
    return dom;
  },

  find(selector) {
    const dom = [];
    this.each(function () {
      if (this.nodeType !== ELEMENT_NODE) return;
      const elements = $.qsa(selector, this),
        elementsLen = elements.length;
      for (let i = 0; i < elementsLen; i++) {
        dom.indexOf(elements[i]) === -1 && dom.push(elements[i]);
      }
    });
    return $(dom);
  },

  eq(idx) {
    idx = idx < 0 ? idx + this.length : idx;
    return $(this[idx]);
  },

  off(type, handler) {
    const types = type && type.trim().split(spaceRE);
    types &&
      this.each(function () {
        const element = this;
        types.forEach(function (name) {
          if (handler) {
            element.removeEventListener(
              name,
              handler.delegator || handler,
              false
            );
          } else {
            const handlers = element.listeners && element.listeners[name];
            handlers &&
              handlers.forEach(function (_handler) {
                element.removeEventListener &&
                  element.removeEventListener(
                    name,
                    _handler.delegator || _handler,
                    false
                  );
                element.detachEvent &&
                  element.detachEvent(
                    'on' + name,
                    _handler.delegator || _handler
                  );
              });
          }
        });
      });
    return this;
  },

  on(event, selector, fn, capture) {
    const events = getEvents(event);
    if ('string' === typeof selector) {
      this.each(function () {
        for (let i = 0; i < events.length; i++) {
          bindDelegate(this, selector, events[i], fn, capture);
        }
      });
    } else if (ys.func(selector)) {
      capture = fn;
      fn = selector;
      this.each(function () {
        for (let i = 0; i < events.length; i++) {
          this.addEventListener(events[i], fn, capture);
        }
      });
    }
    return this;
  },

  trigger(type, detail) {
    return this.each(function () {
      this &&
        this.dispatchEvent &&
        this.dispatchEvent(
          $.Event(type, {
            detail,
            bubbles: true,
            cancelable: true
          })
        );
    });
  },

  attr(name, value) {
    const type = typeof name;
    let result;
    if (type === 'string' && value == null) {
      if (!this.length || this[0].nodeType !== ELEMENT_NODE) {
        return undefined;
      } else {
        return !(result = this[0].getAttribute(name)) && name in this[0] ?
          this[0][name] :
          result;
      }
    } else {
      return this.each(function () {
        if (this.nodeType !== ELEMENT_NODE) return;
        if (type === 'object') {
          for (let key in name) {
            this.setAttribute(key, name[key]);
          }
        } else {
          this.setAttribute(name, value);
        }
      });
    }
  },

  removeAttr(name) {
    return this.each(function () {
      const _this = this;
      this.nodeType === ELEMENT_NODE &&
        name.split(spaceRE).forEach(function (attr) {
          _this.removeAttr(attr);
        });
    });
  },

  html(html) {
    return html !== undefined ?
      this.each(function () {
        this.innerHTML = html;
      }) :
      (this[0] ? this[0].innerHTML : null);
  },

  text(text) {
    return text !== undefined ?
      this.each(function () {
        this.textContent = text;
      }) :
      (this[0] ? this[0].textContent : null);
  }
};

export default $;


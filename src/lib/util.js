import {
  isError,
  isFunction,
  isArray,
  isEmpty,
  isObject,
  isPlainObject,
  memoize,
  mapValues,
  cloneDeep
} from 'lodash-es';

/* eslint-disable */
const doc = document;
// const f = function() {};

export const ys = {
  obj: isObject,
  plainObject: isPlainObject,
  array: isArray,
  func: isFunction,
  empty: isEmpty,
  err: isError,
  HTTPS() {
    return doc.location.protocol === 'https:';
  },
  isString(input) {
    return input != null && ((input.constructor + '').indexOf('String') > -1);
  },
  startWith(str, part) {
    // eslint-disable-next-line eqeqeq
    return str.indexOf(part) == 0;
  },
  thenable(f) {
    return f && ys.func(f.then);
  }
};

export const trim = function (a) {
  return a ? a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '') : '';
};

export {
  memoize,
  mapValues,
  cloneDeep
};

export const uuid = (function () {
  let count = 0;
  return function () {
    return (
      new Date().getTime() +
      `${count++}-xxxx-4xxx-yxxx`.replace(/[xy]/g, c => {
        /* eslint-disable eqeqeq */
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        /* eslinr-enable eqeqeq */
        return v.toString(16);
      })
    );
  };
})();

export const cookie = function (name, value, options) {
  if (typeof value === 'undefined') {
    let n,
      v,
      cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      n = trim(cookies[i].substr(0, cookies[i].indexOf('=')));
      v = cookies[i].substr(cookies[i].indexOf('=') + 1);
      if (n === name) {
        return unescape(v);
      }
    }
  } else {
    options = options || {};
    if (!value) {
      value = '';
      options.expires = -365;
    } else {
      value = escape(value);
    }
    if (options.expires) {
      const d = new Date();
      d.setDate(d.getDate() + options.expires);
      value += '; expires=' + d.toUTCString();
    }
    if (options.domain) {
      value += '; domain=' + options.domain;
    }
    if (options.path) {
      value += '; path=' + options.path;
    }
    document.cookie = name + '=' + value;
  }
};

function _stringify(a) {
  // eslint-disable-next-line
  return void 0 === a || 'object' == typeof a ? JSON.stringify(a) : a;
}

function _parse(a) {
  try {
    return JSON.parse(a)
  } catch (b) {
    return a;
  }
}

const _store = {};

const _session = {};

export function store(key, value) {
  try {
    if (void 0 === value) {
      value = localStorage.getItem(key);
      _store[key] = _store[key] ? _store[key] : null;
      return value ? _parse(value) : _store[key];
    } else {
      localStorage.setItem(key, _stringify(value));
    }
  } catch (e) {
    _store[key] = value;
  }
}

export function removeStore(key) {
  try {
    localStorage.removeItem(key)
  } catch (e) { // 可能在隐私模式，不支持localStorage值，会存储成全局变量
    if (_store) delete _store[key];
  }
}

export function session(key, value) {
  try {
    if (void 0 === value) {
      value = sessionStorage.getItem(key);
      _session[key] = _session[key] ? _session[key] : null;
      return value ? _parse(value) : _session[key];
    } else { // set值
      sessionStorage.setItem(key, _stringify(value));
    }
  } catch (e) { // 可能在隐私模式，不支持localStorage set值，存储成全局变量
    _session[key] = value;
  }
}

export function removeSession(key) {
  try {
    sessionStorage.removeItem(key)
  } catch (e) {
    if (_session) delete _session[key];
  }
}

export function parseUrl(url) {
  function parseLink(link) {
    const hostname = (link.hostname || '').split(':')[0].toLowerCase();
    const protocol = (link.protocol || '').toLowerCase();
    /* eslint-disable eqeqeq */
    const port =
      1 * link.port ||
      (protocol == 'http:' ? 80 : protocol == 'https:' ? 443 : '');
    /* eslint-enable eqeqeq */
    let pathname = link.pathname || '';
    if (!ys.startWith(pathname, '/')) {
      pathname = '/' + pathname;
    }
    return [hostname, '' + port, pathname];
  }

  const link = doc.createElement('a');
  link.href = doc.location.href;
  const protocol = (link.protocol || '').toLowerCase();
  const locationPart = parseLink(link);
  var search = link.search || '';
  var baseUrl =
    protocol +
    '//' +
    locationPart[0] +
    (locationPart[1] ? ':' + locationPart[1] : '');
  if (ys.startWith(url, '//')) {
    url = protocol + url;
  } else {
    if (ys.startWith(url, '/')) {
      url = baseUrl + url;
    } else {
      if (!url || ys.startWith(url, '?')) {
        url = baseUrl + locationPart[2] + (url || search);
      } else {
        if (url.split('/')[0].indexOf(':') < 0) {
          url =
            baseUrl +
            locationPart[2].substring(0, locationPart[2].lastIndexOf('/')) +
            '/' +
            url;
        }
      }
    }
  }
  link.href = url;
  var r = parseLink(link);
  return {
    protocol: (link.protocol || '').toLowerCase(),
    host: r[0],
    port: r[1],
    path: r[2],
    query: link.search || '',
    url: url || ''
  };
}

export function parseQueryString(qs) {
  const pairs = {};
  if (qs.length > 0) {
    const query = qs.charAt(0) === '?' ? qs.substring(1) : qs;

    if (query.length > 0) {
      const vars = query.split('&');
      for (let i = 0; i < vars.length; i++) {
        if (vars[i].length > 0) {
          const pair = vars[i].split('=');
          try {
            /* eslint-disable no-unused-vars */
            let name = decodeURIComponent(pair[0]);
            let value = (pair.length > 1) ? decodeURIComponent(pair[1]) : 'true';
            /* eslint-enable no-unused-vars */
          } catch (e) {}
        }
      }
    }
  }

  return pairs;
}

export function unparseQueryString(params, isTraditional) {
  let s = [];
  const add = function (key, value) {
    /* eslint-disable eqeqeq */
    value = ys.func(value) ? value() : (value == null ? '' : value);
    /* eslint-enable eqeqeq */
    s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
  };
  const buildParams = function (prefix, obj) {
    if (ys.array(obj)) {
      obj.forEach((i, v) => {
        if (isTraditional || /\[\]$/.test(prefix)) {
          add(prefix, v);
        } else {
          buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v);
        }
      });
    } else if (!isTraditional && ys.obj(obj)) {
      for (const name in obj) {
        buildParams(prefix + '[' + name + ']', obj[name]);
      }
    } else {
      add(prefix, obj);
    }
  };
  if (ys.array(params)) {
    params.forEach((key, index) => {
      add(key, index);
    });
  } else {
    for (const prefix in params) {
      buildParams(prefix, params[prefix]);
    }
  }
  return s.join('&').replace(/%20/g, '+');
}

/* eslint-disable eqeqeq */
export function getHostname() {
  const name = '' + doc.location.hostname;
  return name.indexOf('www.') == 0 ? name.substring(4) : name;
}
/* eslint-enable eqeqeq */

export function ya(origin) {
  const ref = doc.referrer;
  if (/^https?:\/\//i.test(ref)) {
    if (origin) {
      return ref;
    }
    origin = '//' + doc.location.hostname;
    const i = ref.indexOf(origin);
    if (i === 5 || i === 6) {
      if (
        ((origin = ref.charAt(i + origin.length)),
          origin === '/' || origin === '?' || origin === '' || origin === ':')
      ) {
        return;
      }
    }
    return origin;
  }
}


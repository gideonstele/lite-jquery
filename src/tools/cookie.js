import { trim } from './string';

function cookie(name, value, options) {
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

export default cookie;

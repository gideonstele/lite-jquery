function _stringify(a) {
  // eslint-disable-next-line
  return void 0 === a || 'object' == typeof a ? JSON.stringify(a) : a;
}

function _parse(a) {
  try {
    return JSON.parse(a);
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
    localStorage.removeItem(key);
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
    sessionStorage.removeItem(key);
  } catch (e) {
    if (_session) delete _session[key];
  }
}

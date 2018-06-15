import ys from '../tools/ys';

export function removeAttr(name) {
  return this.forEach(function () {
    this.removeAttribute(name);
  });
}

export function attr(name, val) {
  if (1 === arguments.length) {
    return this[0] && this[0].getAttribute(name);
  }
  if (null === val) {
    return this.removeAttr(name);
  }

  return this.forEach(function () {
    this.setAttribute(name, val);
  });
}

export function hasAttr(name) {
  this.hasAttribute(name);
}

export function prop(name, val) {
  if (1 === arguments.length) {
    return this[0][name];
  }

  return this.forEach(function () {
    this[name] = val;
  });
}

function getElType(el) {
  const group = ys.array(el) || ys.obj(el);
  let _el = group ? el[0] : el;
  const name = _el.nodeName.toLowerCase();
  let type = _el.getAttribute('type');
  if (type) {
    type = type.toLowerCase();
    if (group && 'radio' === type) {
      return 'radiogroup';
    }
    if ('input' === name && 'checkbox' === type) {
      return 'checkbox';
    }
    if ('input' === name && 'radio' === type) {
      return 'radio';
    }
    if ('select' === name) {
      return 'select';
    }
  }
  return name;
}

export function value(val) {
  // get
  if (0 === arguments.length) {
    const el = this[0];
    if ('radiogroup' === getElType(this)) {
      for (let i = 0, radio; radio = el[i]; i++) {
        if (radio.checked) {
          return radio.value;
        }
      }
    }
    switch (getElType(el)) {
      case 'checkbox':
      case 'radio':
        if (el.checked) {
          const attr = el.value;
          return null === attr ? true : attr;
        }
        return false;
      case 'select':
        for (let i = 0, option; option = el.options[i]; i++) {
          if (option.selected) return option.value;
        }
        break;
      default:
        return el.value;
    }
  }
  // set
  return this.forEach(function () {
    const el = this;
    switch (getElType(el)) {
      case 'checkbox':
      case 'radio':
        el.checked = !!val;
        break;
      case 'radiogroup':
        for (let i = 0, radio; radio = el[i]; i++) {
          radio.checked = radio.value === val;
        }
        break;
      case 'select':
        for (let i = 0, option; option = el.options[i]; i++) {
          option.selected = option.value === val;
        }
        break;
      default:
        el.value = val;
    }
  });
}

import { getExpando } from '../config/var';
import ys from '../tools/ys';

/**
 * Determines whether an dom can have data
 */
function acceptData(owner) {
  // Accepts only:
  //  - Node
  //    - Node.ELEMENT_NODE
  //    - Node.DOCUMENT_NODE
  return owner.nodeType === 1 || owner.nodeType === 9;
}

function Data() {
  this.expando = getExpando() + Data.uid++;
}

Data.uid = 1;

Data.prototype = {
  constructor: Data,

  cache(owner) {
    let value = owner[getExpando()];

    if (!value) {
      value = {};

      // We can accept data for non-element nodes in modern browsers,
      // but we should not, see #8335.
      // Always return an empty object.
      // 只考虑dom数据
      if (acceptData(owner)) {
        // If it is a node unlikely to be stringify-ed or looped over
        // use plain assignment
        if (owner.nodeType) {
          owner[getExpando()] = value;

          // Otherwise secure it in a non-enumerable property
          // configurable must be true to allow the property to be
          // deleted when data is removed
        } else {
          Object.defineProperty(owner, getExpando(), {
            value,
            configurable: true
          });
        }
      }
    }

    return value;
  },

  set(owner, data, value) {
    let cache = this.cache(owner);

    // Handle: [ owner, key, value ] args
    // Always use camelCase key (gh-2257)
    if (ys.str(data)) {
      cache[data] = value;
    } else {
      // Copy the properties one-by-one to the cache object
      for (let prop in data) {
        cache[prop] = data[prop];
      }
    }
    return cache;
  },
  get(owner, key) {
    return key === undefined ? this.cache(owner) : owner[getExpando()] && owner[getExpando()][key];
  },
  access(owner, key, value) {
    // In cases where either:
    //
    //   1. No key was specified
    //   2. A string key was specified, but no value provided
    //
    // Take the "read" path and allow the get method to determine
    // which value to return, respectively either:
    //
    //   1. The entire cache object
    //   2. The data stored at the key
    //
    if (key === undefined || (key && typeof key === 'string' && value === undefined)) {
      return this.get(owner, key);
    }
  },
  remove(owner, key) {
    const cache = owner[getExpando()];

    if (cache === undefined) {
      return;
    }

    if (key !== undefined) {
      // Support array or space separated string of keys
      if (!ys.array(key)) {
        // If key is an array of keys...
        // We always set camelCase keys, so remove that.

        key = key in cache ? [key] : [key.match(/[^\x20\t\r\n\f]+/g)];
      }

      let i = key.length;
      while (i--) {
        delete cache[key[i]];
      }
    }

    // Remove the expando if there's no more data
    if (key === undefined || ys.empty(cache)) {
      // Support: Chrome <=35 - 45
      // Webkit & Blink performance suffers when deleting properties
      // from DOM nodes, so set to undefined instead
      // https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
      if (owner.nodeType) {
        owner[getExpando()] = undefined;
      } else {
        delete owner[getExpando()];
      }
    }
  },
  hasData(owner) {
    const cache = owner[getExpando()];
    return cache !== undefined && ys.empty(cache);
  }
};

export default Data;

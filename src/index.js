import dom from './core';
import cookie from './tools/cookie';
import ys from './tools/ys';
import extend from './tools/extend';
import clone from './tools/clone';
import merge from './tools/merge';
import { store, removeStore, session, removeSession } from './tools/localstore';

const localstore = {
  store,
  removeStore,
  session,
  removeSession,
  getStore: val => store(val),
  getSession: val => session(val)
};

export {
  cookie,
  ys,
  localstore,
  extend,
  merge,
  clone
};

export default dom;

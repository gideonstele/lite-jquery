import dom from './core';
import cookie from './tools/cookie';
import extend from './tools/extend';
import clone from './tools/clone';
import merge from './tools/merge';
import ys from './tools/ys';
import { store, removeStore, session, removeSession } from './tools/localstore';

export const localstore = {
  store,
  removeStore,
  session,
  removeSession,
  getStore: (val) => store(val),
  getSession: (val) => session(val)
};

export { cookie, extend, merge, clone, ys };

export default dom;

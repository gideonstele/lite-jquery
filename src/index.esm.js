import dom from './core';
import cookie from './tools/cookie';
import ys from './tools/ys';
import { store, removeStore, session, removeSession } from './tools/localstore';

export const localstore = {
  store,
  removeStore,
  session,
  removeSession,
  getStore: val => store(val),
  getSession: val => session(val)
};

export {
  dom,
  cookie,
  ys
};

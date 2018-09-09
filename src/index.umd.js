import './polyfills/matches';
import './polyfills/events';
import dom from './core';
import cookie from './tools/cookie';
import extend from './tools/extend';
import merge from './tools/merge';
import ys from './tools/ys';
import { store, removeStore, session, removeSession } from './tools/localstore';

const $ = dom;
$.ys = ys;
$.cookie = cookie;
$.localstore = {
  store,
  removeStore,
  session,
  removeSession,
  getStore: val => store(val),
  getSession: val => session(val)
};
$.extend = extend;
$.merge = merge;
window.$ = $;

// (function (global, factory) {
//   'use strict';
//   if (typeof module === 'object' && typeof module.exports === 'object') {
//     module.exports = global.document ? factory(global, true) : function (w) {
//       if (!w.document) {
//         throw new Error('jQuery requires a window with a document');
//       }
//       return factory(w);
//     };
//   } else {
//     factory(global);
//   }
// // eslint-disable
// })(typeof window !== 'undefined' ? window : this, function (window, noGlobal) {
//   'use strict';
//   return $;
// });

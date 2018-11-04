/* eslint-disable */
/**
 * @description matches polyfill
 */
!Element.prototype.matches &&
  (function(ElementPrototype, matches, registry) {
    ElementPrototype[matches] =
      ElementPrototype.webkitMatchesSelector ||
      ElementPrototype.mozMatchesSelector ||
      ElementPrototype.msMatchesSelector ||
      function(s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
      };
  })(Element.prototype, 'matches', []);

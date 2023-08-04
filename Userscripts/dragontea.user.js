// ==UserScript==
// @name         Dragontea
// @match        http://*.dragontea.ink/*
// @match        https://*.dragontea.ink/*
// @grant        none
// @run-at       document-start
// ==/UserScript==


(function() {
  `use strict`;

  const safe = {
    'log': window.console.log.bind(console),
  };

  const genericGet = function(target, thisArg, args) {
    if (thisArg === 'toString') {
      return target.toString.bind(target);
    };
    return Reflect.get(target, thisArg, args);
  };

  window.getComputedStyle = new Proxy(window.getComputedStyle, {
    apply(target, thisArg, args) {
      const style = Reflect.apply(target, thisArg, args);
      if (style.clipPath === 'none') {
        return style;
      };

      style.getPropertyValue = new Proxy(style.getPropertyValue, {
        apply(target, thisArg, args) {
          if (args[0] !== 'clip-path') {
            return Reflect.apply(target, thisArg, args);
          };
          return 'none';
        },
        get: genericGet
      });

      Object.defineProperty(style, 'clipPath', {
        get: function() {
          return 'none';
        }
      });

      return style;
    },
    get: genericGet
  });

}) ();

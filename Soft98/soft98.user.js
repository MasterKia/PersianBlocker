// ==UserScript==
// @name         Soft98.ir: Remove ads / حذف تبلیغات
// @namespace    https://github.com/MasterKia/PersianBlocker
// @match        http://*.soft98.ir/*
// @match        https://*.soft98.ir/*
// @grant        none
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/Soft98/soft98.user.js
// @updateURL    https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/Soft98/soft98.user.js
// @homepageURL   https://github.com/MasterKia/PersianBlocker
// ==/UserScript==

(function() {
  'use strict';

  const safe = {
    'log': window.console.log.bind(console),
    'getPropertyValue': CSSStyleDeclaration.prototype.getPropertyValue,
    'setAttribute': Element.prototype.setAttribute,
    'getAttribute': Element.prototype.getAttribute,
    'appendChild': Element.prototype.appendChild,
    'remove': Element.prototype.remove,
    'cloneNode': Element.prototype.cloneNode,
    'Element_attributes': Object.getOwnPropertyDescriptor(Element.prototype, 'attributes').get,
    'Array_splice': Array.prototype.splice,
    'Array_join': Array.prototype.join,
    'createElement': document.createElement,
    'getComputedStyle': window.getComputedStyle,
    'Reflect': Reflect,
    'Proxy': Proxy,
    'crypto': window.crypto,
    'Uint8Array': Uint8Array,
    'Object_defineProperty': Object.defineProperty.bind(Object),
    'String_replace': String.prototype.replace,
  };
  const getRandomValues = safe.crypto.getRandomValues.bind(safe.crypto);

  const genericGet = function(target, thisArg, args) {
    if (thisArg === 'toString') {
      return target.toString.bind(target)
    };
    return safe.Reflect.get(target, thisArg, args)
  };

  const generateID = function(len) {
    const dec2hex = function(dec) {
      return dec.toString(16).padStart(2, '0')
    };
    const arr = new safe.Uint8Array((len || 40) / 2);
    getRandomValues(arr);
    const result = safe.String_replace.call(safe.Array_join.call(Array.from(arr, dec2hex), ''), /^\d+/g, '');
    if (result.length < 3) {
      return generateID(len);
    };
    return result;
  };

  const randomName = generateID(15);
  window.MutationObserver = new safe.Proxy(window.MutationObserver, {
    construct: function(target, args) {
      const callback = args[0];
      const proxiedCallback = function(mutations, observer) {
        for (let len = mutations.length, i = len - 1; i >= 0; --i) {
          const mutation = mutations[i];
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            const nodes = mutation.addedNodes;
            for (let j = 0, len2 = nodes.length; j < len2; ++j) {
              const node = nodes[j];
              if (node.localName === randomName) {
                safe.Array_splice.call(mutations, i, 1);
                break;
              }
            }
          }
        };
        if (mutations.length !== 0) {
          callback(mutations, observer);
        };
      };
      args[0] = proxiedCallback;
      const observer = safe.Reflect.construct(target, args);
      return observer
    },
    get: genericGet
  });

  window.getComputedStyle = new safe.Proxy(window.getComputedStyle, {
    apply(target, thisArg, args) {
      let style = safe.Reflect.apply(target, thisArg, args);
      if (safe.getPropertyValue.call(style, 'clip-path') === 'none') {
        return style;
      };
      const node = args[0];
      const clonedNode = safe.createElement.call(document, randomName);
      safe.setAttribute.call(clonedNode, 'class', safe.getAttribute.call(node, 'class'));
      safe.setAttribute.call(clonedNode, 'id', safe.getAttribute.call(node, 'id'));
      safe.setAttribute.call(clonedNode, 'style', safe.getAttribute.call(node, 'style'));
      safe.appendChild.call(document.body, clonedNode);
      const value = safe.getPropertyValue.call(safe.getComputedStyle.call(window, clonedNode), 'clip-path');
      safe.remove.call(clonedNode);

      safe.Object_defineProperty(style, 'clipPath', {
        get: function() {
          return value;
        }
      });

      style.getPropertyValue = new safe.Proxy(style.getPropertyValue, {
        apply(target, thisArg, args) {
          if (args[0] !== 'clip-path') {
            return safe.Reflect.apply(target, thisArg, args)
          };
          return value;
        },
        get: genericGet
      });

      return style;
    },
    get: genericGet
  });

})();

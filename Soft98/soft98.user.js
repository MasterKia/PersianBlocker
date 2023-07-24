// ==UserScript==
// @name         Soft98
// @namespace    https://github.com/MasterKia/PersianBlocker/
// @match        http://*.soft98.ir/*
// @match        https://*.soft98.ir/*
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/Soft98/soft98.user.js
// @downloadURL  https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/Soft98/soft98.user.js
// ==/UserScript==

if (typeof alreadyRun !== 'undefined' && alreadyRun === true) {
} else {
  alreadyRun = true;
  (function() {
    'use strict';

    const safe = {
      'log': window.console.log.bind(console),
      'eval': window.eval,
      'setInterval': window.setInterval,
      'clearInterval': window.clearInterval,
      'getComputedStyle': window.getComputedStyle,
      'addEventListener': self.EventTarget.prototype.addEventListener,
      'createElement': document.createElement,
      'querySelector': document.querySelector,
      'querySelectorAll': document.querySelectorAll,
      'styleSheets': document.styleSheets,
      'attachShadow': Element.prototype.attachShadow,
      'Element_attributes': Object.getOwnPropertyDescriptor(Element.prototype, 'attributes').get,
      'getAttributeNames': Element.prototype.getAttributeNames,
      'setAttribute': Element.prototype.setAttribute,
      'removeAttribute': Element.prototype.removeAttribute,
      'hasAttribute': Element.prototype.hasAttribute,
      'appendChild': Element.prototype.appendChild,
      'cloneNode': Element.prototype.cloneNode,
      'Element_contains': Element.prototype.contains,
      'Array_includes': Array.prototype.includes,
      'Array_push': Array.prototype.push,
      'Array_splice': Array.prototype.splice,
      'Array_indexOf': Array.prototype.indexOf,
      'Set_has': Set.prototype.has,
      'WeakSet_has': WeakSet.prototype.has
    };
    document.createElement = function() {};

    const isAds = function(node) {
      if (node.nodeName === 'A' || node.nodeName === 'DIV') {
        for (const style of styleAttributes) {
          if (safe.hasAttribute.apply(node, [style]) === true) {
            return true;
          };
        };
      };
      return false;
    };

    const genericGet = function(target, thisArg, args) {
      if (thisArg === 'toString') {
        return target.toString.bind(target);
      };
      return Reflect.get(target, thisArg, args);
    };

    let styleAttributes = [];
    const findStyleAttributes = function(doc) {
      const arrayDifference = function(array1, array2) {
        const longerArray = array1.length >= array2.length ? array1 : array2;
        const shorterArray = array1.length < array2.length ? array1 : array2;
        return longerArray.filter(item => !shorterArray.includes(item));
      };

      const originalNode = safe.querySelector.apply(doc, ['a > img']).parentNode;
      const modifiedNode = safe.querySelector.apply(document, ['a > img']).parentNode;
      const originalAttributes = safe.getAttributeNames.apply(originalNode);
      const modifiedAttributes = safe.getAttributeNames.apply(modifiedNode);
      styleAttributes = new Set(arrayDifference(originalAttributes, modifiedAttributes));

      if (styleAttributes.size === 0) {
        location.reload();
      };

      for (const style of styleAttributes) {
        const nodes = [...safe.querySelectorAll.apply(document, ['aside:not(main aside) > div']), ...safe.querySelectorAll.apply(document, ['footer div:nth-child(2)'])];
        for (let i = 0, len = nodes.length; i < len; ++i) {
          safe.setAttribute.apply(nodes[i], [style, '']);
        };
      };
    };

    const generateID = function(len) {
      const dec2hex = function(dec) {
        return dec.toString(16).padStart(2, '0');
      };
      const arr = new Uint8Array((len || 40) / 2);
      window.crypto.getRandomValues(arr);
      const result = Array.from(arr, dec2hex).join('').replace(/^\d+/g, '');
      if (result.length < 3) {
        return generateID(len);
      };
      return result;
    };

    const randomAttribute = generateID(15);
    const makeShadowRoot = function() {
      const hostElement = safe.createElement.apply(document, ['span']);
      hostElement.style.display = 'none';
      safe.setAttribute.apply(hostElement, [randomAttribute, '']);
      safe.appendChild.apply(document.body, [hostElement]);
      const shadowRoot = safe.attachShadow.apply(hostElement, [{mode: 'closed'}]);

      const styleSheets = safe.styleSheets;
      for (let i = 0, len = styleSheets.length; i < len; ++i) {
        const styleSheet = styleSheets[i];
        if (styleSheet.href && new URL(styleSheet.href).host === 'soft98.ir') {
          safe.appendChild.apply(shadowRoot, [safe.cloneNode.apply(styleSheet.ownerNode, [false])]);
        };
      };

      return [hostElement, shadowRoot];
    };

    window.getComputedStyle = new Proxy(window.getComputedStyle, {
      apply(target, thisArg, args) {
        const node = args[0];
        const style = Reflect.apply(target, thisArg, args);

        if (style.clipPath === 'none' || isAds(node) === false) {
          return style;
        };

        const [hostElement, shadowRoot] = makeShadowRoot();
        const shadowNode = safe.appendChild.apply(shadowRoot, [safe.cloneNode.apply(node, [false])]);
        for (const style of styleAttributes) {
          safe.removeAttribute.apply(shadowNode, [style]);
        };
        const newStyle = safe.getComputedStyle.apply(window, [shadowNode]);
        const value = newStyle.getPropertyValue('clip-path');
        hostElement.remove();

        Object.defineProperty(style, 'clipPath', {
          get: function() {
            return value;
          }
        });

        style.getPropertyValue = new Proxy(style.getPropertyValue, {
          apply(target, thisArg, args) {
            if (args[0] !== 'clip-path') {
              return Reflect.apply(target, thisArg, args);
            };
            return value;
          },
          get: genericGet
        });
        return style;
      },
      get: genericGet
    });

    window.MutationObserver = new Proxy(window.MutationObserver, {
      construct: function(target, args) {
        const callback = args[0];
        const proxiedCallback = function(mutations, observer) {
          for (let len = mutations.length, i = len - 1; i >= 0; --i) {
            const mutation = mutations[i];
            if (mutation.type === 'attributes') {
              if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
                continue;
              };
              if (safe.Set_has.apply(styleAttributes, [mutation.attributeName]) === true || mutation.attributeName === randomAttribute) {
                safe.Array_splice.call(mutations, i, 1);
              };
            } else if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              const nodes = mutation.addedNodes;
              for (let j = 0, len2 = nodes.length; j < len2; ++j) {
                const node = nodes[j];
                if (safe.hasAttribute.apply(node, [randomAttribute]) === true) {
                  safe.Array_splice.call(mutations, i, 1);
                  break;
                };
              };
            };
          };
          if (mutations.length !== 0) {
            callback(mutations, observer);
          };
        };
        args[0] = proxiedCallback;
        const observer = Reflect.construct(target, args);
        return observer;
      },
      get: genericGet
    });

    self.EventTarget.prototype.addEventListener = new Proxy(self.EventTarget.prototype.addEventListener, {
      apply(target, thisArg, args) {
        if (args[0] === 'contextmenu') {
          if (thisArg.nodeName === 'DIV' && safe.Element_contains.apply(safe.querySelector.apply(document, ['main article']), [thisArg]) === true) {
            for (const style of styleAttributes) {
              safe.setAttribute.apply(thisArg, [style, '']);
            };
            self.EventTarget.prototype.addEventListener = target;
          };
        };
        return Reflect.apply(target, thisArg, args);
      },
      get: genericGet
    });

    let mainCode = '';
    window.eval = new Proxy(window.eval, {
      apply(target, thisArg, args) {
        mainCode = args[0];
        args[0] = function() {};
        window.eval = target;
        return Reflect.apply(target, thisArg, args);
      },
      get: genericGet
    });

    Element.prototype.getAttributeNames = new Proxy(Element.prototype.getAttributeNames, {
      apply(target, thisArg, args) {
        const attributes = Reflect.apply(target, thisArg, args);
        if (isAds(thisArg) === false) {
          return attributes;
        };

        for (const style of styleAttributes) {
          const index = safe.Array_indexOf.apply(attributes, [style]);
          if (index > -1) {
            safe.Array_splice.apply(attributes, [index]);
          };
        };
        return attributes;
      },
      get: genericGet
    });

    Object.defineProperty(Element.prototype, 'attributes', {
      get: function() {
        const node = this;
        if (isAds(node) === false) {
          return safe.Element_attributes.call(node);
        };

        const newNode = safe.cloneNode.apply(node, [false]);
        for (const style of styleAttributes) {
          safe.removeAttribute.apply(newNode, [style]);
        };
        return safe.Element_attributes.call(newNode);
      }
    });

    const replaceScripts = function(doc) {
      const originalNodes = safe.querySelectorAll.apply(doc, ['script']);
      const modifiedNodes = safe.querySelectorAll.apply(document, ['script']);
      document.createElement = safe.createElement;
      for (let i = 0, len = originalNodes.length; i < len; ++i) {
        const originalNode = originalNodes[i];
        const modifiedNode = modifiedNodes[i];
        const newScript = safe.createElement.apply(document, ['script']);
        const attributes = safe.Element_attributes.call(originalNode);
        for (let j = 0, len2 = attributes.length; j < len2; ++j) {
          const attribute = attributes[j];
          newScript.setAttribute(attribute.name, attribute.value);
        };
        newScript.textContent = originalNode.textContent;
        modifiedNode.insertAdjacentElement('afterend', newScript);
        modifiedNode.remove();
      };
    };

    let doc = '';
    const xhr = new XMLHttpRequest();
    xhr.open('GET', location.href, false);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const parser = new DOMParser();
        doc = parser.parseFromString(xhr.responseText, 'text/html');
      };
    };
    xhr.send();

    const main = function() {
      findStyleAttributes(doc);
      replaceScripts(doc);

      const intervalID = safe.setInterval.apply(window, [function() {
        if (mainCode !== '') {
          safe.clearInterval.apply(window, [intervalID]);
          delete window.alreadyRun;
          safe.eval.apply(window, [mainCode]);
        };
      }, 1]);

    };

    if (document.readyState !== 'loading') {
      main();
    } else {
      safe.addEventListener.apply(document, ['DOMContentLoaded', main]);
    };

  }) ();
};

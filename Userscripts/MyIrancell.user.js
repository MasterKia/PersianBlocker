// ==UserScript==
// @name         MyIrancell
// @description  رفع مشکل دکمه «پرداخت» در ایرانسل من روی فایرفاکس اندروید
// @match        http://my.irancell.ir/*
// @match        https://my.irancell.ir/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
  window.open = new Proxy(window.open, {
    apply(target, thisArg, args) {
      if (args[1] === '_blank' && args[0].startsWith('https://pgweb.irancell.ir/IPSPG/')) {
        location.href = args[0];
        return;
      };
      return Reflect.apply(target, thisArg, args);
    }
  });
}) ();

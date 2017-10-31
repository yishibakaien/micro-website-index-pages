!function(n){function r(e){if(t[e])return t[e].exports;var o=t[e]={i:e,l:!1,exports:{}};return n[e].call(o.exports,o,o.exports,r),o.l=!0,o.exports}var t={};r.m=n,r.c=t,r.i=function(n){return n},r.d=function(n,t,e){r.o(n,t)||Object.defineProperty(n,t,{configurable:!1,enumerable:!0,get:e})},r.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return r.d(t,"a",t),t},r.o=function(n,r){return Object.prototype.hasOwnProperty.call(n,r)},r.p="",r(r.s=9)}({9:function(n,r){}});

var mask = document.createElement('div');
mask.className = 'mask';
var bg = document.getElementsByClassName('bg')[0];
bg.insertBefore(mask, bg.childNodes[0]);
document.querySelector('.logo-container').onclick = function() {
    if (this.className.indexOf('active') === -1) {
        this.className = 'logo-container active';
        Array.prototype.forEach.call(document.getElementsByClassName('list-container'), function(item) {
                item.className = 'list-container active';
        });
        mask.className = 'mask mask-active';
    } else {
        this.className = 'logo-container';
        Array.prototype.forEach.call(document.getElementsByClassName('list-container'), function(item) {
            item.className = 'list-container';
        });
         mask.className = 'mask';
    }
}

/**
 * [![Build Status](https://travis-ci.com/ramiel/callbag-group.svg?branch=master)](https://travis-ci.com/ramiel/callbag-group)
 * 
 * # Callbag Group operator
 * 
 * A callbag operator that group data in chunks of a given size
 * 
 * ## Install
 * 
 * `npm install callbag-group`
 * 
 * ## Example
 * 
 * ```js
 * const iterate = require('callbag-iterate');
 * const range = require('callbag-range');
 * const group = require('callbag-group');
 * 
 * const source = range(1, 10);
 * const groupedSource = group(5)(source);
 * 
 * iterate((x) => {
 *   console.log(x);
 * })(groupedSource);
 * 
 * // Prints:
 * // [1,2,3,4,5]
 * // [6,7,8,9,10]
 * ```
 * 
 */

'use strict';

export const group = n => source => (start, sink) => {
  if (start !== 0) return;
  let talkback;
  const chunk = [];
  source(0, (t, d) => {
    if (t === 0) {
      talkback = d;
    }
    if (t === 1) {
      chunk.push(d);
      if (chunk.length === n) {
        sink(t, chunk.splice(0));
      }
      talkback(1);
    } else {
      if (t === 2 && chunk.length) {
        sink(1, chunk.splice(0));
      }
      sink(t, d);
    }
  });
};



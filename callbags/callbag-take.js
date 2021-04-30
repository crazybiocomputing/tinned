/**
 * # callbag-take
 * 
 * Callbag operator that limits the amount of data sent by a source. Works on either pullable and listenable sources.
 * 
 * `npm install callbag-take`
 * 
 * ## example
 * 
 * On a listenable source:
 * 
 * ```js
 * const interval = require('callbag-interval');
 * const observe = require('callbag-observe');
 * const take = require('callbag-take');
 * 
 * const source = take(3)(interval(1000));
 * 
 * source(0, observe(x => console.log(x))); // 0
 *                                          // 1
 *  *                                          // 2
 * ```
 * 
 * On a pullable source:
 * 
 * ```js
 * const fromIter = require('callbag-from-iter');
 * const iterate = require('callbag-iterate');
 * const take = require('callbag-take');
 * 
 * function* range(from, to) {
 *   let i = from;
 *   while (i <= to) {
 *     yield i;
 *     i++;
 *   }
 * }
 * 
 * const source = take(4)(fromIter(range(100, 999)));
 * 
 * source(0, iterate(x => console.log(x))); // 100
 *                                          // 101
 *                                          // 102
 *                                          // 103
 * ```
 */

'use strict';

export const take = max => source => (start, sink) => {
  if (start !== 0) return;
  let taken = 0;
  let sourceTalkback;
  let end;
  function talkback(t, d) {
    if (t === 2) {
      end = true;
      sourceTalkback(t, d);
    } else if (taken < max) sourceTalkback(t, d);
  }
  source(0, (t, d) => {
    if (t === 0) {
      sourceTalkback = d;
      sink(0, talkback);
    } else if (t === 1) {
      if (taken < max) {
        taken++;
        sink(t, d);
        if (taken === max && !end) {
          end = true
          sourceTalkback(2);
          sink(2);
        }
      }
    } else {
      sink(t, d);
    }
  });
};


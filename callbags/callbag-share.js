/**
 * # callbag-share
 * 
 * Callbag operator that broadcasts a single source to multiple sinks. Does reference counting on sinks and starts the source when the first sink gets connected, similar to RxJS [`.share()`](https://www.learnrxjs.io/operators/multicasting/share.html). Works on either pullable or listenable sources.
 * 
 * `npm install callbag-share`
 * 
 * ## example
 * 
 * Share a listenable source to two listeners:
 * 
 * ```js
 * const interval = require('callbag-interval');
 * const observe = require('callbag-observe');
 * const share = require('callbag-share');
 * 
 * const source = share(interval(1000));
 * 
 * observe(x => console.log(x))(source); // 0
 *                                       // 1
 *                                       // 2
 *                                       // 3
 *                                       // ...
 * 
 * setTimeout(() => {
 *   observe(x => console.log(x))(source); // 3
 *                                         // 4
 *                                         // 5
 *                                         // ...
 * }, 3500);
 * ```
 * 
 * Share a pullable source to two pullers:
 * 
 * ```js
 * const fromIter = require('callbag-from-iter');
 * const share = require('callbag-share');
 * 
 * const source = share(fromIter([10,20,30,40,50]));
 * 
 * let talkback;
 * source(0, (type, data) => {
 *   if (type === 0) talkback = data;
 *   else console.log('a' + data);
 * });
 * 
 * source(0, (type, data) => {
 *   if (type === 1) console.log('b' + data);
 * });
 * 
 * talkback(1); // a10
 *              // b10
 * talkback(1); // a20
 *              // b20
 * ```
 * 
 */

'use strict';

export const share = source => {
  let sinks = [];
  let sourceTalkback;

  return function shared(start, sink) {
    if (start !== 0) return;
    sinks.push(sink);

    const talkback = (t, d) => {
      if (t === 2) {
        const i = sinks.indexOf(sink);
        if (i > -1) sinks.splice(i, 1);
        if (!sinks.length) sourceTalkback(2);
      } else {
        sourceTalkback(t, d);
      }
    };

    if (sinks.length === 1) {
      source(0, (t, d) => {
        if (t === 0) {
          sourceTalkback = d;
          sink(0, talkback);
        } else for (let s of sinks.slice(0)) s(t, d);
        if (t === 2) sinks = [];
      });
      return
    }

    sink(0, talkback);
  }
};


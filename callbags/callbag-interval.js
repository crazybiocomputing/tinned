/**
 * # callbag-interval
 * 
 * A callbag listenable source that sends incremental numbers every x milliseconds.
 * 
 * `npm install callbag-interval`
 * 
 * ## example
 * 
 * ```js
 * const interval = require('callbag-interval');
 * const observe = require('callbag-observe');
 * 
 * const source = interval(1000);
 * 
 * observe(x => console.log(x))(source); // 0
 *                                       // 1
 *                                       // 2
 *                                       // 3
 *                                       // ...
 * ```
*/

'use strict';

export const interval = period => (start, sink) => {
  if (start !== 0) return;
  let i = 0;
  const id = setInterval(() => {
    sink(1, i++);
  }, period);
  sink(0, t => {
    if (t === 2) clearInterval(id);
  });
};



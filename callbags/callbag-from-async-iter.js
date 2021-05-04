/**
 * # callbag-from-async-iter
 *
 * 👜 Converts an async iterable or iterator into a callbag pullable source
 *
 * `npm install callbag-from-async-iter`
 * *
 * ## Example
 *
 * ### Async range from a generator function
 *
 * ```js
 * const fromAsyncIter = require('callbag-from-async-iter');
 * const { forEach, pipe } = require('callbag-basics');
 *
 * async function * asyncRange() {
 *   let n = 0;
 *   while (n < 10000) {
 *     yield Promise.resolve(n++);
 *   }
 * }
 * 
 * pipe(
 *   fromAsyncIter(asyncRange()),
 *   forEach((x) => {
 *     console.log(x); // 0, 1, ..., 9999
 *   })
 * );
 * ```
 */

'use strict';

export const fromAsyncIter = asyncIter => (start, sink) => {
  if (start !== 0) return;

  const iterator = typeof Symbol !== 'undefined' && asyncIter[Symbol.asyncIterator]
    ? asyncIter[Symbol.asyncIterator]()
    : asyncIter;

  let done, disposed, error, draining;

  sink(0, t => {
    if (disposed || done || error) return;

    if (t === 1) {
      while (draining = !draining) {
        iterator
          .next()
          .then(res => {
            done = res.done;
            return res.value;
          })
          .then(val => done ? sink(2) : val)
          .then(val => !done && sink(1, val))
          .catch(err => {
            error = true;
            sink(2, err);
          });
      }
    }

    if (t === 2) disposed = true;
  });
};


/**
 * # callbag-of
 * 
 * Callbag source factory that emits values specified as arguments. 
 * It's similar to [`fromIter`](https://github.com/staltz/callbag-from-iter/), 
 * but this one creates a listenable source and does not rely on iteration protocol.
 * 
 * ## Example
 * 
 * ```js
 * import observe from 'callbag-observe'
 * import of from 'callbag-of'
 * import pipe from 'callbag-pipe'
 * 
 * pipe(
 *   of(1, 2, 3, 4, 5),
 *   observe(value => {
 *     // will log 1, 2, 3, 4, 5
 *     console.log(value)
 *   }),
 * )
 * ```
 * 
 */

'use strict';

export function of(...values) {
  return (start, sink) => {
    if (start !== 0) return;

    let copy = values.slice();
    let disposed = false;

    sink(0, type => {
      if (type !== 2) return;
      disposed = true;
      copy.length = 0;
    })

    while (copy.length !== 0) {
      sink(1, copy.shift());
    }

    if (disposed) return;

    sink(2);
  }
}
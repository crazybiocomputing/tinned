/**
 * # callbag-from-iter
 * 
 * Convert a JS Iterable or Iterator to a callbag pullable source (it only sends data when requested).
 * 
 * `npm install callbag-from-iter`
 * 
 * ## example
 * 
 * Convert an Iterable:
 * 
 * ```js
 * const fromIter = require('callbag-from-iter');
 * const iterate = require('callbag-iterate');
 * 
 * const source = fromIter([10, 20, 30, 40]);
 * 
 * iterate(x => console.log(x))(source);   // 10
 *                                         // 20
 *                                         // 30
 *                                         // 40
 * ```
 * 
 * Convert an Iterator:
 * 
 * ```js
 * const fromIter = require('callbag-from-iter');
 * const iterate = require('callbag-iterate');
 * 
 * const source = fromIter([10, 20, 30, 40].entries());
 * 
 * iterate(x => console.log(x))(source); // [0,10]
 *                                       // [1,20]
 *                                       // [2,30]
 *                                       // [3,40]
 * ```
 * 
 * @param {*} iter 
 * @param {*} start 
 * @param {*} sink 
 * @returns 
 */


export const fromIter = iter => (start, sink) => {
  if (start !== 0) return;
  const iterator =
    typeof Symbol !== 'undefined' && iter[Symbol.iterator]
      ? iter[Symbol.iterator]()
      : iter;
  let inloop = false;
  let got1 = false;
  let completed = false;
  let res;
  function loop() {
    inloop = true;
    while (got1 && !completed) {
      got1 = false;
      res = iterator.next();
      if (res.done) {
        sink(2);
        break;
      }
      else sink(1, res.value);
    }
    inloop = false;
  }
  sink(0, t => {
    if (completed) return

    if (t === 1) {
      got1 = true;
      if (!inloop && !(res && res.done)) loop();
    } else if (t === 2) {
      completed = true;
    }
  });
};

/**
 * # callbag-from-promise
 * 
 * Convert a Promise to a callbag listenable source.
 * 
 * `npm install callbag-from-promise`
 * 
 * ## example
 * 
 * ```js
 * const fromPromise = require('callbag-from-promise');
 * const observe = require('callbag-observe');
 * 
 * const source = fromPromise(
 *   fetch('http://jsonplaceholder.typicode.com/users/1')
 *     .then(res => res.json())
 * );
 * 
 * observe(user => console.log(user.name))(source); // Leanne Graham
 * ```
 * 
 */

'use strict';

export const fromPromise = promise => (start, sink) => {
  if (start !== 0) return;
  let ended = false;
  const onfulfilled = val => {
    if (ended) return;
    sink(1, val);
    if (ended) return;
    sink(2);
  };
  const onrejected = (err = new Error()) => {
    if (ended) return;
    sink(2, err);
  };
  promise.then(onfulfilled, onrejected);
  sink(0, t => {
    if (t === 2) ended = true;
  });
};



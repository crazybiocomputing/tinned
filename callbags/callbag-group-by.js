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
 * Adapted from callbag-group
 */

'use strict';

import {pipe} from './callbag-pipe.js';
import {scan} from './callbag-scan.js';
import {last} from './callbag-last.js';
import {switchMap} from './callbag-switch-map.js';
import {fromIter} from './callbag-from-iter.js';

export const groupBy = selector => source => {
  return pipe(
    source,
    scan( (groups,obj) => {
      let key = selector(obj);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(obj);
      return groups;
    },
    {}),
    last(),
    switchMap( 
      gs =>fromIter(Array.from({length: Object.keys(gs).length}, (_,i) => Object.keys(gs)[i])),
      (grps,key) => grps[key]
    )
  );
}

/* TODO
export const groupBy = selector => source => (start, sink) => {
  if (start !== 0) return;
  let talkback;
  let groups = {};
  source(0, (t, d) => {
    if (t === 0) {
      talkback = d
      sink(t, d);
    }
    else if (t === 1) {
      const key = selector(d);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(d);
      talkback(1);
    }
    else {
      if (t === 2) {
        sink(1,groups);
      }
      sink(t, d);
    }
  });
};

*/

/*
 *  TINNED: TINy Node EDitor
 *  Copyright (C) 2021  Jean-Christophe Taveau.
 *
 *  This file is part of TINNED
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with TINNED.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

'use strict';

import {scan} from '../../callbags/callbag-scan.js';
import {map} from '../../callbags/callbag-map.js';
import {last} from '../../callbags/callbag-last.js';
import {pipe} from '../../callbags/callbag-pipe.js';
import {tap} from '../../callbags/callbag-tap.js';
import {take} from '../../callbags/callbag-take.js';
import {fromIter} from '../../callbags/callbag-from-iter.js';
import {forEach} from '../../callbags/callbag-for-each.js';


const redux = (accu,x) => {
  if (accu.count === 0) {
    accu.K = x;
  }
  accu.sum += x;
  accu.sum2 += x * x;
  accu.count++;
  accu.diff +=  x - accu.K;
  accu.diff2 += (x - accu.K) * (x - accu.K); 
  accu.min = Math.min(accu.min,x);
  accu.max = Math.max(accu.max,x);
  return accu;
}

/*
    TODO Iterative algorithms...
    mean += eta * (sample - mean) eta = learning rate...
    median += eta * sgn(sample - median)
    quantile += eta * (sgn(sample - quantile) + 2.0 * p - 1.0)
    http://en.wikipedia.org/wiki/Quantile_function)
    https://www.cse.wustl.edu/~jain/papers/ftp/psqr.pdf
*/
const None = (_stats) => ({sum:0,count:0,min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY});
const Count = (_stats) => _stats.count;
const Sum = (_stats) => _stats.sum;
const Mean = (_stats) => _stats.sum / _stats.count;
const Variance = (_stats) => (_stats.diff2 - _stats.diff * _stats.diff / _stats.count) / _stats.count;
const SD = (_stats) => Math.sqrt(Variance(_stats));
const Min = (_stats) => _stats.min;
const Max = (_stats) => _stats.max;
const Median = (_stats) => 'TODO';
const All = (_stats) => ({
  count: Count(_stats),
  min: Min(_stats),
  max: Max(_stats),
  sum: Sum(_stats),
  median: Median(_stats),
  mean: Mean(_stats),
  SD: SD(_stats),
  variance: Variance(_stats)
});


const operators = {All,Count,Max,Mean,Median,Min,None,SD,Sum,Variance};

const stats = (node) => (stream) => {

  let statistics = [];

  const streamArray = () => pipe(
    source$,
    map(arr => arr.reduce(
      redux,
      {sum:0,sum2:0,diff:0,diff2:0,K:0,count:0,min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY}
    ) ),
    map(operators[node.data.state?.op || 'None']),
    tap(val => console.info('ARRAY',val)),
    forEach(val => statistics.push(val))
  );

  const streamSingle = () => pipe(
    source$,
    scan(redux,{sum:0,sum2:0,diff:0,diff2:0,K:0,count:0,min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY}),
    last(),
    map(operators[node.data.state?.op || 'None']),
    tap(val => console.info('SINGLE',val)),
    forEach(val => statistics = [val])
  );

  // Get source...
  let source$ = stream.getCallbag(`x@${node.id}`);
  // Check if input is Array or not
  let isArray = false;
  pipe(
    source$,
    tap(val => console.info('isARRAY???',Array.isArray(val),val)),
    map(val => Array.isArray(val)),
    take(1),
    forEach(flag => isArray = flag)
  )

  // Run stream

  const stream$ = (isArray) ? streamArray() : streamSingle();

  // Create a new stream form statistical data and inject into the pipeline
  stream.setCallbags(`result@${node.id}`, fromIter(statistics) );
  // Return stream
  return stream;
}

export const stats_ui =  {
  id: "PROG_STATS",
  class: "programming",
  description: "Stats",
  tags: ["average","count","sum","mean","SD","median","min","max"],
  help: ["Compute Basic Statistics"],
  func: stats,
  ui: [
    [
      {widget:"label",title: "Result"}, 
      {widget: "output",name:"result:any"}
    ],
    [
        {widget: "label", title: "Op."},
        {widget: "select", state: 0, name: "op:string", "items": ["None","Count","Sum","Mean","Median","Variance","SD","Min","Max","All"]},
      ],
    [
      {widget: "input",name: "x:number"},
      {widget:"label",title: "x"}
    ]
  ]
};
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
import {last} from '../../callbags/callbag-last.js';
import {pipe} from '../../callbags/callbag-pipe.js';

// Filter operator
const reduce = (node) => (stream) => {
  // Get params + source.s
  let sourceObservable = stream[node.sources[0]];
  const code = node.data.state.code;
  const redux = new Function('accu','x','const foo = ' + code + '\nreturn foo(accu,x);');
  // Create Observable
  const obs = pipe(scan(redux,init),last)(sourceObservable);
  // Store observable in stream
  node.targets.forEach( key => {
    stream[key] = obs;  
  });
  // Return stream
  return stream;
}

export const reduce_ui =  {
  id: "PROG_REDUCE",
  class: "reactive",
  description: "Reduce",
  tags: ["fold","accumulate","scan"],
  help: ["For each input `x`, calculate f(x) and accumulate result"],
  func: reduce,
  ui: [
    [
      {widget:"label",title: "Result"}, 
      {widget: "output",name:"result:any"}
    ],
    [
      {widget: "input",name: "x:any"},
      {widget:"label",title: "x"}
    ],
    [
      {widget: "input",name: "init:any"},
      {widget:"label",title: "Init"}
    ],
    [
      {widget:"textarea", state: "(accu,x) => (accu = x);\n",name: "code:string"}
    ]
  ]
};
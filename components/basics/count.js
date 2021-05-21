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

import {count} from '../../callbags/callbag-count.js';
import {pipe} from '../../callbags/callbag-pipe.js';
import {forEach} from '../../callbags/callbag-for-each.js';
import {fromIter} from '../../callbags/callbag-from-iter.js';
import {of} from '../../callbags/callbag-of.js';

// Count operator
const count_items = (node) => (stream) => {

  // Get source...
  let source$ = stream.getCallbag(`x@${node.id}`);
  // Get params
  if (node.data.state.save) {
    // Update code from textarea
    node.data.state.code = document.querySelector(`#code__AT__${node.id}`).value;
    node.data.state.save = false;
  }
  const code = node.data.state.code;
  const predicate = new Function('x','const foo = ' + code + '\nreturn foo(x);');
  let data;
  const COUNT_INIT = 0;
  // Create Stream$
  const stream$ = pipe(
    source$,
    count(predicate,COUNT_INIT),
  //  forEach(val => data = val)
  );

  // Create a new stream from count data and inject into the pipeline
  stream.setCallbags(`result@${node.id}`,stream$); // fromIter([data]));
  // Return stream
  return stream;
}

export const count_ui =  {
  id: "PROG_COUNT",
  class: "tool",
  description: "Count",
  tags: ["length","size"],
  help: ["Count the number of values in the stream depending of the predicate"],
  func: count_items,
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
      {widget:"button", state: "",icon: 'floppy-o',title: 'Save',name: "save:boolean"}
    ],
    [
      {widget:"textarea", state: "(x) => true\n",name: "code:string"}
    ]
  ]
};
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

import {of} from '../../callbags/callbag-of.js';
import {scan} from '../../callbags/callbag-scan.js';
import {last} from '../../callbags/callbag-last.js';
import {pipe} from '../../callbags/callbag-pipe.js';
import {observe} from '../../callbags/callbag-observe.js';


// Filter operator
const reduce = (node) => (stream) => {
  // Get sources...
  let source$ = stream.getCallbags(`x@${node.id}`);
  let initSource$ = stream.getCallbag(`init@${node.id}`)  || of(0);
  let init;
  observe((x) => init = x)(initSource$);
  // Update code if required
  if (node.data.state.save) {
    // Update code from textarea
    node.data.state.code = document.querySelector(`#code__AT__${node.id}`).value;
    node.data.state.save = false;
  }
  const code = node.data.state.code;
  const redux = new Function('accu','x','const foo = ' + code + '\nreturn foo(accu,x);');
  // Create Observable
  const stream$ = pipe(source$,scan(redux,init),last());
  // Set stream
  stream.setCallbags(`result@${node.id}`,stream$);
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
      {widget:"button", state: "",icon: 'floppy-o',title: 'Save',name: "save:boolean"}
    ],
    [
      {widget:"textarea", state: "(accu,x) => (accu = x);\n",name: "code:string"}
    ]
  ]
};
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

import {filter} from '../../callbags/callbag-filter.js';

// Filter operator
const filterFunc = (node) => (stream) => {
  // Get Source...
  let source$ = stream.getCallbags(node)[0];
  // Get Params
  if (node.data.state.save) {
    // Update code from textarea
    node.data.state.code = document.querySelector(`#code__AT__${node.id}`).value;
    node.data.state.save = false;
  }
  const code = node.data.state.code;
  const predicate = new Function('x','const foo = ' + code + '\nreturn foo(x);');
  // Create Observable
  const stream$ = filter(predicate)(source$);
  // Set stream
  stream.setCallbags(`result@${node.id}`,stream$);
  // Return stream
  return stream;
}

export const filter_ui =  {
  id: "PROG_FILTER",
  class: "reactive",
  description: "Filter",
  tags: ["filter"],
  help: ["Filter input data according to predicate"],
  func: filterFunc,
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
      {widget:"textarea", state: "(x) => true;\n",name: "code:string"}
    ]
  ]
};
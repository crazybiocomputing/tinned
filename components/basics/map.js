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

import {map} from '../../callbags/callbag-map.js';

// MAP operator
const mapFunc = (node) => (stream) => {
  // Get source...
  let source$ = stream.getCallbags(node)[0];
  // Get params
  if (node.data.state.save) {
    // Update code from textarea
    node.data.state.code = document.querySelector(`#code__AT__${node.id}`).value;
    node.data.state.save = false;
  }
  const code = node.data.state.code;
  const mapFun = new Function('x','const foo = ' + code + '\nreturn foo(x);');
  // Create Observable
  const stream$ = map(mapFun)(source$);
  // Set stream
  stream.setCallbags(`result@${node.id}`,stream$);
  // Return stream
  return stream;
}

export const map_ui =  {
  id: "PROG_MAP",
  class: "tool",
  description: "Map",
  tags: ["map","forEach"],
  help: ["For each input `x`, calculate f(x)"],
  func: mapFunc,
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
      {widget:"button", state: true, icon: 'floppy-o',title: 'Save', name: "save:boolean"}
    ],
    [
      {widget:"textarea", state: "(x) => x\n",on: {'change': (ev) => {}},name: "code:string"}
    ]
  ]
};
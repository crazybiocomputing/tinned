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

import {pipe} from '../../callbags/callbag-pipe.js';
import {merge} from '../../callbags/callbag-merge.js';
import {fromEvent} from '../../callbags/callbag-from-event.js';
import {filter} from '../../callbags/callbag-filter.js';
import {map} from '../../callbags/callbag-map.js';

let default_style;

const textChanged = (ev) => {
  const node_id = ev.target.id.split('__AT__')[1];
  const button = document.querySelector(`#save__AT__${node_id}`);
  if (default_style === undefined) {
    default_style = [button.style.backgroundColor,button.style.color];
  }
  button.style.backgroundColor = '#b11';
  button.style.color = 'white';
}

const resetStyle = (ev) => {
  ev.target.style.backgroundColor = default_style[0];
  ev.target.style.color = default_style[1];
}

// MAP operator
const mapFunc = (node) => (stream) => {
  // Get source...
  let source$ = stream.getCallbag(`x@${node.id}`);
  const button = document.querySelector(`#save__AT__${node.id}`);
  // Get params
  if (node.data.state.save) {
    // Update code from textarea
    node.data.state.code = document.querySelector(`#code__AT__${node.id}`).value;
    node.data.state.save = false;
  }
  const code = node.data.state.code;
  const mapFun = new Function('x','const foo = ' + code + '\nreturn foo(x);');
  // Create Observable
  const stream$ = pipe(
    merge(source$,fromEvent(button,'click')),
    filter(data => {
      if (data.target && data.target.id.includes('save')) {
        // Stop...
        stream.dispose();
        // and Start
        stream.run();
        return false;
      }
      return true;
    }),
    map(mapFun)
  );
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
      {widget:"button", state: true, icon: 'floppy-o',on: {'mouseup': resetStyle},title: 'Save', name: "save:boolean"}
    ],
    [
      {widget:"textarea", state: "(x) => x\n",on: {'input': textChanged},name: "code:string"}
    ]
  ]
};
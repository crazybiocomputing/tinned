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

import {fromIter} from '../../callbags/callbag-from-iter.js';
import {fromEvent} from '../../callbags/callbag-from-event.js';
import { pipe } from '../../callbags/callbag-pipe.js';
import { merge } from '../../callbags/callbag-merge.js';
import {forEach} from '../../callbags/callbag-for-each.js';
import {filter} from '../../callbags/callbag-filter.js';
import {share} from '../../callbags/callbag-share.js';


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
  if (default_style !== undefined) {
    ev.target.style.backgroundColor = default_style[0];
    ev.target.style.color = default_style[1];
  }
}

const iterInit = (node,stream) => {
  // Event callback Functions

  // Get widget(s)
  const button = document.querySelector(`#save__AT__${node.id}`);

  // Update node's states when user interaction
  const event$ = pipe(
    merge(fromEvent(button,'click'),fromEvent(button,'mouseup')),
    filter(ev => {
      if (ev.type === 'mouseup') {
        resetStyle(ev);
        return false;
      }
      return true;
    }),
    forEach(ev => {
      // Button click
      if (node.data.state.save) {
        node.data.state.save = false;
        // Stop...
        stream.dispose();
        // and Start
        stream.run();
      }
    })
  );
}

const iterFunc = (node) => (stream) => {

  // Global
  let arr;

  // Add events for the first time
  if (!node.eventAdded) {
    iterInit(node,stream);
    node.eventAdded = true;
  }

  // Get/Set params at creation
  // Update code from textarea
  node.data.state.code = document.querySelector(`#code__AT__${node.id}`).value;
  // try ... catch
  arr = new Function( `return ${node.data.state?.code || '[]'}`)();
  node.data.state.save = false;

  // Set (multicast) source$ in stream
  const stream$ = fromIter(arr); // merge(fromIter(arr),fromEvent(button,'click')),

  stream.setCallbags(`value@${node.id}`,stream$); // share());
  // Return stream
  return stream;
}

export const iterable_ui =   {
  id: "BASX_ITERABLE",
  class: "primitive",
  description: "Iterable",
  help: ["Stream of items"],
  tags: ["character","list","string","array","item"],
  func: iterFunc,
  ui: [
    [
      {widget:"label",title: "Data"}, 
      {widget: "output", title: "Stream",name: "value:any"}
    ],
    [
      {
        widget:"button", state: true, icon: 'floppy-o', title: 'Save', name: "save:boolean",
        on: {'mouseup': resetStyle},
      }
    ],
    [
      {widget:"textarea", state: "[0,1]",on: {'input': textChanged},name: "code:string"}
    ]

  ]
};

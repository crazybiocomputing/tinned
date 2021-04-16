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

import {Observable} from '../../src/core/observable.js';

const monitor = (node) => (ob) => {
  // Update node
  const textarea = document.querySelector(`#node_${node.id} textarea`);
  // Do it!!
  ob.subscribe({
    next: (val) => {
      node.data.state.log += val + '\n';
      textarea.innerHTML = node.data.state?.log;
    },
    error: (err) => console.error(err),
    complete: () => console.log('Complete')
  })
}

export const monitor_ui = {
  id: "BASX_MONITOR",
  class: "information",
  description: "Monitor",
  tags: ["console","display","log","print","show","tap"],
  help: ["Look at data through the pipeline"],
  comment: ["Network tap https://en.wikipedia.org/wiki/Network_tap"],
  func: monitor,
  ui: [
    [
      {widget:"label",title: "Data"}, 
      {widget: "output",name:"data:any"}
    ],
    [
      {widget: "input",name: "data:any"},
      {widget:"label",title: "Data"}
    ],
    [
      {widget:"textarea", state: "",name: "log:string"}
    ]
  ]
};
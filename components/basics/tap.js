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

import {tap as cbag_tap} from '../../callbags/callbag-tap.js';

const tap = (node) => (stream) => {
  // Get source
  let sourceObservable = stream[node.sources[0]];
  const textarea = document.querySelector(`#node_${node.id} textarea`);

  console.log(sourceObservable);

  // Create observable
  const obs = cbag_tap( (val) => {
    // Update node
    node.data.state.log += val + '\n';
    textarea.innerHTML = node.data.state?.log;
  })(sourceObservable);

  // Dispatch observable
  node.targets.forEach( key => {
    stream[key] = obs;
  });
  
  // Return stream
  return stream;
}

export const tap_ui = {
  id: "PROG_TAP",
  class: "information",
  description: "Tap",
  tags: ["console","display","log","print","show"],
  help: ["Look at data through the pipeline"],
  comment: ["Network tap https://en.wikipedia.org/wiki/Network_tap"],
  func: tap,
  ui: [
    [
      {widget:"label",title: "Data"}, 
      {widget: "output",name:"dataout:any"}
    ],
    [
      {widget: "input",name: "datain:any"},
      {widget:"label",title: "Data"}
    ],
    [
      {widget:"textarea", state: "",name: "log:string"}
    ]
  ]
};
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

import {take} from '../../callbags/callbag-take.js';

const takeFunc = (node) => (stream) => {

  // Get source...
  let source$ = stream.getCallbags(node)[0];
  // Get Params
  const howMany = node.data.state.value;

  const stream$ = take(howMany)(source$);

  // Set stream
  stream.setCallbags(`dataout@${node.id}`,stream$);

  // Return stream
  return stream;
}

export const take_ui =   {
  id: "PROG_TAKE",
  class: "programming",
  description: "Take",
  tags: ["first"],
  func: takeFunc,
  ui: [
    [
      {widget:"label",title: "Data"}, 
      {widget: "output",name:"dataout:any"}
    ],
    [
      {widget:"label",title: "Value"}, 
      {widget: "numerical", state: 5,name: "value:number"}
    ],
    [
      {widget: "input",name: "datain:any"},
      {widget:"label",title: "Data"}
    ]
  ]
};

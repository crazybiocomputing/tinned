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
import {retry} from '../../callbags/callbag-retry.js';
import {repeat} from '../../callbags/callbag-repeat.js';


const repeatFunc = (node) => (stream) => {
  // Get source...
  let source$ = stream.getCallbag(`x@${node.id}`);
  // Params
  let amount = node.data.state?.ntimes || 2;
  console.log('AMOUNT',amount);
  // Repeated source stream
  const stream$ = pipe(source$,repeat(amount));

  stream.setCallbags(`stream@${node.id}`,stream$);
  // Return stream
  return stream;
}

export const repeat_ui =   {
  id: "BASX_REPEAT",
  class: "programming",
  description: "Repeat",
  tags: [],
  help: ["Repeat `n` times"],
  func: repeatFunc,
  ui: [
    [
      {widget:"label",title: "Data"}, 
      {widget: "output",name:"stream:any"}
    ],
    [
      {widget: "label", title: "N"},
      {widget: "numerical", state: 2,name: "ntimes:number"}
    ],
    [
      {widget: "input",name: "x:any"},
      {widget:"label",title: "x"}
    ],
  ]
};


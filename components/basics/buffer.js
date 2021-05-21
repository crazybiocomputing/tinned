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
import {group} from '../../callbags/callbag-group.js';
import { map } from '../../callbags/callbag-map.js';
import { fromIter } from '../../callbags/callbag-from-iter.js';

const bufferFunc = (node) => (stream) => {
  // Get source...
  let source$ = stream.getCallbag(`x@${node.id}`);
  // Params
  let size = node.data.state?.size || 10;
  // Buffer stream
  let buf=[];
  const stream$ = pipe(
    source$,
    group(size),
    // map( group => group.splice(0)) // Copy?
    //flatMap(grp => fromIter(grp),(arr,i) => arr[i])
  );

  stream.setCallbags(`stream@${node.id}`,stream$);

  // Return stream
  return stream;
}

export const buffer_ui =   {
  id: "BASX_BUFFER",
  class: "programming",
  description: "Buffer",
  tags: ["cluster","series","group"],
  func: bufferFunc,
  ui: [
    [
      {widget:"label",title: "Data"}, 
      {widget: "output",name:"stream:any"}
    ],
    [
      {widget: "label", title: "Size"},
      {widget: "numerical", state: 10,name: "size:number"}
    ],
    [
      {widget: "input",name: "x:any"},
      {widget:"label",title: "x"}
    ],
  ]
};


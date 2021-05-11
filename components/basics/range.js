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
import {share} from '../../callbags/callbag-share.js';

const range = (node) => (stream) => {
  // Params
  let start = node.data.state?.start || 0;
  let stop = node.data.state?.stop || 10;
  let step = node.data.state?.step || 1;
  const len = Math.ceil((stop - start) / step);
  let array = Array.from({length: len}, (_,i) => start + i*step);

  // Create multicast observable
  const source$ = share(fromIter(array));

  stream.setCallbags(`stream@${node.id}`,source$);

  // Return stream
  return stream;
}

export const range_ui =   {
  id: "BASX_RANGE",
  class: "producer",
  description: "Range",
  tags: ["array","series","list"],
  func: range,
  ui: [
    [
      {widget:"label",title: "Data"}, 
      {widget: "output",name:"stream:number"}
    ],
    [
      {widget: "label", title: "Start"},
      {widget: "numerical", state: 0,name: "start:number"}
    ],
    [
      {widget: "label", title: "Stop"},
      {widget: "numerical", state: 10,name: "stop:number"}
    ],
    [
      {widget: "label", title: "Step"},
      {widget: "numerical", state: 1,name: "step:number"}
    ]
  ]
};


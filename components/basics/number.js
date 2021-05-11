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

import {of} from '../../callbags/callbag-of.js';

const numberPub = (node) => (stream) => {
  // Get param
  let val = node.data.state.value;
  // Set source$ in stream
  stream.setCallbags(`value@${node.id}`,of(val));
  // Return stream
  return stream;
}

export const number_ui = {
  id: "BASX_NUMBER",
  class: "primitive",
  description: "Number",
  help: "Numeric node",
  tags: ["programming","value","variable","number", "set"],
  func: numberPub,
  ui: [
    [
      {widget: "numerical", state: 0,name: "value:number"},
      {widget: "output", title: "Value",name: "value:number"}
    ]
  ]
};
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

const charsFunc = (node) => (stream) => {
  // Params
  let array = node.data.state?.value || '';
  // Create multicast callbag
  const obs = share(fromIter(array));
  // Update stream
  node.targets.forEach( key => stream[key] = obs);
  // Return stream
  return stream;
}

export const chars_ui =   {
  id: "BASX_CHARS",
  class: "programming",
  description: "Chars",
  help: ["Stream of Characters"],
  tags: ["character","list","string"],
  func: charsFunc,
  ui: [
    [
      {widget: "text", state: '',name: "value:string"},
      {widget: "output", title: "String",name: "value:string"}
    ]
  ]
};

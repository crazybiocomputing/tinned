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

import {array_ui} from './array.js';
import {buffer_ui} from './buffer.js';
import {count_ui} from './count.js';
import {fetch_ui} from './fetch.js';
import {filter_ui} from './filter.js';
import {first_ui} from './first.js';
import {interval_ui} from './interval.js';
import {iterable_ui} from './iterable.js';
import {last_ui} from './last.js';
import {map_ui} from './map.js';
import {math_ui} from './math.js';
import {number_ui} from './number.js';
import {object_ui} from './object.js';
import {monitor_ui} from './monitor.js';
import {random_ui} from './random.js';
import {range_ui} from './range.js';
import {reduce_ui} from './reduce.js';
import {scan_ui} from './scan.js';
import {stats_ui} from './stats.js';
import {string_ui} from './string.js';
import {take_ui} from './take.js';
import {tap_ui} from './tap.js';
import {toiterable_ui} from './toiterable.js';

// Test Actions
const action = (node) => (obs) => {
  console.log(obs,node.id);
  return obs;
}


const _basics = [
  array_ui,
  buffer_ui,
  count_ui,
  fetch_ui,
  filter_ui,
  first_ui,
  interval_ui,
  iterable_ui,
  last_ui,
  map_ui, 
  math_ui, 
  monitor_ui,
  number_ui,
  object_ui,
  random_ui,
  range_ui,
  reduce_ui,
  scan_ui,
  stats_ui,
  string_ui,
  take_ui,
  tap_ui,
  toiterable_ui,
  {
    id: "BASX_EVALUATE",
    class: "programming",
    description: "Evaluate",
    tags: ["console","display","log","print","show","tap"],
    help: ["Look at data through the pipeline"],
    func: action,
    ui: [
      [
        {widget:"label",title: "Result"}, 
        {widget: "output",name:"result:any"}
      ],
      [
        {widget: "input",name: "data:any"},
        {widget:"label",title: "a"}
      ],
      [
        {widget: "input",name: "data:any"},
        {widget:"label",title: "b"}
      ],
      [
        {widget: "input",name: "data:any"},
        {widget:"label",title: "c"}
      ],
      [
        {widget: "input",name: "data:any"},
        {widget:"label",title: "d"}
      ],
      [
        {widget: "input",name: "data:any"},
        {widget:"label",title: "e"}
      ],
      [
        {widget:"textarea", state: "null",name: "code:string"}
      ]
    ]
  },
  {
    id: "BASX_LOGICAL",
    class: "programming",
    description: "Logical",
    help: "Arithmetic operations",
    tags: ["programming","maths","and", "or"],
    func: action,
    ui: [
      [
        {widget: "label", title: "Atoms"},
        {widget: "output", name: "molout:molecule" }
      ],
      [
        {widget: "label", title: "Op."},
        {widget: "select", state: 0, name: "op:string", "items": ["None","AND","OR","XOR"]}
      ],
      [
        {widget: "input", name: "x:any"},
        {widget: "label", title: "X"}
      ],
      [
        {widget: "input", name: "y:any"},
        {widget: "label", title: "Y"}
      ]
    ]
  },


];


export const components = _basics; // .concat(plots);
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
import {flatMap} from '../../callbags/callbag-flat-map.js';

const none = (x,y) => x;
const add = (x,y) => x + y;
const sub = (x,y) => x - y;
const mul = (x,y) => x * y;
const div = (x,y) => x / y;
const operators = {None: none,Add: add,Subtract: sub,Multiply: mul,Divide: div};

const math = (node) => (stream) => {
  // Get source(s)
  const sourceX$ = stream[node.sources[0]];
  const sourceY$ = stream[node.sources[1]];
  // Create a new Observable
  const source$ =  pipe(
    sourceX$,
    flatMap(y => sourceY$,(x,y) => operators[node.data.state?.op || 'None'](x,y) )
  );

  // Create observable
  node.targets.forEach( key => {
    stream[key] = source$;  
  });
  // Return stream
  return stream;
}


export const math_ui = {
  id: "BASX_MATH",
  class: "programming",
  description: "Arithmetic",
  help: "Arithmetic operations",
  tags: ["programming","maths","add", "subtract", "multiply", "divide"],
  func: math,
  ui: [
    [
      {widget: "label", title: "Value"},
      {widget: "output", name: "value:number" }
    ],
    [
      {widget: "label", title: "Op."},
      {widget: "select", state: 0, name: "op:string", "items": ["None","Add","Subtract","Multiply","Divide","AND","OR","XOR"]},
    ],
    [
      {widget: "input", name: "x:any"},
      {widget: "label", title: "X"},
    ],
    [
      {widget: "input", name: "y:any"},
      {widget: "label", title: "Y"},
      // {widget: "numerical", state: 0,name: "y:number"},
    ]
  ]
};
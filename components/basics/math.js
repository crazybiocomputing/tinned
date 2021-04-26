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

const none = (x,y) => x;
const add = (x,y) => x + y;
const sub = (x,y) => x - y;
const mul = (x,y) => x * y;
const div = (x,y) => x / y;
const operators = [none,add,sub,mul,div];

const math = (node) => (stream) => {
  // Get source(s)
  let sourceObservable = stream[node.sources[0]];
  // Create a new Observable
  const obs =  new Observable(observer => {
    const sourceSubscription = sourceObservable.subscribe({
      next: (x) => {
        let next;  
        let y = node.data.state?.yin || node.data.state?.y || 0;     
        try {
          // Get mapFunc from node
          next = operators[+node.data.state?.op || 0](x,y);
        } catch (e) {
          this.error(e);
          this.complete();
        }
        observer.next(next);
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    })
    return () => {
      // --- operator specific TEARDOWN LOGIC
      // when the new Obx is unsubscribed
      // simply unsubscribe from the source Obx
      sourceSubscription.unsubscribe();
    }
  });
  // Create observable
  node.targets.forEach( key => {
    stream[key] = obs;  
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
      {widget: "input", name: "yin:any"},
      {widget: "label", title: "Y"},
      {widget: "numerical", state: 0,name: "y:number"},
    ]
  ]
};
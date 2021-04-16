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
import {_barchart} from './_barchart.js';

/*
 * Barchart 
 * Expecting data as an array of points [{x0,y0},{x1,y1},....,{xn,yn}]
 */
const barchart = (node) => (sourceObservable) => {
  // Update node
  
  // Do it!!
  sourceObservable.subscribe({
    next: (val) => {
      // Convert data into two arrays of x and y
    },
    error: (err) => console.error(err),
    complete: () => console.log('Complete')
  });
};


export const barchart_ui = {
  id: "PLOT_BARCHART",
  class: "io",
  description: "BarChart",
  tags: ["plot","drawing","scheme","histogram"],
  func: barchart,
  ui: [
    [
      {widget: "label", title: "Bins"},
      {widget: "numerical", state: 0,name: "bins:number"}
    ],
    [
      {widget: "label", title: "Min"},
      {widget: "numerical", state: 0,name: "min:number"}
    ],
    [
      {widget: "label", title: "Max"},
      {widget: "numerical", state: 0,name: "max:number"}
    ],
    [
      {widget: "canvas",name:"data:any"}
    ],
    [
      {widget: "input",name: "data:[point]"},
      {widget:"label",title: "Data"}
    ]
  ]
};


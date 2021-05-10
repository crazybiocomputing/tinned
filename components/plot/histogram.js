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


import {_barchart} from './charts/_barchart.js';

/**
 * Simple barchart
 * Jean-Christophe Taveau
 * 2021/02/09
 */
const histogram = (node) => (sourceObservable) => {
  // Get params
  
  // Do it!!
  sourceObservable.subscribe({
    next: (val) => {
      node.data.state.log += val + '\n';
      textarea.innerHTML = node.data.state?.log;
    },
    error: (err) => console.error(err),
    complete: () => console.log('Complete')
  });
};


export const histogram_ui = {
  id: "PLOT_HISTOGRAM",
  class: "io",
  description: "Histogram",
  tags: ["plot","drawing","scheme","histogram"],
  func: histogram,
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
      {widget: "input",name: "data:[number]"},
      {widget:"label",title: "Data"}
    ]
  ]
};


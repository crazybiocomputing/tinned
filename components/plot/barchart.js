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


import {forEach} from '../../callbags/callbag-for-each.js';
import { TINNED } from '../../src/tinned.js';
import { _barchart } from './charts/_barchart.js';

/*
 * Barchart 
 * Expecting data as an array of points [{x0,y0},{x1,y1},....,{xn,yn}]
 */
const barchart = (node) => (stream) => {
  // Get source
  let sourceObservable = stream[node.sources[0]];
  // Calc barchart
  forEach((data) => {
    console.log(node.id,`#node_${node.id} figure`);
    // Convert array of points in two arrays containing x and y separately
    const dataset = data.reduce( (set,point) => {
      set.x.push(point.x);
      set.y.push(point.y);
      return set;
    },{x:[],y:[]});

    // Check if previous diagram
    document.querySelector(`#node_${node.id} figure svg`)?.remove();

    // Draw Barchart
    _barchart( 
      document.querySelector(`#node_${node.id} figure`),
      [dataset],
      {
        mode:["vertical"],
        margin: [10,20,10,20], // N, E, S, W
        width: 450, 
        height: 200,
        font: {
          size: 10
        },
        bar : {
          margin: [0,4,4,0], // N, E, S, W
          color: '#ff0a10'
        }
      }
    );

    // Update Edges
    TINNED.graph.updateEdges(node.element,false);

  })(sourceObservable);



return stream;
  
};


export const barchart_ui = {
  id: "PLOT_BARCHART",
  class: "plot",
  description: "BarChart",
  tags: ["plot","drawing","scheme","histogram"],
  func: barchart,
  ui: [
    [
      {widget: "label", title: "Min"},
      {widget: "numerical", state: 0,name: "min:number"}
    ],
    [
      {widget: "label", title: "Max"},
      {widget: "numerical", state: 0,name: "max:number"}
    ],
    [
      {widget: "canvas",name:"canvas:any"}
    ],
    [
      {widget: "input",name: "datain:[point]"},
      {widget:"label",title: "Data"}
    ]
  ]
};


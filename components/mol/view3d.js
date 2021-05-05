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

/*
 * 3D Viewer 
 * Expecting data as an array of atoms
 */
const view3D = (node) => (stream) => {
  // Get source
  let sourceObservable = stream[node.sources[0]];
  // Calc barchart
  forEach((data) => {
    console.log(node.id,`#node_${node.id} canvas`);
    // Pre-processing
    // Processing

  })(sourceObservable);

return stream;
  
};


export const mol_view3d_ui = {
  id: "MOL_VIEW3D",
  class: "plot",
  description: "View3D",
  tags: ["plot","drawing","scheme","3D"],
  func: view3D,
  ui: [
    [
      {widget: "canvas",name:"canvas:any"}
    ],
    [
      {widget: "input",name: "molin:molecule"},
      {widget:"label",title: "Data"}
    ]
  ]
};


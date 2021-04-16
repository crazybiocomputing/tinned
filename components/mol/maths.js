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

import {Node} from '../src/core/node.js';
import {Observer} from '../src/core/observer.js';

/*
export const number = async (node_id,states) => {
  let obs = new Observer();
  
  // Step #1: Find the input(s) or node variable.s
  let {input,nRows,nCols,border,out} = states[node_id]; // TINNED.graph.getNode(node_id).getState();
  
  console.log(state_names);
  const input = state_names.find( a => a.includes(`raster2d__`) );
  const nRows = state_names.find( a => a.includes('nrows__') ) || 1;
  const nCols = state_names.find( a => a.includes('ncols__') ) || 1;
  const border = state_names.find(a => a.includes('border__')) || 0;
  const out = arg_names.find(a => a.includes('stack__'))
  console.info('RUN TO_STACK',node_id,input, args['raster2d__TO__3'], nRows,nCols,border);
  
  // Step #2: Run if `input` available
  if (input) {
    let stack = _to_stack(args[input],args[nRows],args[nCols],args[border]);
    // Step #3: Update output(s)
    args[out] = stack;
    // Dispatch depending of edges
    return TINNED.graph.dispatch(out,args);
  }
  
  if (preview) {
    stack.preview(document.querySelector(`#node_${node_id} .preview`));
  }
  return args;
}

*/


export default class Math extends Observer {

  /**
   * @constructor
   */
  constructor() {
    super();
    this.state = {
      value: 0
    }
  }
  
  /**
   * Create Node GUI
   */
  createMarkup(node_id,metadata) {

    const template_ui =  {
      "id": "MOL_MATH",
      "class": "programming",
      "description": "Arithmetic",
      "help": "Arithmetic operations",
      "tags": ["programming","maths","add", "subtract", "multiply", "divide"],
      "rows": [
        [
          {"widget": "label", "title": "Value"},
          {"widget": "output", "name": "value:number" }
        ],
        [
          {"widget": "label", "title": "Op."},
          {"widget": "select", "state": 0, "items": ["None","Add","Subtract","Multiply","Divide","AND","OR","XOR","Average","Difference"]},
        ],
        [
          {"widget": "input", "name": "value1:any"},
          {"widget": "label", "title": "Value #1"},
        ],
        [
          {"widget": "input", "name": "value2:any"},
          {"widget": "label", "title": "Value #2"}
        ]
      ]
    }
  
    // Step #1: Create Node GUI from template and metadata (if available)
    this.node = new Node(node_id,template_ui,metadata);
  }

  /**
   * Run component's engine
   */
  async run(state) {
  
  }
  
  update() {
  
  }
  
} // End of `NumberComponent


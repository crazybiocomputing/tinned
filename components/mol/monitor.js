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

export default class Monitor extends Observer {

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
    const template_ui = {
      "id": "MOL_MONITOR",
      "class": "information",
      "description": "Monitor",
      "tags": ["console","display","log","print","show","tap"],
      "help": ["Look at data through the pipeline. Network tap https://en.wikipedia.org/wiki/Network_tap"],
      "rows": [
        [
          {"widget":"label","title": "Data"}, 
          {"widget": "output","name":"out_data:any"}
        ],
        [
          {"widget": "input","name": "in_data:any"},
          {"widget":"label","title": "Data"}

        ],
        [
          {"widget":"text", "state": "null","name": "log:string"}
        ]
      ]
    };
  
    this.node = new Node(node_id,template_ui,metadata);
  }

  /**
   * Run component's engine
   */
  async run(state) {
  // TODO
    // Step #1: Find the input(s) or node variable.s
    let arg_names = TINNED.graph.getNode(node_id).getArguments();
    const input = arg_names.find( a => a.includes(`in_data__`) );
    
    // Step #2: Run if `input` available
    if (input) {
      this._monitor(node_id,args[input]);
    }
    return args;
  }
  
  update() {
  
  }

  // Private
  _monitor(id,an_input) {
    let area = document.querySelector(`#node_${id} textarea`);
    area.innerHTML = an_input.toString() || JSON.stringify(an_input);
    
  }
} // End of Monitor

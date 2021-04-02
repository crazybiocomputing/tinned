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

/*
 * Tiny Web Components: GUI Node + Engine 

import Loader from './loader.js';
import Maths from './maths.js';
import Monitor from './monitor.js';
import NumberComponent from './number.js';


export {
  Loader,
  Maths,
  Monitor,
  NumberComponent
}

 */

const action = (id) => {
  console.log("Run...",id);
}

export const components = [
  {
    id: "MOL_OPEN",
    class: "loader",
    description: "Molecule...",
    ui: [
      [
        {"widget": "label","title": "Mol."}, 
        {"widget":"output","name": "raster:molecule"}
      ],
      [
        {"widget": "label", "title": "Open"},
        {"widget": "file", "title": "File...","name": "open:file"}
      ],
      [
        {"widget": "canvas", "name": "preview:canvas"}
      ]
    ],
    runner : action("MOL_OPEN")
  },
  {
    id: "MOL_NUMBER",
    class: "programming",
    description: "Number",
    help: "Numeric node",
    tags: ["programming","variable","number", "set"],
    ui: [
      [
        {"widget": "numerical", "state": 0,"name": "value:number"},
        {"widget": "output", "title": "Value","name": "value:number"}
      ]
    ],
    runner : action("MOL_NUMBER")
  },
  {
    id: "MOL_MATH",
    class: "programming",
    description: "Arithmetic",
    help: "Arithmetic operations",
    tags: ["programming","maths","add", "subtract", "multiply", "divide"],
    ui: [
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
  },
  {
    id: "MOL_MONITOR",
    class: "information",
    description: "Monitor",
    tags: ["console","display","log","print","show","tap"],
    help: ["Look at data through the pipeline. Network tap https://en.wikipedia.org/wiki/Network_tap"],
    ui: [
      [
        {"widget":"label","title": "Data"}, 
        {"widget": "output","name":"data:any"}
      ],
      [
        {"widget": "input","name": "data:any"},
        {"widget":"label","title": "Data"}

      ],
      [
        {"widget":"text", "state": "null","name": "log:string"}
      ]
    ],
    runner : action("MOL_MONITOR")
  }  
];

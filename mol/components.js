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
    id: "MOL_ID",
    class: "filter",
    description: "ID",
    help: "Select by ID",
    tags: ["select","atom","symbol","chainID"],
    ui: [
      [
        {widget: "label", title: "Atoms"},
        {widget: "output", "name": "molout:mol" }
      ],
      [
        {widget: "label", title: "Serial"},
        {widget: "numerical", "state": 1,"name": "serial:number"}
      ],
      [
        {widget: "label", title: "Name"},
        {widget: "text", "state": '*',"name": "name:string"}
      ],
      [
        {widget: "label", title: "ResName"},
        {widget: "text", "state": '*',"name": "resname:string"}
      ],
      [
        {widget: "label", title: "ResSeq"},
        {widget: "text", "state": '*',"name": "resseq:string"}
      ],
      [
        {widget: "label", title: "ChainID"},
        {widget: "text", "state": 'A',"name": "chainid:string"}
      ],
      [
        {widget: "label", title: "Chemical"},
        {widget: "text", "state": '*',"name": "symbol:string"}
      ],
      [
        {widget: "input", "name": "molin:mol"},
        {widget: "label", title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_COLOR",
    class: "rendering",
    description: "Color Chooser",
    tags: ["rgb","hsl"],
    ui: [
      [
        {widget: "label", title: "Atoms"},
        {widget: "output", "name": "molout:mol" }
      ],
      [
        {widget: "label", title: "Color"},
        {widget: "color", "state": "0xff0000","name": "color:string"},
      ],
      [
        {widget: "input", "name": "molin:mol"},
        {widget: "label", title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_COLORMODE",
    class: "rendering",
    description: "Color Mode",
    tags: ["cpk","lut","rainbow"],
    ui: [
      [
        {widget: "label", title: "Atoms"},
        {widget: "output", "name": "molout:mol" }
      ],
      [
        {widget: "label", title: "Mode"},
        {widget: "select", "state": 0, "name": "mode:string", "items": ["CPK","Chain","Rainbow"]},
      ],
      [
        {widget: "input", "name": "molin:mol"},
        {widget: "label", title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_KABSCH",
    class: "processing",
    description: "Kabsch",
    tags: ["superposition","alignment"]
  },
  {
    id: "MOL_MATH",
    class: "programming",
    description: "Arithmetic",
    help: "Arithmetic operations",
    tags: ["programming","maths","add", "subtract", "multiply", "divide"],
    ui: [
      [
        {widget: "label", title: "Value"},
        {widget: "output", "name": "value:number" }
      ],
      [
        {widget: "label", title: "Op."},
        {widget: "select", "state": 0, "name": "op:string", "items": ["None","Add","Subtract","Multiply","Divide","AND","OR","XOR","Average","Difference"]},
      ],
      [
        {widget: "input", "name": "x:any"},
        {widget: "label", title: "X"},
      ],
      [
        {widget: "input", "name": "yin:any"},
        {widget: "label", title: "Y"},
        {widget: "numerical", "state": 0,"name": "y:number"},
      ]
    ]
  },
  {
    id: "MOL_MONITOR",
    class: "information",
    description: "Monitor",
    tags: ["console","display","log","print","show","tap"],
    help: ["Look at data through the pipeline"],
    comment: ["Network tap https://en.wikipedia.org/wiki/Network_tap"],
    ui: [
      [
        {widget:"label",title: "Data"}, 
        {widget: "output","name":"data:any"}
      ],
      [
        {widget: "input","name": "data:any"},
        {widget:"label",title: "Data"}
      ],
      [
        {widget:"textarea", "state": "null","name": "log:string"}
      ]
    ],
    runner : action("MOL_MONITOR")
  },
  {
    id: "MOL_NUMBER",
    class: "programming",
    description: "Number",
    help: "Numeric node",
    tags: ["programming","value","variable","number", "set"],
    ui: [
      [
        {widget: "numerical", "state": 0,"name": "value:number"},
        {widget: "output", title: "Value","name": "value:number"}
      ]
    ],
    runner : action("MOL_NUMBER")
  },
  {
    id: "MOL_OPEN",
    class: "loader",
    description: "Open...",
    tags: ["file","open","pdb","cif","xyz"],
    ui: [
      [
        {widget: "label",title: "Mol."}, 
        {widget:"output","name": "molout:molecule"}
      ],
      [
        {widget: "label", title: "Open"},
        {widget: "file", title: "File...","name": "open:file"}
      ],
      [
        {
          widget:"collapsible", 
          title: "Summary",
          section: [
            [{widget: "textarea", "state": "null","name": "log:string"}]
          ]
        }
      ]
    ],
    runner : action("MOL_OPEN")
  },
  {
    id: "MOL_PHIPSI",
    class: "processing",
    description: "PhiPsi",
    tags: ["phipsi","dihedral","angle"],
    ui: [
      [
        {widget:"label",title: "Data"}, 
        {widget: "output","name":"data:any"}
      ],
      [
        {widget: "input","name": "data:any"},
        {widget:"label",title: "Data"}
      ]
    ]
  },
  {
    id: "MOL_PROPS",
    class: "selection",
    description: "Props",
    help: "Select by Properties",
    tags: ["select","properties","aliphatic","aromatic","large","small"]
  },
  {
    id: "MOL_RAMACHANDRAN",
    class: "processing",
    description: "Ramachandran",
    tags: ["phipsi","dihedral","angle"],
    ui: [
      [
        {widget:"label",title: "Data"}, 
        {widget: "output","name":"data:any"}
      ],
      [
        {widget: "input","name": "data:any"},
        {widget:"label",title: "Data"}
      ]
    ]
  },
  {
    id: "MOL_RANGE",
    class: "programming",
    description: "Range",
    tags: ["array","series","list"],
    ui: [
      [
        {widget:"label",title: "Data"}, 
        {widget: "output","name":"stream:stream"}
      ],
      [
        {widget: "label", title: "Start"},
        {widget: "numerical", "state": 0,"name": "start:number"}
      ],
      [
        {widget: "label", title: "Stop"},
        {widget: "numerical", "state": 10,"name": "stop:number"}
      ],
      [
        {widget: "label", title: "Step"},
        {widget: "numerical", "state": 1,"name": "step:number"}
      ]
    ]
  },
  {
    id: "MOL_RENDER",
    class: "rendering",
    description: "Render",
    tags: ["wireframe","backbone","trace","cartoon","strands","ball-and-stick"],
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output","name":"molout:molecule"}
      ],
      [
        {widget: "label", title: "Mode"},
        {widget: "select", "state": 0, "name": "mode:string", "items": ["Trace","Backbone","Wireframe","Strands","Ball-and-Stick","Cartoon"]},
      ],
      [
        {widget: "input","name": "molin:molecule"},
        {widget:"label",title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_WITHIN",
    class: "selection",
    description: "Within",
    help: "Select by Distance",
    tags: ["select","within","distance","radius","center"]
  }
];

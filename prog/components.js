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


// Test Actions
const action = (...params) => (msg) => {
  console.log(msg,params[0]);
}
/*
const produce = (params) => {
  console.log("Run...",params);
  return {data: [1,2,3,4,5], params};
}

// Could be transducer
const operation = (params) => (input) => {
  input.params = [...input.params,...params];
  return input;
}

const sink = (params) => (input) => {
  console.log(JSON.stringify(input));
}

*/

export const components = [
  {
    id: "PROG_COUNTBY",
    class: "programming",
    description: "CountBy",
    tags: ["sort"],
    func: action,
    ui: [
      [
        {widget: "label", title: "Counts"},
        {widget: "output", name: "counts:[number]" }
      ],
      [
        {widget: "input", name: "molin:molecule"},
        {widget: "label", title: "Atoms"}
      ]
    ]
  },
  {
    id: "PROG_EVALUATE",
    class: "programming",
    description: "Evaluate",
    tags: ["console","display","log","print","show","tap"],
    help: ["Look at data through the pipeline"],
    func: action,
    ui: [
      [
        {widget:"label",title: "Result"}, 
        {widget: "output",name:"result:any"}
      ],
      [
        {widget: "input",name: "data:any"},
        {widget:"label",title: "a"}
      ],
      [
        {widget: "input",name: "data:any"},
        {widget:"label",title: "b"}
      ],
      [
        {widget: "input",name: "data:any"},
        {widget:"label",title: "c"}
      ],
      [
        {widget: "input",name: "data:any"},
        {widget:"label",title: "d"}
      ],
      [
        {widget: "input",name: "data:any"},
        {widget:"label",title: "e"}
      ],
      [
        {widget:"textarea", state: "null",name: "code:string"}
      ]
    ]
  },
  {
    id: "PROG_HISTOGRAM",
    class: "io",
    description: "Histogram",
    tags: ["plot","drawing","scheme"],
    func: action,
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
    ],
    operation: action('MOL_HISTOGRAM')
  },
  {
    id: "PROG_LOGICAL",
    class: "programming",
    description: "Logical",
    help: "Arithmetic operations",
    tags: ["programming","maths","and", "or"],
    func: action,
    ui: [
      [
        {widget: "label", title: "Atoms"},
        {widget: "output", name: "molout:molecule" }
      ],
      [
        {widget: "label", title: "Op."},
        {widget: "select", state: 0, name: "op:string", "items": ["None","AND","OR","XOR"]}
      ],
      [
        {widget: "input", name: "x:any"},
        {widget: "label", title: "X"}
      ],
      [
        {widget: "input", name: "y:any"},
        {widget: "label", title: "Y"}
      ]
    ]
  },
  {
    id: "PROG_MATH",
    class: "programming",
    description: "Arithmetic",
    help: "Arithmetic operations",
    tags: ["programming","maths","add", "subtract", "multiply", "divide"],
    func: action,
    ui: [
      [
        {widget: "label", title: "Value"},
        {widget: "output", name: "value:number" }
      ],
      [
        {widget: "label", title: "Op."},
        {widget: "select", state: 0, name: "op:string", "items": ["None","Add","Subtract","Multiply","Divide","AND","OR","XOR","Average","Difference"]},
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
  },
  {
    id: "PROG_MONITOR",
    class: "information",
    description: "Monitor",
    tags: ["console","display","log","print","show","tap"],
    help: ["Look at data through the pipeline"],
    comment: ["Network tap https://en.wikipedia.org/wiki/Network_tap"],
    func: action,
    ui: [
      [
        {widget:"label",title: "Data"}, 
        {widget: "output",name:"data:any"}
      ],
      [
        {widget: "input",name: "data:any"},
        {widget:"label",title: "Data"}
      ],
      [
        {widget:"textarea", state: "null",name: "log:string"}
      ]
    ]
  },
  {
    id: "PROG_NUMBER",
    class: "programming",
    description: "Number",
    help: "Numeric node",
    tags: ["programming","value","variable","number", "set"],
    func: action,
    ui: [
      [
        {widget: "numerical", state: 0,name: "value:number"},
        {widget: "output", title: "Value",name: "value:number"}
      ]
    ]
  },
  {
    id: "PROG_RANGE",
    class: "programming",
    description: "Range",
    tags: ["array","series","list"],
    func: action,
    ui: [
      [
        {widget:"label",title: "Data"}, 
        {widget: "output",name:"stream:stream"}
      ],
      [
        {widget: "label", title: "Start"},
        {widget: "numerical", state: 0,name: "start:number"}
      ],
      [
        {widget: "label", title: "Stop"},
        {widget: "numerical", state: 10,name: "stop:number"}
      ],
      [
        {widget: "label", title: "Step"},
        {widget: "numerical", state: 1,name: "step:number"}
      ]
    ]
  },
  {
    id: "PROG_STRING",
    class: "programming",
    description: "String",
    help: "String of Characters",
    tags: ["programming","value","variable","string", "set"],
    func: action,
    ui: [
      [
        {widget: "text", state: '',name: "value:string"},
        {widget: "output", title: "Value",name: "value:string"}
      ]
    ]
  }
];

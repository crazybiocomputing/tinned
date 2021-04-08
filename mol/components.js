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


const action = (id) => {
  console.log("Run...",id);
}

export const components = [
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
        {
          widget: "select", 
          state: 0, 
          name: "mode:string", 
          items: ['Alt', 'Amino', 'Chain', 'Charge', 'CPK', 'Model', 'Rainbow','Shapely', 'Structure', 'Temperature']
        },
      ],
      [
        {widget: "input", "name": "molin:mol"},
        {widget: "label", title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_ID",
    class: "selection",
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
        {widget: "numerical", "state": 0,"name": "serial:number"}
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
        {widget: "text", "state": 0,"name": "resseq:string"}
      ],
      [
        {widget: "label", title: "ChainID"},
        {widget: "text", "state": '*',"name": "chainid:string"}
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
    id: "MOL_KABSCH",
    class: "processing",
    description: "Kabsch",
    tags: ["superposition","alignment"],
    ui: [
      [
        {widget:"label",title: "Superposed"}, 
        {widget: "output","name":"molout:molecule"}
      ],
      [
        {widget: "input","name": "molin1:molecule"},
        {widget:"label",title: "Atoms"}
      ],
      [
        {widget: "input","name": "molin2:molecule"},
        {widget:"label",title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_LOGICAL",
    class: "programming",
    description: "Logical",
    help: "Arithmetic operations",
    tags: ["programming","maths","and", "or"],
    ui: [
      [
        {widget: "label", title: "Atoms"},
        {widget: "output", "name": "molout:molecule" }
      ],
      [
        {widget: "label", title: "Op."},
        {widget: "select", "state": 0, "name": "op:string", "items": ["None","AND","OR","XOR"]}
      ],
      [
        {widget: "input", "name": "x:any"},
        {widget: "label", title: "X"}
      ],
      [
        {widget: "input", "name": "y:any"},
        {widget: "label", title: "Y"}
      ]
    ]
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
    id: "MOL_NUCLEIC",
    class: "selection",
    description: "Nucleic",
    help: "Select by nucleotide",
    tags: ["select","protein","nucleic","ligand","ion","solvent","water","hoh","h2o"],
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output","name":"molout:molecule"}
      ],
      [
        {widget: "label", title: "Type"},
        {
          widget: "select", 
          state: 0, 
          name: "type:string", 
          items: ["Nucleic","AT","CG","Purine","Pyrimidine"]
        }
      ],
      [
        {widget: "input","name": "molin:molecule"},
        {widget:"label",title: "Atoms"}
      ]
    ]
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
    class: "io",
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
    description: "Properties",
    help: "Select by Properties",
    tags: ["select","properties","aliphatic","aromatic","large","small"],
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output","name":"molout:molecule"}
      ],
      [
        {widget: "label", title: "Prop."},
        {
          widget: "select", 
          state: 0, 
          name: "prop:string", 
          items: ["Acidic", "Acyclic", "Aliphatic", "Aromatic", "Basic", "Buried", "Charged", "Cyclic", 
          "Hydrophobic", "Large", "Medium", "Negative", "Neutral", "Polar", "Positive", "Small", "Surface"
          ]
        }
      ],
      [
        {widget: "input","name": "molin:molecule"},
        {widget:"label",title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_RAMACHANDRAN",
    class: "processing",
    description: "Ramachandran",
    tags: ["phipsi","dihedral","angle"],
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output","name":"molout:molecule"}
      ],
      [
        {widget: "canvas","name":"data:any"}
      ],
      [
        {widget: "input","name": "molin:molecule"},
        {widget:"label",title: "Atoms"}
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
    id: "MOL_RMSD",
    class: "processing",
    description: "RMSD",
    tags: ["wireframe","backbone","trace","cartoon","strands","ball-and-stick"],
    ui: [
      [
        {widget:"label",title: "Score"}, 
        {widget: "output","name":"score:number"}
      ],
      [
        {widget: "input","name": "molin1:molecule"},
        {widget:"label",title: "Atoms"}
      ],
      [
        {widget: "input","name": "molin2:molecule"},
        {widget:"label",title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_SECONDARY",
    class: "processing",
    description: "Secondary",
    help: "Compute Secondary Structures",
    tags: ["secondary","dssp","protein"],
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output","name":"molout:molecule"}
      ],
      [
        {widget: "input","name": "molin:molecule"},
        {widget:"label",title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_SELECTED",
    class: "selection",
    description: "Selected",
    help: "selection (un) selected atoms",
    tags: ["select","unselect"],
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output","name":"molout:molecule"}
      ],
      [
        {widget: "label", title: "Selected"},
        {widget: "checkbox", "state": 0, "name": "selected:boolean"},
      ],
      [
        {widget: "input","name": "molin:molecule"},
        {widget:"label",title: "Atoms"}
      ]
    ]    
  },
  {
    id: "MOL_STRUCT",
    class: "selection",
    description: "Structure",
    help: "Select by Structure",
    tags: ["select","properties"],
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output","name":"molout:molecule"}
      ],
      [
        {widget: "label", title: "Prop."},
        {
          widget: "select", 
          state: 0, 
          name: "prop:string", 
          items: ["Alpha","Helix","Sheet","Turn","Backbone","Bonded","Cystine","Sidechain"]
        }
      ],
      [
        {widget: "input","name": "molin:molecule"},
        {widget:"label",title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_TYPES",
    class: "selection",
    description: "Types",
    help: "Select by Types: protein, nucleic, and solvent",
    tags: ["select","protein","nucleic","ligand","ion","solvent","water","hoh","h2o"],
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output","name":"molout:molecule"}
      ],
      [
        {widget: "label", title: "Type"},
        {
          widget: "select", 
          state: 0, 
          name: "type:string", 
          items: ["Amino","Hetero","Ions","Ligand","Nucleic","Protein","Solvent","Water","Hydrogen"]
        }
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
    tags: ["select","within","distance","radius","center"],
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output","name":"data:any"}
      ],
      [
        {widget: "label", title: "Radius"},
        {widget: "numerical", "state": 0,"name": "radius:number"}
      ],
      [
        {widget: "input","name": "data:any"},
        {widget:"label",title: "Center"}
      ],
      [
        {widget: "input","name": "data:any"},
        {widget:"label",title: "Atoms"}
      ]
    ]
  }
];

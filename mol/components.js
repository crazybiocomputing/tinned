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

import {components as basics} from '../prog/components.js';

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

export const components = basics.concat([

  {
    id: "MOL_COLOR",
    class: "rendering",
    description: "Color Chooser",
    tags: ["rgb","hsl"],
    func: action,
    ui: [
      [
        {widget: "label", title: "Atoms"},
        {widget: "output", name: "molout:mol" }
      ],
      [
        {widget: "label", title: "Color"},
        {widget: "color", state: "0xff0000",name: "color:string"},
      ],
      [
        {widget: "input", name: "molin:mol"},
        {widget: "label", title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_COLORMODE",
    class: "rendering",
    description: "Color Mode",
    tags: ["cpk","lut","rainbow"],
    func: action,
    ui: [
      [
        {widget: "label", title: "Atoms"},
        {widget: "output", name: "molout:mol" }
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
        {widget: "input", name: "molin:mol"},
        {widget: "label", title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_FASTA",
    class: "processing",
    description: "FASTA",
    tags: ["sequence","protein","nucleic"],
    func: action,
    ui: [
      [
        {widget: "label", title: "Sequence"},
        {widget: "output", name: "fasta:string" }
      ],
      [
        {widget: "input", name: "molin:mol"},
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
    func: action,
    ui: [
      [
        {widget: "label", title: "Atoms"},
        {widget: "output", name: "molout:mol" }
      ],
      [
        {widget: "label", title: "Serial"},
        {widget: "numerical", state: 0,name: "serial:number"}
      ],
      [
        {widget: "label", title: "Name"},
        {widget: "text", state: '*',name: "name:string"}
      ],
      [
        {widget: "label", title: "ResName"},
        {widget: "text", state: '*',name: "resname:string"}
      ],
      [
        {widget: "label", title: "ResSeq"},
        {widget: "numerical", state: 0,name: "resseq:string"}
      ],
      [
        {widget: "label", title: "ChainID"},
        {widget: "text", state: '*',name: "chainid:string"}
      ],
      [
        {widget: "label", title: "Chemical"},
        {widget: "text", state: '*',name: "symbol:string"}
      ],
      [
        {widget: "input", name: "molin:mol"},
        {widget: "label", title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_KABSCH",
    class: "processing",
    description: "Kabsch",
    tags: ["superposition","alignment"],
    func: action,
    ui: [
      [
        {widget:"label",title: "Superposed"}, 
        {widget: "output",name:"molout:molecule"}
      ],
      [
        {widget: "input",name: "molin1:molecule"},
        {widget:"label",title: "Atoms"}
      ],
      [
        {widget: "input",name: "molin2:molecule"},
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
    id: "MOL_NUCLEIC",
    class: "selection",
    description: "Nucleic",
    help: "Select by nucleotide",
    tags: ["select","protein","nucleic","ligand","ion","solvent","water","hoh","h2o"],
    func: action,
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output",name:"molout:molecule"}
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
        {widget: "input",name: "molin:molecule"},
        {widget:"label",title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_OPEN",
    class: "io",
    description: "Open...",
    tags: ["file","open","pdb","cif","xyz"],
    func: action,
    ui: [
      [
        {widget: "label",title: "Mol."}, 
        {widget:"output",name: "molout:molecule"}
      ],
      [
        {widget: "label", title: "Open"},
        {widget: "file", title: "File...",name: "open:file"}
      ],
      [
        {
          widget:"collapsible", 
          title: "Summary",
          section: [
            [{widget: "textarea", state: "null",name: "log:string"}]
          ]
        }
      ]
    ]
  },
  {
    id: "MOL_PHIPSI",
    class: "processing",
    description: "PhiPsi",
    tags: ["phipsi","dihedral","angle"],
    func: action,
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output",name:"molout:molecule"}
      ],
      [
        {widget: "input",name: "molin:molecule"},
        {widget:"label",title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_PROPS",
    class: "selection",
    description: "Properties",
    help: "Select by Properties",
    tags: ["select","properties","aliphatic","aromatic","large","small"],
    func: action,
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output",name:"molout:molecule"}
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
        {widget: "input",name: "molin:molecule"},
        {widget:"label",title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_RAMACHANDRAN",
    class: "processing",
    description: "Ramachandran",
    tags: ["phipsi","dihedral","angle"],
    func: action,
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output",name:"molout:molecule"}
      ],
      [
        {widget: "canvas",name:"data:any"}
      ],
      [
        {widget: "input",name: "molin:molecule"},
        {widget:"label",title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_RENDER",
    class: "rendering",
    description: "Render",
    tags: ["wireframe","backbone","trace","cartoon","strands","ball-and-stick"],
    func: action,
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output",name:"molout:molecule"}
      ],
      [
        {widget: "label", title: "Mode"},
        {widget: "select", state: 0, name: "mode:string", "items": ["Trace","Backbone","Wireframe","Strands","Ball-and-Stick","Cartoon"]},
      ],
      [
        {widget: "input",name: "molin:molecule"},
        {widget:"label",title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_RMSD",
    class: "processing",
    description: "RMSD",
    tags: ["wireframe","backbone","trace","cartoon","strands","ball-and-stick"],
    func: action,
    ui: [
      [
        {widget:"label",title: "Score"}, 
        {widget: "output",name:"score:number"}
      ],
      [
        {widget: "input",name: "molin1:molecule"},
        {widget:"label",title: "Atoms"}
      ],
      [
        {widget: "input",name: "molin2:molecule"},
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
    func: action,
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output",name:"molout:molecule"}
      ],
      [
        {widget: "input",name: "molin:molecule"},
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
    func: action,
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output",name:"molout:molecule"}
      ],
      [
        {widget: "label", title: "Selected"},
        {widget: "checkbox", state: false, name: "selected:boolean"},
      ],
      [
        {widget: "input",name: "molin:molecule"},
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
    func: action,
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output",name:"molout:molecule"}
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
        {widget: "input",name: "molin:molecule"},
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
    func: action,
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output",name:"molout:molecule"}
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
        {widget: "input",name: "molin:molecule"},
        {widget:"label",title: "Atoms"}
      ]
    ]
  },
  {
    id: "MOL_UNION",
    class: "processing",
    description: "Union",
    help: "Merge multi-FASTA in one single FASTA sequence",
    tags: ["union","merge","fuse","fasta"],
    func: action,
    ui: [
      [
        {widget:"label",title: "FASTA"}, 
        {widget: "output",name:"fastaout:string"}
      ],
      [
        {widget: "label", title: "Header"},
        {widget: "checkbox", state: 0, name: "header:boolean"},
      ],
      [
        {widget: "input",name: "fastain:string"},
        {widget:"label",title: "multi-FASTA"}
      ],

    ]
  },  {
    id: "MOL_VIEW3D",
    class: "io",
    description: "3D View",
    help: "View",
    tags: ["view","3D","webGL"],
    func: action,
    ui: [
      [
        {widget: "label", title: "Backdrop"},
        {widget: "checkbox", state: 0, name: "backdrop:boolean"},
      ],
      [
        {widget: "input",name: "mol1:molecule"},
        {widget:"label",title: "Atoms"}
      ],
      [
        {widget: "input",name: "mol2:molecule"},
        {widget:"label",title: "Atoms"}
      ],
      [
        {widget: "input",name: "mol2:molecule"},
        {widget:"label",title: "Atoms"}
      ],
      [
        {widget: "input",name: "mol4:molecule"},
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
    func: action,
    ui: [
      [
        {widget:"label",title: "Atoms"}, 
        {widget: "output",name:"data:any"}
      ],
      [
        {widget: "label", title: "Radius"},
        {widget: "numerical", state: 0,name: "radius:number"}
      ],
      [
        {widget: "input",name: "data:any"},
        {widget:"label",title: "Center"}
      ],
      [
        {widget: "input",name: "data:any"},
        {widget:"label",title: "Atoms"}
      ]
    ]
  }
]);

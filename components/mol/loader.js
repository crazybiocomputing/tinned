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
 * Load a structure (pdb, cif, xyz)
 * @author Jean-Christophe Taveau
 */
export default class Loader extends Observer {
  
  constructor() {
    super();
    this.state = {};
  }
  
  /**
   * Create Node GUI
   */
  createMarkup(node_id,metadata) {
    const template_ui = {
      "id": "TINNED_OPEN_MOL",
      "class": "loader",
      "description": "Image...",
      "rows": [
        [
          {"widget": "label","title": "Raster"}, 
          {"widget":"output","name": "raster:raster"}
        ],
        [
          {"widget": "label", "title": "Open"},
          {"widget": "file", "title": "File...","name": "open:file"}
        ],
        [
          {"widget": "canvas", "name": "preview:canvas"}
        ]
      ]
    };
  
    // Step #1: Create Node GUI from template and metadata (if available)
    this.node = new Node(node_id,template_ui,metadata);
    
    // Step #2: Add Specific Events...
  }
  
  
  async run(state) {
    // Step #1: Find the input(s) or node variable.s
    let arg_names = TINNED.graph.getNode(node_id).getArguments();
    // `load` is a Producer ... no input
    let filename = arg_names.find( a => a.includes('__AT__') );
    let out = `raster__FROM__${node_id}`;
    
    // Step #2: Run
    let raster = await load(args[filename]);

    // Step #3: Update output(s)
    raster.preview(document.querySelector(`#node_${node_id} .preview`) || document.body);
    // console.log(raster.width,raster.height);
    args[out] = raster; // new TWImage(raster,0,0,canvas.width,canvas.height);
    // Dispatch to other nodes according to edges
    return TINNED.graph.dispatch(out,args);
  }

  update() {
    // TODO
  }
  
  
  load(file) {
    console.log('LOAD');
    let path = file.name;
    let extension = path.split('.').pop();
    let mol;
    console.log(extension);
    switch (extension) {
    case 'pdb':
    case 'PDB': /* Comma-Separated Values */
    case 'cif':
    case 'CIF': /* Tab-Separated Values */
    case 'xyz':
    case 'XYZ': /* Portable Bitmap */
      console.log('Parse Portable Any Map');
      canvas = loadASCIIRaster(file); break;
    default: // pdb
      // TODO
    }
    return mol;
  }
} // End of class Loader


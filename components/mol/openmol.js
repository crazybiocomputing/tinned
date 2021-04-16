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


function readFileAsync(f) {
  return new Promise((resolve, reject) => {
    // Read File
    let reader = new FileReader();

    reader.onload = (e) => {
      let text = reader.result;
      // Run the parser...
      let extension = f.name.split('.').pop();
      let model;
      if (extension === 'pdb') {
        model = parsePDB(text);
      }
      else if (extension === 'cif') {
        model = parseCIF(text);
      }
      resolve(model);
    }

    reader.onerror = reject;
    reader.readAsText(f);

  });
}


/*
 * Load a structure (pdb, cif, xyz)
 * @author Jean-Christophe Taveau
 */
export async function openmol(nod) {
  console.log('openmol',nod);
  try {
    let file = nod.data.state._file;
    return await readFileAsync(file);
  } catch(err) {
    console.log(err);
  }
}

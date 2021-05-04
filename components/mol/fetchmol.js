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


import { fromIter } from '../../callbags/callbag-from-iter.js';
import { fromPromise } from '../../callbags/callbag-from-promise.js';
import { switchMap } from '../../callbags/callbag-switch-map.js';
import { pipe } from '../../callbags/callbag-pipe.js';
import {parsePDB} from './io/parsePDB.js';

const fetchmol = (node) => (stream) => {

  // Params
  const PATH = 'https://files.rcsb.org/view/';
  let pdbid = node.data.state?.pdbid;
  let url = `${PATH}${pdbid.toUpperCase()}.pdb`;

  const source = fromPromise(
    fetch(url)
    .then( response => {
      if (response.ok) {
        console.log('Download Done...');
        return response.text();
      }
      else {
        console.log('Wait..');
      }
    })
    .then(txt => {
      const atoms = parsePDB(txt);
      return Promise.resolve(atoms);
    })
    .catch( err => console.error(err) )
  );

  const obs = pipe(
    source,
    switchMap(atoms => fromIter(Array.from({length: atoms.length}, (_,i) => i)), (atoms,num) => atoms[num])
  );

  // Set observable in stream
  node.targets.forEach( key => stream[key] = obs);

  // Return stream
  return stream;
}

export const fetchmol_ui =   {
  id: "MOL_FETCH",
  class: "producer",
  description: "Fetch PDB",
  tags: ["fetch","download","open","read"],
  func: fetchmol,
  ui: [
    [
      {widget:"label",title: "Atoms"}, 
      {widget: "output",name:"molout:molecule"}
    ],
    [
      {widget: "label", title: "PDB ID"},
      {widget: "text", state: '',name: "pdbid:number"}
    ]
  ]
};


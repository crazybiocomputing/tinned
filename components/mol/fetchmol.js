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
import { map } from '../../callbags/callbag-map.js';
import { pipe } from '../../callbags/callbag-pipe.js';
import {parsePDB} from './io/parsePDB.js';

const parse = (txt)  => {
  console.log(txt);
  const mol = parsePDB(txt);
  return (start, sink) => {
    if (start !== 0) return;

    let copy = mol.slice();
    let disposed = false;

    sink(0, type => {
      if (type !== 2) return;
      disposed = true;
      copy.length = 0;
    })

    while (copy.length !== 0) {
      sink(1, copy.shift());
    }

    if (disposed) return;

    sink(2);
  }
} 
const fetchmol = (node) => (stream) => {

  const done = () => console.log('Done');

  const fetchPDB = fromPromise(
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
      const atoms = txt.split('\n').filter(row => row.slice(0,6).trim() === 'ATOM' ||  row.slice(0,6).trim() === 'HETATM');
      length = 20;
      return atoms.slice(1,20);
    })
    .catch( err => console.error(err) )
  );
  
  pipe(
    fetchPDB,
    switchMap(atoms => fromIter(Array.from({length: atoms.length}, (_,i) => i)), (atoms,num) => ({num,a:atoms[num]}) ),
    forEach(x => console.log(x))
  );

  


  const fetchPDB = (_url) => {
    // Init
    let atoms = [];
    // Fetch data
    fetch(_url)
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
      return Promise.resolve(parsePDB(txt));
    })
    .then(data => {
      atoms = data.slice(0,20);
      console.log(atoms);
      return atoms;
    })
    .catch( err => console.error(err)) // TODO

    return (start,sink) => {
      if (start !== 0) {
        return;
      }
      let count = 0;
      let completed = false;
      sink(0,t => {
        console.log('count',count);
        if (completed) return;    
        if (t === 1) {
          // Loop        
          if (count === atoms.length) {
            sink(2);
            completed = true;
          }
          else {
            // Next
            console.log('next');
            sink(1, atoms[count++]);
          }  
          sink(2);
        } else if (t === 2) {
          completed = true;
          sink(2);
        }
      });
    };
  };
        
  // Params
  const PATH = 'https://files.rcsb.org/view/';
  let pdbid = node.data.state?.pdbid;
  let url = `${PATH}${pdbid.toUpperCase()}.pdb`;
  // Set observable in stream
  node.targets.forEach( key => stream[key] = fetchPDB(url));
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


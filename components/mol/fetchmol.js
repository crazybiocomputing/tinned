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

import {Observable} from '../../src/functional/observable.js';

// Simplified parser
const parsePDB = (txt) => {
  function parseHeader(row) {
    // Parsing Data from wwwPDB
    const tokens = [
      {start:11,end:50,field: 'classification', type: 'string'},
      {start:51,end:59,field: 'depDate', type: 'date'},
      {start:63,end:66,field: 'idCode', type: 'IDcode'}
    ];
    // Main Loop
    let outputs = {};
    for (let i = 0; i < tokens.length; i++) {
      let value = row.slice(tokens[i].start - 1, tokens[i].end).trim();
      if (tokens[i].type === 'number') {
        value = parseFloat(value);
      }
      outputs[tokens[i].field] = value;
    }
    return outputs;
  }
  
  function parseAtom(row) {
    // Parsing data from wwwPDB
    let type = row.slice(0,6).trim();
    let serial = parseInt(row.slice(7-1,11).trim() );
    let name = row.slice(13-1,16).trim(); 
    let resName = row.slice(18-1 , 20).trim();
    let chainID = row.slice(22-1 , 23).trim();
    let resSeq = parseInt(row.slice(23-1 , 26).trim() );
    let iCode = row.slice(27-1, 28).trim();
    let x = parseFloat(row.slice(31-1, 38).trim() );
    let y = parseFloat(row.slice(39-1,46).trim() );
    let z = parseFloat(row.slice(47-1,54).trim() );
    let occupancy = row.slice(55-1 ,60).trim();
    let tempFactor= row.slice(61-1 ,66).trim();
    let element = row.slice(77-1 ,78).trim();
    let charge= row.slice(79-1 , 80).trim();
    let color = [255,128,50]; // TODO toGLcolor(COLORS.cpk[element]);
    
    let title = chainID + '.'+ resName + '[' + resSeq + '].' + name + '[' + serial + '].' + element;
    return {type,serial,title,name,resName,chainID,resSeq,x,y,z,element, color};
  }

  // MAIN
  const rows = txt.split('\n');
  let atoms = [
    {
      type: 'META',
      serial:0,
      name: 'Head', 
      resName: '_',
      chainID: '_',
      resSeq: 0,
      iCode: '_',
      x: 0,
      y: 0,
      z: 0,
      occupancy: 0,
      tempFactor: 0,
      element: '_',
      charge: 0,
      content: []
    }
  ];
  rows.forEach( row => {
    let type = row.slice(0,6).trim();
    if (type === 'ATOM' || type === 'HETATM') {
      atoms.push(parseAtom(row));
    }
    else if (type === 'HEADER') {
      atoms[0].content.push(parseHeader(row));
    }
  });
  return atoms;
}

const fetchmol = (node) => (stream) => {
  // Params
  const PATH = 'https://files.rcsb.org/view/';
  let pdbid = node.data.state?.pdbid;
  let url = `${PATH}${pdbid.toUpperCase()}.pdb`;

  const obs = new Observable(observer => {
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
    .then( txt => {
      let mol = parsePDB(txt);
      for (let atom of mol) {
        observer.next(atom);
      }
      observer.complete();
    })
    .catch( err => observer.error(err));
    return () => {
      // Do nothing for unsubscribe
    }
  });

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


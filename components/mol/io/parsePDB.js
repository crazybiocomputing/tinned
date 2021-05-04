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

// Parse HEADER
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

// Parse ATOM, HETATM
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

/**
 *  Simplified PDB parser
 * @param txt - PDB file in text format
 * @author Jean-Christophe Taveau
 */ 
export const parsePDB = (txt) => {

  // Init Array of atoms
  // atoms[0] is a 'fake' atom containing the header of PDB file
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
      content: {}
    }
  ];

  // MAIN
  txt.split('\n').forEach( row => {
    let type = row.slice(0,6).trim();
    if (type === 'ATOM' || type === 'HETATM') {
      atoms.push(parseAtom(row));
    }
    else if (type === 'HEADER') {
      atoms[0].content['head'] = parseHeader(row);
    }
  });
  return atoms;
};
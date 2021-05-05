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

import {groupBy} from '../../callbags/callbag-group-by.js';
import {last} from '../../callbags/callbag-last.js';
import {map} from '../../callbags/callbag-map.js';
import {filter} from '../../callbags/callbag-filter.js';
import {pipe} from '../../callbags/callbag-pipe.js';
import {tap} from '../../callbags/callbag-tap.js';



const aas = [
  ['alanine','ala','A'],
  ['arginine','arg','R'],
  ['asparagine','asn','N'],
  ['aspartic acid','asp','D'],
  ['asparagine or aspartic acid','asx','B'],
  ['cysteine','cys','C'],
  ['glutamic acid','glu','E'],
  ['glutamine','gln','Q'],
  ['glutamine or glutamic acid','glx','Z'],
  ['glycine','gly','G'],
  ['histidine','his','H'],
  ['isoleucine','ile','I'],
  ['leucine','leu','L'],
  ['lysine','lys','K'],
  ['methionine','met','M'],
  ['phenylalanine','phe','F'],
  ['proline','pro','P'],
  ['serine','ser','S'],
  ['threonine','thr','T'],
  ['tryptophan','trp','W'],
  ['tyrosine','tyr','Y'],
  ['valine','val','V']
];


// Global
let IDCODE='0xxx';

// Extract sequence from ATOMs
const getSequence = (atoms,flag) => {
  // Converting from alphabet.s
  const threeToOne = (three,flag) => {
    if (flag) {
      let index = aas.findIndex( (aa) => aa[1].toUpperCase() === three);
      return aas[index][2];
    }
    return three[0].toUpperCase() + three.slice(1).toLowerCase();
  }

  // Header
  if (atoms[0].serial === 0) {
    IDCODE = atoms[0].content.head?.idCode || '0xxx'; 
  }
  else {
    // Main
    const fasta = atoms.reduce((accu,atom) => {
      if (atom.type === 'ATOM' && accu.prev !== atom.resSeq ) {
        accu.sq += threeToOne(atom.resName,flag);
        accu.prev = atom.resSeq;
      }
      return accu;
    },
    {sq: `> ${IDCODE}.${atoms[0].chainID}\n` , prev: ''}
    );
    return fasta.sq;
  }
  return '';
}

const sequFasta = (node) => (stream) => {
  // Get Params
  let isFASTA = node.data.state?.fasta || false;
  // Get source.s
  let source = stream[node.sources[0]];

  // Create Observable
  const obs = pipe(
    source,
    groupBy( (atom) => atom.chainID),
    map( (seq) => getSequence(seq,isFASTA)),
    filter( (seq) => seq.length > 1)
  );

  // Store observable in stream BUG!!!
  node.targets.forEach( key => stream[key] = obs);
  // Unmodified source
  // stream[node.targets[1]] = sourceObservable; // HACK
  // Return stream
  return stream;
}

export const sequence_ui =   {
  id: "MOL_SEQUENCE",
  class: "processing",
  description: "FASTA",
  tags: ["sequence","protein","nucleic"],
  func: sequFasta,
  ui: [
    [
      {widget: "label", title: "Sequence"},
      {widget: "output", name: "sequence:string" }
    ],
    [
      {widget: "label", title: "FASTA&nbsp;Format"},
      {widget: "checkbox", state: true, name: "fasta:boolean"},
    ],
    [
      {widget: "input", name: "molin:molecule"},
      {widget: "label", title: "Atoms"}
    ]
  ]
};


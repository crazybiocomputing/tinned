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

import {pipe} from '../../callbags/callbag-pipe.js';
import {scan} from '../../callbags/callbag-scan.js';
import {last} from '../../callbags/callbag-last.js';
import {tap} from '../../callbags/callbag-tap.js';
import * as MOL from './common.js';


const calcStats = (_stats,a) => {
  if (a.name === 'CA') {
    const idx = MOL.protein3.indexOf(a.resName);
    _stats[idx].y++;
  }
  return _stats;
}

const pepstats = (node) => (stream) => {
  // Get Params
  let isFASTA = node.data.state?.fasta || false;
  // Get source.s
  let sourceObservable = stream[node.sources[0]];

  // Create callbag
  
  const cbag = pipe(
    sourceObservable,
    scan( (stats,atom) => calcStats(stats,atom),
      Array.from({length: MOL.protein1.length}, (_,i) => ({x: MOL.protein1[i],y:0})) 
    ),
    last(),
    tap(st => console.log(st))
  );

  // Store observable in stream BUG!!!
  node.targets.forEach( key => stream[key] = cbag);
  // Unmodified source
  // stream[node.targets[1]] = sourceObservable; // HACK
  // Return stream
  return stream;
}

export const pepstats_ui =   {
  id: "MOL_PEPSTATS",
  class: "information",
  description: "Peptide Stats",
  tags: ["sequence","protein","nucleic"],
  func: pepstats,
  ui: [
    [
      {widget: "label", title: "Statistics"},
      {widget: "output", name: "stats:number" }
    ],
    [
      {widget: "label", title: "Distribution"},
      {widget: "output", name: "aacounts:[point]" }
    ],
    [
      {widget: "label", title: "Props Distribution"},
      {widget: "output", name: "propcounts:string" }
    ],
    [
      {widget: "input", name: "molin:molecule"},
      {widget: "label", title: "Atoms"}
    ]
  ]
};

/*
PEPSTATS of 1HHO.A from 1 to 141

Molecular weight = 15126.36  		Residues = 141   
Average Residue Weight  = 107.279 	Charge   = 7.0   
Isoelectric Point = 8.9349
A280 Molar Extinction Coefficients  = 9970 (reduced)   9970 (cystine bridges)
A280 Extinction Coefficients 1mg/ml = 0.659 (reduced)   0.659 (cystine bridges)
Improbability of expression in inclusion bodies = 0.729

Residue		Number		Mole%		DayhoffStat
A = Ala		21		14.894 		1.732  	
B = Asx		0		0.000  		0.000  	
C = Cys		1		0.709  		0.245  	
D = Asp		8		5.674  		1.032  	
E = Glu		4		2.837  		0.473  	
F = Phe		7		4.965  		1.379  	
G = Gly		7		4.965  		0.591  	
H = His		10		7.092  		3.546  	
I = Ile		0		0.000  		0.000  	
J = ---		0		0.000  		0.000  	
K = Lys		11		7.801  		1.182  	
L = Leu		18		12.766 		1.725  	
M = Met		2		1.418  		0.834  	
N = Asn		4		2.837  		0.660  	
O = ---		0		0.000  		0.000  	
P = Pro		7		4.965  		0.955  	
Q = Gln		1		0.709  		0.182  	
R = Arg		3		2.128  		0.434  	
S = Ser		11		7.801  		1.114  	
T = Thr		9		6.383  		1.046  	
U = ---		0		0.000  		0.000  	
V = Val		13		9.220  		1.397  	
W = Trp		1		0.709  		0.546  	
X = Xaa		0		0.000  		0.000  	
Y = Tyr		3		2.128  		0.626  	
Z = Glx		0		0.000  		0.000  	

Property	Residues		Number		Mole%
Tiny		(A+C+G+S+T)		49		34.752
Small		(A+B+C+D+G+N+P+S+T+V)	81		57.447
Aliphatic	(A+I+L+V)		52		36.879
Aromatic	(F+H+W+Y)		21		14.894
Non-polar	(A+C+F+G+I+L+M+P+V+W+Y)	80		56.738
Polar		(D+E+H+K+N+Q+R+S+T+Z)	61		43.262
Charged		(B+D+E+H+K+R+Z)		36		25.532
Basic		(H+K+R)			24		17.021
Acidic		(B+D+E+Z)		12		 8.511
*/


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

import {xmlns} from './common.js';


export class Edge {

  /**
   * @constructor
   *
   * @author Jean-Christophe Taveau
   */
  constructor(edge_id,source_id,target_id,input_connector = 0, output_connector = 0) {
    this.eid = edge_id;
    this.source = source_id;
    this.out = output_connector;
    this.target = target_id;
    this.in = input_connector;
    this.line = this._createEdge(edge_id,source_id,target_id,input_connector, output_connector);
  }

  /*
   * @private
   * idE - Edge ID
   * idS - Source ID
   * idT - Target ID
   * input - Input Socket
   * output - Output Socket
   */
  _createEdge(idE,idS,idT,input,output) {
    // Source
    let words = idS.split('@'); 
    let idSource = {index: words[1],variable: words[0]};
    words = idT.split('@'); 
    let idTarget = {index: words[1],variable: words[0]};
    
    let nodeS = document.querySelector(`#${idSource.variable}__OUT__${idSource.index}`); //`#node_${idS} #o_${output} button`);
    console.log(idS,nodeS);
    console.log('EDGE',idS.match(/@(\d+)/));
    let shrinkNodeS = document.querySelector(`#node_${idSource.index} .out_socket`);
    let tmp = [idE];
    if (nodeS.dataset.edge !== undefined) {
      console.log(nodeS.dataset.edge);
      tmp = JSON.parse(nodeS.dataset.edge);
      tmp.push( idE);
    }
    nodeS.dataset.edge = JSON.stringify(tmp);
    if (shrinkNodeS.dataset.edge !== undefined) {
      let array = JSON.parse(shrinkNodeS.dataset.edge);
      array = [...array,...tmp].filter((v,i,indexes) => indexes.indexOf(v) === i);
      console.log(array);
      shrinkNodeS.dataset.edge = JSON.stringify(array);
    }
    else {
      shrinkNodeS.dataset.edge = nodeS.dataset.edge;
    }
    
    // Target
    let nodeT = document.querySelector(`#${idT.replace('@','__IN__')}`);
        console.log(idT);
    let shrinkNodeT = document.querySelector(`#node_${idTarget.index}  .in_socket`);
    nodeT.dataset.edge = idE;
    if (shrinkNodeT.dataset.edge !== undefined) {
      let array = JSON.parse(shrinkNodeT.dataset.edge);
      array.push(idE);
      shrinkNodeT.dataset.edge = JSON.stringify(array);
      console.log('shrinkT ' + shrinkNodeT.dataset.edge + ' ' +  idE);
    }
    else {
      shrinkNodeT.dataset.edge = `[${idE}]`;
    }

    console.log(nodeS.id + '--> ' + nodeT.id);
    let start = this.getCoords(nodeS);
    let end = this.getCoords(nodeT);
    let line = document.createElementNS(xmlns,'line');
    line.dataset.source = `node_${idSource.index}`;
    line.dataset.target = `node_${idTarget.index}`;
    line.setAttribute('id',`e_${idE}`);
    line.setAttribute('stroke-width',2.0);
    line.setAttribute('x1',start.x);
    line.setAttribute('y1',start.y);
    line.setAttribute('x2',end.x);
    line.setAttribute('y2',end.y);
    line.setAttribute("stroke", "#dfdfdf")
    return line;
  }


  /**
   *
   */
  getCoords(node) {
    let rect = node.getBoundingClientRect();
    // console.log(rect);
    return {
      x: rect.left + rect.width / 2.0 + window.scrollX,
      y: rect.top  + rect.height / 2.0 + window.scrollY
    }
  }

} // End of class Edge
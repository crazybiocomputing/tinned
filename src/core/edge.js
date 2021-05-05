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
  constructor(edge_id,source_id,target_id) {
    this.eid = edge_id;
    this.source = source_id;
    [this.sourceName,this.sourceID] = this.source.split('@');
    this.sourceID = parseInt(this.sourceID);
    this.target = target_id;
    [this.targetName,this.targetID] = this.target.split('@');
    this.targetID = parseInt(this.targetID);
    this.line = this._createEdge(edge_id,source_id,target_id);
  }

  /*
    * @private
    * Update flow in function of source and/or target
    */
  _updateFlow() {
      let flow = TINNED.graph.flow;
      flow.insertOperation(this.source,this.target);
  }

  /*
   * @private
   * Create SVG element 
   * edgID - Edge ID
   * srcID - Source ID
   * tgtID - Target ID
   * input - Input Socket
   * output - Output Socket Faut faire un create Edges (new Edge)
   */
  _createEdge(edgID,srcID,tgtID) {
    // Source
    let words = srcID.split('@'); 
    let sourceID = {index: words[1],variable: words[0]};
    let nodeS = document.querySelector(`#${sourceID.variable}__OUT__${sourceID.index}`); //`#node_${srcID} #o_${output} button`);
    console.log(sourceID.variable);
    console.log(sourceID.index);
    console.log('EDGE',srcID.match(/@(\d+)/));
    let shrinkNodeS = document.querySelector(`#node_${sourceID.index} .out_socket`);
    let tmp = [edgID];
    if (nodeS.dataset.edge !== undefined) {
      console.log(nodeS.dataset.edge);
      tmp = JSON.parse(nodeS.dataset.edge);
      tmp.push( edgID);
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
    words = tgtID.split('@'); 
    let targetID = {index: words[1],variable: words[0]};
    let nodeT = document.querySelector(`#${tgtID.replace('@','__IN__')}`);
    console.log(`#${tgtID.replace('@','__IN__')}`);
    let shrinkNodeT = document.querySelector(`#node_${targetID.index}  .in_socket`);
    nodeT.dataset.edge = edgID;
    if (shrinkNodeT.dataset.edge !== undefined) {
      let array = JSON.parse(shrinkNodeT.dataset.edge);
      array.push(edgID);
      shrinkNodeT.dataset.edge = JSON.stringify(array);
      console.log('shrinkT ' + shrinkNodeT.dataset.edge + ' ' +  edgID);
    }
    else {
      shrinkNodeT.dataset.edge = `[${edgID}]`;
    }

    console.log(nodeS.id + '--> ' + nodeT.id);
    let start = this.getCoords(nodeS);
    let end = this.getCoords(nodeT);
    let line = document.createElementNS(xmlns,'line');
    line.dataset.source = `node_${sourceID.index}`;
    line.dataset.target = `node_${targetID.index}`;
    line.setAttribute('id',`e_${edgID}`);
    line.setAttribute('stroke-width',2.0);
    line.setAttribute('x1',start.x);
    line.setAttribute('y1',start.y);
    line.setAttribute('x2',end.x);
    line.setAttribute('y2',end.y);
    line.setAttribute("stroke", "#dfdfdf");
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
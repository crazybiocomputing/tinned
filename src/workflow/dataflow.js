/*
 *  TINNED: TINy Node EDitor
 *  Copyright (C) 2019  Jean-Christophe Taveau.
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

// import {FuncFactory} from '../core/funcFactory.js';
import {TINNED} from '../tinned.js';

export class DataFlow {

  constructor(graph) {
    this.flow = [];
    this.args = {};
    TINNED.args = this.args; // Just for convenience
    this.lastProducer = -1;
    this.firstConsumer = 0;
  }

  /**
   * Add node function in DataFlow
   *
   * @author Jean-Christophe Taveau
   */
  add(node) {
    // Add function (core engine of the node)
    console.log(node.template.name);
    node.engine = FuncFactory.func(node.template.name);
        
    if (node.isProducer()) {
      this.flow.unshift(node);
      this.lastProducer++;
      this.firstConsumer++;
    }
    else if (node.isConsumer()) {
      this.flow.push(node);
    }
    else {
      // TODO 
      // Producer AND Consumer - must be inserted between `lastProducer` and `firstConsumer`.
      let index = this.lastProducer;
      // Check inputs and outputs indexes
      console.log(this.lastProducer, this.firstConsumer);
      this.flow.splice(index+1,0,node);
      this.firstConsumer++;
    }
  }

  /**
   * Remove node function in DataFlow
   *
   * @author Jean-Christophe Taveau
   */
  remove(node) {
  
  }
  
  /**
   * @author Jean-Christophe Taveau
   */
  async update(node_id) {
    // Get index in pipeline
    let index = this.flow.reduce( (accu,n,i) => (n.id === node_id) ? {node: n,index: i} : accu, {node: undefined, index: -1} ).index;
    console.log('INDEX',index);
    // Run node and following
    let args = this.args;
    for (let i = index; i < this.flow.length; i++) {
      const n = this.flow[i];
      console.log(i,n.template.name);
      args =  await n.engine(n.id,args);
    }
    this.args =  args;
  }
  
  dispatch(edges, args) {
    console.info('EDGES',edges);
    edges.forEach( e => {
      if (args[e.source]) {
        args[e.target] = args[e.source];
      }
      else {
        args[e.source] = args[e.target];
      }
    });
    return args;
  }
  
  /**
   * Run the data flow
   * @author Jean-Christophe Taveau
   */
  async run(pipeline,root) {
    let result = root;
    for (const func of pipeline) {
      result = await func(result);
    }
    return result;
  }

} // End of class DataFlow

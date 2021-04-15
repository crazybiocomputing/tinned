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


import {Node} from './node.js';
import {Edge} from './edge.js';
import {DataFlow} from '../workflow/dataflow.js';
import { components } from '../../mol/components.js';


export class Graph {

  /**
   * @constructor
   * @author Jean-Christophe Taveau
   */
  constructor(templates) {
    this.templates = templates;
    this.nodes = [];
    this.edges = [];
    this.flow = new DataFlow(this); // ??
    this.context; // svg or canvas/webgl?
    this.root; // HTML Parent node for all the nodes
  }

  build(json) {
    this.createNodes(json.nodes);
    this.createEdges(json.edges);
  }

  lastID() {
    return (this.nodes.length > 0) ? this.nodes[this.nodes.length - 1].id : 0;
  }

  appendNode(templateID,nodeID = -1,data={}) {
    let newid = (nodeID !== -1) ? nodeID : this.lastID() + 1; // TODO HACK
    // Create the Node (the `Producer`)
    let template = this.templates.find( n => n.id === templateID);
    let node =  new Node(newid,template,data);
    this.nodes.push(node);
    this.root.appendChild(node.element);
    // Add the engine in the queue waiting for execution (the `Consumer`).
    this.flow.add(node);
    return node;
  }

  /**
   * Append node in the current Graph by its name
   *
   * @author Jean-Christophe Taveau
   */
  appendNodeByName(templateName,nodeID = -1,data={}) {
    let templateID = this.templates.find( n => n.name === templateName);
    return this.appendNode(tmplID,nodeID,data);
  }


  appendEdge(start_id,end_id) {
    let ctx = this.context; 
    let eid = this.edges[this.edges.length - 1].eid++;
    let e = new Edge(eid,start_id,end_id);
    this.edges.push(e);
    ctx.append(e.line);
    this.flow.append(e);
  }

  /**
   * Create Nodes of the given graph from components
   *
   * @author Jean-Christophe Taveau
   */
  createNodes(json) {
    let root = this.root;
    // Create Graph
    json.forEach( (node) => {
      // Step #1: Create component
      let component = {id: node.id};
      let template_ui = this.templates.find(t => t.id === node.template);
      // Step #2:  Create GUI
      console.log('NODE',node.id,node.template,component);
      component.node = new Node(node.id,template_ui,node.data);
      this.nodes.push(component.node);
      this.root.appendChild(component.node.element);
      // Step #3:  Update states if any or in data
      if (node.data.state) {
        component.node.setState(node.data.state);
      }
      // Add the engine in the queue waiting for execution (the `Consumer`).
      // TODO this.flow.add(component);
      // this.appendNode(component);
      // this.appendNode(NodeFactory.node.template,node.id,node.data);
      /*
      // Attach node to <root>
      console.log(node.template,node.id,node.data);
      console.log(this.components.find( n => n.id === node.template));
      let n = new Node(node.id,this.components.find( n => n.id === node.template),node.data);
      this.nodes.push(n);
      root.appendChild(n.element);
      */
    });
  }

  /**
   * Create Edges of the given graph
   *
   * @author Jean-Christophe Taveau
   */
  createEdges(edges) {
    let ctx = this.context;
    edges.forEach( (edge) => {
      let e = new Edge(edge.eid,...edge.sockets);
      this.edges.push(e);
      ctx.append(e.line);
      this.flow.append(e);
    });
    console.log(this.flow);
  }

  /**
   * Dispatch args 
   *
   * @author Jean-Christophe Taveau
   */
  dispatch(socket_id, args) {
    let edges = this.edges.filter( e => e.source === socket_id || e.target === socket_id);
    return this.flow.dispatch(edges, args);
  }
  
  getNode(node_id) {
    return this.nodes.find( n => n.id === node_id);
  }
  
  getEdge(id) {
  }

  setGraphicsContext(context) {
    this.context = context;
  }

  setRootNode(parentNode) {
    this.root = parentNode;
  }


  show() {
  }

  /**
   * Executes the active nodes in this graph
   *
   * @author Jean-Christophe Taveau
   */
  run() {
    this.flow.forEach( func => func() );
  }

  /**
   * Update the node `id` and following
   *
   * @param {array} nodes - Array of nodes whose edges must be updated
   *
   * @author Jean-Christophe Taveau
   */
  update(node_id) {
    console.log(node_id);
    this.flow.update(node_id);
  }

  /**
   * Update edges of All the nodes defined in an array
   *
   * @param {array} nodes - Array of nodes whose edges must be updated
   *
   * @author Jean-Christophe Taveau
   */
  updateAllEdges(nodes) {
    // console.log(nodes);
    nodes.forEach( n => {
      this.updateEdges(n, n.classList.contains('shrink') );
    });
  }

  /**
   * Update edges of a specific node
   *
   * @param {node} node - Node whose edges must be updated
   * @param {boolean} shrinkMode - State of the node appearance (shrinked or expanded)
   *
   * @author Jean-Christophe Taveau
   */
  updateEdges(node,shrinkMode = false) {
    console.log('UPDATE ' + shrinkMode);
    // Get Edge ID
    // let src_eid = document.querySelector(`#${node.id} .input button`);
    let sources = (shrinkMode) ? document.querySelectorAll(`#${node.id} .out_socket`) : document.querySelectorAll(`#${node.id} .output button`);
    if (sources !== null) {
      sources.forEach( s => {
        if (s.dataset.edge !== undefined) {
          JSON.parse(s.dataset.edge).forEach( (e) => {
            let line = document.getElementById( `e_${e}`);
            let start = this.getCoords(s);
            line.setAttribute('x1',start.x);
            line.setAttribute('y1',start.y);
          });
        }
      });
    }
    let targets = (shrinkMode) ? document.querySelectorAll(`#${node.id} .in_socket`) : document.querySelectorAll(`#${node.id} .input button`);
    if (targets !== null) {
      if (shrinkMode) {
        targets.forEach( t => {
          if (t.dataset.edge !== undefined) {
            JSON.parse(t.dataset.edge).forEach( (e) => {
              let line = document.getElementById(`e_${e}`);
              let end = this.getCoords(t);
              line.setAttribute('x2',end.x);
              line.setAttribute('y2',end.y);
            });
          }
        });
      }
      else {
        targets.forEach( t => {
          if (t.dataset.edge !== undefined) {
            let line = document.getElementById(`e_${t.dataset.edge}`);
            let end = this.getCoords(t);
            line.setAttribute('x2',end.x);
            line.setAttribute('y2',end.y);
          }
        });
      }
    }
  }

  /**
   * Get geometry (x,y,width,height) and Compute absolute position
   */
  getCoords(element) {
    let rect = element.getBoundingClientRect();
    // console.log(rect);
    let cx = document.documentElement.clientWidth/2.0;
    let cy = document.documentElement.clientHeight/2.0;
    return {
      x: (rect.left + rect.width / 2.0 )  + window.scrollX,
      y: (rect.top  + rect.height / 2.0 ) + window.scrollY
    }
  }
} // End of class Graph



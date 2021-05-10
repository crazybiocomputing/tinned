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

export class Graph {

  /**
   * @constructor
   * @author Jean-Christophe Taveau
   */
  constructor(templates) {
    this.templates = templates;
    this.vertices = [];
    this.edges = [];
    this.adjacencyList = {};
    this.context; // svg or canvas/webgl?
    this.root; // HTML Parent node for all the vertices??
    this.disposals = [];
  }

  build(json) {
    this.createNodes(json.nodes);
    this.createEdges(json.edges);
    this.updateAllEdges();
  }

  lastID() {
    return (this.vertices.length > 0) ? this.vertices[this.vertices.length - 1].id : 0;
  }

  appendNode(templateID,nodeID = -1,data={}) {
    let newid = (nodeID !== -1) ? nodeID : this.lastID() + 1; // TODO HACK
    // Create the Node (the `Producer`)
    let template = this.templates.find( n => n.id === templateID);
    let node =  new Node(newid,template,data);
    this.vertices.push(node);
    this.root.appendChild(node.element);
    // Add the engine in the queue waiting for execution (the `Consumer`).
    //this.flow.add(node);
    // Step #3 - Create graph
    if (!this.adjacencyList[newid]) {
      this.adjacencyList[newid] = [];
    }
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
    let eid;
    if (this.edges.length===0){
      eid=1;
    }
    else{
      eid = this.edges[this.edges.length - 1].eid+1;
    }
    console.log("Edge ID : ", eid);
    let e = new Edge(eid,start_id,end_id);
    this.edges.push(e);
    this.getNode(+e.sourceID).targets.push(e.target);
    this.getNode(+e.targetID).sources.push(e.target);
    this.adjacencyList[start_id.split("@")[1]].push(+end_id.split("@")[1]);
    ctx.append(e.line);
    this.update();
    return e;
  }

  /**
   * Create vertices of the given graph from JSON components
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
      this.vertices.push(component.node);
      this.root.appendChild(component.node.element);
      // Step #3:  Update states if any or in data
      if (node.data.state) {
        component.node.setState(node.data.state);
      }
      // Step #3 - Create graph
      if (!this.adjacencyList[node.id]) {
        this.adjacencyList[node.id] = [];
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
      this.vertices.push(n);
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
      this.adjacencyList[e.sourceID].push(e.targetID);
      this.getNode(+e.sourceID).targets.push(e.target);
      this.getNode(+e.targetID).sources.push(e.target);
      ctx.append(e.line);
    });
    console.log(this.adjacencyList);
    this.run();
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
    return this.vertices.find( n => n.id === node_id);
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

  /*
   * Topological Sort - DFS Algorithm
   * From https://adelachao.medium.com/graph-topological-sort-javascript-implementation-1cc04e10f181
   */
  topSortDFS(_adjacencyList) {

    function topSortDFSHelper(v, n, visited, topNums) {
      visited[v] = true;
      const neighbors = _adjacencyList[v];
      for (const neighbor of neighbors) {
        if (!visited[neighbor]) {
            n = topSortDFSHelper(neighbor, n, visited, topNums);
        }
      }
      topNums[n] = v;
      return n - 1;
    }

    const vertices = Object.keys(_adjacencyList);
    const visited = {};
    const topNums = new Array(vertices.length).fill(0);
    let n = vertices.length - 1;
    for (const v of vertices) {
        if (!visited[v]) {
            n = topSortDFSHelper(v, n, visited, topNums);
        }
    }
    return topNums;
  }

  getConnected(_adjacencyList) {
    let adj = {..._adjacencyList}; // Clone
    let sinks = this.vertices.filter( v => v.isSink());
    let sources = this.vertices.filter( v => v.isSource());
    // Remove unconnected sources
    sources.forEach( source => {
      if (adj[source.id].length === 0) {
        delete adj[source.id];
      }
    });
    // Remove unconnected sinks from source(s)
    sinks.forEach( sink => {
      if (!Object.keys(adj).some(i => adj[i].includes(sink.id))) {
        delete adj[sink.id];
      }
    });
    // Find a source connected to a sink
    return adj;
  }

  /**
   * Executes the active vertices in this graph
   *
   * @author Jean-Christophe Taveau
   */
  async run() {
    // HACK Clean adjacencyList
    let adj = this.getConnected(this.adjacencyList);
    console.log(adj);
    const pipeline = this.topSortDFS(adj);
    console.log('Pipe',pipeline);
    pipeline.reduce( (stream,vtx) => {
      const nod = this.vertices.find(n => n.id === +vtx);
      stream = nod.template.func(nod)(stream);
      console.log(stream);
      return stream;
    },{}); // use of class Map()?
  }

  /**
   * Update the node `id` and following
   *
   * @param {array} vertices - Array of vertices whose edges must be updated
   *
   * @author Jean-Christophe Taveau
   */
  async update(node=-1) {
    if (node === -1) {
      // Update all the nodes
      // TODO
    }
    else {
      // Only update from this node
    }
    this.run();
    // Flatten the graph
    //const pipeline = this.topSortDFS();
    // console.log(pipeline);

  }

  dispose() {
    this.disposals.forEach(disposeFunc => disposeFunc());
  }
  
  removeNode(_id) {
    const index = this.vertices.findIndex( n => n.id === _id);
    const vertex = this.vertices[index];
    // Step #1 - Remove HTML element
    vertex.element.remove();
    // Step #2 - Remove Edges connected to this vertex/node
    this.removeEdgesAt(_id);
    // Step #3 - Remove node from DB
    this.vertices.splice(index,1);
    console.log(this);
    // Step #4 - Remove vertex in adjacencyList
    delete this.adjacencyList[_id];
    Object.keys(this.adjacencyList).forEach( key => 
      this.adjacencyList[key] = this.adjacencyList[key].filter( (ident) => ident !== _id)
    );
    // Object.keys(this.adjacencyList).forEach( key => this.adjacencyList[key]);
    //this.updateAllEdges();
    // Stop the stream
    this.dispose();
    console.log(this);
  }

  removeEdgesAt(_id) {
    const index = this.vertices.findIndex( n => n.id === _id);
    const vertex = this.vertices[index];
    const insocks = vertex.getSockets(1); // Input socket(s)
    const outsocks = vertex.getSockets(2); // Output socket(s)
    // Input sockets
    insocks.forEach( sock => {
      let sname = `${sock.name.split(':')[0]}@${_id}`;
      this.edges.forEach( (e,i) => {
        if (sname === e.target) {
          // Remove in svg
          document.querySelector(`svg #e_${e.eid}`).remove();
          // Remove edge
          this.edges.splice(i,1);
        }
      });
    });
    // Output sockets
    console.log('SOCKS',insocks,outsocks);
    outsocks.forEach( sock => {
      let sname = `${sock.name.split(':')[0]}@${_id}`;
      this.edges.forEach( (e,i) => {
        console.log(i);
        if (sname === e.source) {
          // Remove in svg
          document.querySelector(`svg #e_${e.eid}`).remove();
          // Remove edge
          this.edges.splice(i,1);
        }
      });
    });
  }

  // TODO
  removeEdge(edge) {
    // Remove in svg
    document.querySelector(`svg #e_${edge.eid}`).remove();
    // Update connected vertices via input and output sockets
    //this.getNode(edge.sourceID).targets
    //this.getNode(edge.targetID).sources
    // Update adjacencyList
    delete this.adjacencyList[edge.sourceID];
    Object.keys(this.adjacencyList).forEach( key => 
      this.adjacencyList[key] = this.adjacencyList[key].filter( (ident) => ident !== edge.sourceID)
    );
    // Remove Edge from DB
    let eindex = this.edges.findIndex(e => e.eid === edge.eid);
    this.edges.splice(eindex,1);
    // Stop and Re-run stream
    this.dispose();
    this.run();
  }


  removeDuplicate(e){
    let dupl = this.edges.findIndex(edge => edge.target === e.target);
    if (dupl !== -1 && dupl !== this.edges.length -1){
      this.removeEdge(this.edges[dupl]);
      /*
      console.log(dupl);
      //Update SVG
      document.querySelector(`main svg #e_${this.edges[dupl].eid}`).remove();
      this.edges.splice(dupl,1);
      */
    }
  }

  /**
   * Update edges of All the vertices defined in an array
   *
   * @param {array} vertices - Array of vertices whose edges must be updated
   *
   * @author Jean-Christophe Taveau
   */
  updateAllEdges() {
    this.edges.forEach(edge => this.updateEdge(edge));
    /*
    this.vertices.forEach( n => {
      this.updateEdges(n.element, n.element.classList?.contains('shrink') );
    });
    */
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
    // Find edges connected to node
    const vID = +node.id.split('_')[1];
    const connected = this.edges.filter(e => e.sourceID === vID || e.targetID === vID);
    // Draw edge.s
    connected.forEach(edge => this.updateEdge(edge) );
   }

  updateEdge(edge) {
    // source
    const [socketS,vertexS] = edge.source.split('@');
    // target
    const [socketT,vertexT] = edge.target.split('@');
    // Get HTML elements (input socket and output socket)
    let shrinkMode = this.getNode(+vertexS).shrinkMode;
    const s = (shrinkMode) ? 
      document.querySelector(`#node_${vertexS} .out_socket`) : 
      document.querySelector(`#${socketS}__OUT__${vertexS}`);
    shrinkMode = this.getNode(+vertexT).shrinkMode;
    const t = (shrinkMode) ? 
      document.querySelector(`#node_${vertexT} .in_socket`) : 
      document.querySelector(`#${socketT}__IN__${vertexT}`);
    // Draw line
    let line = document.getElementById( `e_${edge.eid}`);
    let start = this.getCoords(s);
    line.setAttribute('x1',start.x);
    line.setAttribute('y1',start.y);
    let end = this.getCoords(t);
    line.setAttribute('x2',end.x);
    line.setAttribute('y2',end.y);
  }

  /**
   * Update edges of a specific node
   *
   * @param {node} node - Node whose edges must be updated
   * @param {boolean} shrinkMode - State of the node appearance (shrinked or expanded)
   *
   * @author Jean-Christophe Taveau
   */
   updateEdges_Obsolete(node,shrinkMode = false) {
    // Get Edge ID
    // let src_eid = document.querySelector(`#${node.id} .input button`);
    let sources = (shrinkMode) ? document.querySelectorAll(`#${node.id} .out_socket`) : document.querySelectorAll(`#${node.id} .output button`);
    if (sources !== null) {
      sources.forEach( s => {
        if (s.dataset.edge !== undefined) {
          JSON.parse(s.dataset.edge).forEach( (e) => {
            let line = document.getElementById( `e_${e}`);
            if (line){
              let start = this.getCoords(s);
              line.setAttribute('x1',start.x);
              line.setAttribute('y1',start.y);
            }
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
              if (line){
                let end = this.getCoords(t);
                line.setAttribute('x2',end.x);
                line.setAttribute('y2',end.y);
              }
            });
          }
        });
      }
      else {
        targets.forEach( t => {
          if (t.dataset.edge !== undefined) {
            let line = document.getElementById(`e_${t.dataset.edge}`);
            if (line){
              let end = this.getCoords(t);
              line.setAttribute('x2',end.x);
              line.setAttribute('y2',end.y);
            }
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



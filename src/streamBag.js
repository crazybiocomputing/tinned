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

export class StreamBag {

  /**
   * @constructor
   * @author Jean-Christophe Taveau
   */
  constructor(_graph) {
    this.graph = _graph;
    this.adjacencyList = {};
    this.disposals = [];
    this.callbags = {};
    this.sources = {};
    this.children = [];
  }

  static from(parentStream) {
    let child = new StreamBag(parentStream.graph);
    parentStream.children.push(child);
    return child;
  }

  addFromEdge(sock_source_name,sock_target_name) {
    const [_varS,source_id] = sock_source_name.split("@");
    const [_varT,target_id] = sock_target_name.split("@");
    // Add node id in adjacency list
    console.log(source_id);
    this.adjacencyList[source_id].push(+target_id);
    // Add sockets ids
    if (!this.sources[sock_source_name]) {
      this.sources[sock_source_name] = {nodeid: source_id,varname:_varS,targets: []};
    }
    this.sources[sock_source_name].targets.push(sock_target_name);
  }

  /**
   * 
   *
   * @author Jean-Christophe Taveau
   */
  add(node) { 
    if (!this.adjacencyList[node.id]) {
      this.adjacencyList[node.id] = [];
    }
  }
 
  setCallbags(sock_source_name,stream$) {
    console.log(sock_source_name);
    this.sources[sock_source_name].targets.forEach( key => this.callbags[key] = stream$);
  }

  getCallbags(node) {
    return node.getSockets(1).map( socket => {
      // Get socket_name
      const sockname = `${socket.name.split(':')[0]}@${node.id}`;
      return this.callbags[sockname];
    });
  }

  getCallbag(socket_name) {
    return this.callbags[socket_name];
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

  /**
   * Clean up the graph path to only remain connected vertices
   * 
   * @param {}} _adjacencyList 
   * @returns 
   */
  getConnected(_adjacencyList) {
    let adj = {..._adjacencyList}; // Clone
    // Only keep connected nodes
    // let cnodes = this.graph.vertices.filter(vtx => vtx.);
    let sinks = this.graph.vertices.filter( v => v.isSink());
    let sources = this.graph.vertices.filter( v => v.isSource());
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
    // TODO: Find a source connected to a sink
    // TODO: Remove circular path if any
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
    // Start the pipeline
    let _stream = pipeline.reduce( (stream,vtx) => {
      const nod = this.graph.vertices.find(n => n.id === +vtx);
      stream = nod.template.func(nod)(stream);
      return stream;
    },this); // use of class Map()?
    console.log(_stream);
  }

  async start() {

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
    this.disposals = []; // Reset
  }
  
  removeNode(_id) {
    // Step #1 - Remove vertex in adjacencyList
    delete this.adjacencyList[_id];
    Object.keys(this.adjacencyList).forEach( key => 
      this.adjacencyList[key] = this.adjacencyList[key].filter( (ident) => ident !== _id)
    );
    // Step #2 - Stop the stream
    this.dispose();
    // Step #3 - Remove corresponding callbags...
    console.log(this);
  }


} // End of class StreamBag



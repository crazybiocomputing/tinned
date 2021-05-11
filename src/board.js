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

import {TINNED} from './tinned.js';
import {Draggable} from './core/draggable.js';
import {translStart,translOver,translEnd} from './core/dragBoard.js';
import {Graph} from './graph.js';
import {xmlns} from './core/common.js';


export class Board extends Draggable {

  /**
   * @constructor
   */
  constructor(parent,components) {
    super();
    this.parent = parent;
    this.boardgame;
    this._components = components;
    this.graph = new Graph(components);
    this.zoom = 1.0;
    this.translate = {x:0,y:0};
    this.tx = 0;
    this.ty = 0;
    
  }
  
  set components(nodecomponents) {
    this._components = nodecomponents;
  }
  
  get components() {
    return this._components;
  }
  
  addEvents() {
    // Zoom Event with mouse wheel scroll
    window.addEventListener("wheel", event => {
      const delta = Math.sign(event.deltaY);
      TINNED.zoom += 0.05*(-delta);
      console.info(delta,this.zoom);
      document.querySelector('#board').style.transform = `
        translate(50%,50%) 
        scale(${TINNED.zoom}) 
        translate(${TINNED.translate.x}px,${TINNED.translate.y}px) 
        translate(-50%,-50%) 
      `;
      this.graph.updateAllEdges();
      event.preventDefault();
    });
    
    console.log('RUN ',document.querySelector('#board'));
    // document.querySelector('#board').style.transform = `translate(50%,50%) scale(1) translate(-50%,-50%)`;
    this.draggable(document.querySelector('#board'),translStart,translOver,translEnd);
    this.boardgame.addEventListener('change', (ev) => {
      console.log('something changed');
      console.log(ev);
    });
    
  }
  
  /**
   * Load a graph defined as JSON
   *
   * @author Jean-Christophe Taveau
   */
  load(graph) {
    
     // Create Edges Layer
    let svg = document.createElementNS(xmlns,'svg');
    svg.setAttribute('width','100%');
    svg.setAttribute('height','100%');

    this.parent.prepend(svg);

    // Create Board
    this.boardgame = document.createElement('div');
    this.boardgame.id = 'board';
    this.boardgame.className = 'board';
    this.parent.appendChild(this.boardgame);
 
    // Define popup for dialog windows, menus, splash screen, etc.
    let popup = document.createElement('div');
    popup.id = 'popup';
    popup.addEventListener('mousedown', (e) => e.stopPropagation(),false); 
    popup.addEventListener('dragstart', (e) =>  false,false); 
    popup.addEventListener('dragover', (e) => false,false); 
    popup.addEventListener('drop', (e) => false,false);
    this.boardgame.appendChild(popup);
    
    // Graph
    this.graph.setRootNode(this.boardgame);
    this.graph.setGraphicsContext(svg);
    
    // Board Params
    TINNED.zoom = graph.board?.zoom || 1.0;
    TINNED.tx = graph.board?.tx || 0.0;
    TINNED.ty = graph.board?.tx || 0.0;
    TINNED.translate = graph.board?.translate || {x:0,y:0};
    // Apply
    this.boardgame.style.transform = `
    translate(50%,50%) 
    scale(${TINNED.zoom}) 
    translate(${TINNED.translate.x}px,${TINNED.translate.y}px) 
    translate(-50%,-50%)`;

    // Create Nodes
    TINNED.graph = this.graph;
    this.graph.build(graph);
    this.graph.show();
    
    this.addEvents();
  }
  
  /**
   * Run the software
   *
   * @author Jean-Christophe Taveau
   */
  run() {
    // TODO
    console.log(this.graph);
  }
  
} // End of class Board


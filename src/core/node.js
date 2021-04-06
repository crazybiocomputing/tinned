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

import {TINNED} from '../tinned.js';
import {Draggable,dragStartNode,dragOverNode, dragEndNode} from './draggable.js';
import {NodeCreator} from './nodeCreator.js';
import {WidgetFactory} from './widgetFactory.js';

export class Node extends Draggable {

  /**
   * @constructor
   *
   * @param {number} id - DOM id
   * @param {object} template - Node Template containing the description of all the widgets
   * @param {object} metadata - Parameters of the widgets
   *
   * @author Jean-Christophe Taveau
   */
  constructor(id,template,metadata) {
    super();
    this.id = id;
    console.log('NODE',id);
    this.template = template;
    this.element = document.createElement('section');

    // Check if `node` requires a preview
    this.preview = template.ui.some( p => p.preview !== undefined) || template.preview;

    // Obsolete??
    this.hasLayers = template.ui.some( (p) => p.layer !== undefined);

    // DEBUG: Check if node contains inputs and outputs
    this.hasOutputs = template.ui.some( (row) => row.find( w => w.widget === 'output'));
    this.hasInputs  = template.ui.some( (row) => row.find( w => w.widget === 'input'));

    // Create Widgets
    this.createMarkup(id,template,metadata);
    
  }

  /**
   * Is this node a `Consumer`
   *
   */
  isConsumer() {
    return this.hasInputs && !this.hasOutputs;
  }
  
  /**
   * Is this node a `Producer`
   *
   */
  isProducer() {
    return this.hasOutputs && !this.hasInputs;
  }
  
  getArguments() {
    return this.template.ui.map( p => {
      const type = (p.input)  ? 'TO' : ( (p.output) ? 'FROM': 'AT');
      return `${p.name}__${type}__${this.id}`;
    });
  }
  /*
   * @private
   * Create Node
   * @author Jean-Christophe Taveau
   */
  createMarkup(id,template,metadata) {

    // Main
    let nodeH = this.element;
    nodeH.id = 'node_'+id;
    nodeH.style.left = (metadata.pos) ? `${metadata.pos[0]}px`: `${Math.floor(Math.random() * 1000)}px`;
    nodeH.style.top  = (metadata.pos) ? `${metadata.pos[1]}px`: `${Math.floor(Math.random() * 600)}px`;

    // Head
    let head = this.createHeader(template,id,metadata);

    // Shrink
    let shrink = this.createShrinkArea(template,id,metadata);

    // Body
    let body = this.createBody(template,id,metadata);
    
    // Footer
    let foot = this.createFooter(template,id,metadata);

    // Append all the parts
    nodeH.appendChild(head);
    nodeH.appendChild(shrink);
    nodeH.appendChild(body);
    nodeH.appendChild(foot);

  }

  /*
   * Create Header
   *
   * @author Jean-Christophe Taveau
   */
  createHeader(node,id,metadata) {
  
    const shrinkExpand = (evt) => {
      // Hide body, footer
      let id = evt.target.parentNode.id.match(/\d+/)[0];
      let node = document.getElementById(`node_${id}`);
      console.log(evt.target.parentNode.id,id);
      console.log(node);
      node.classList.toggle('shrink');

      // Shrink mode is true
      TINNED.graph.updateEdges(node,node.classList.contains('shrink'));
      console.log(node);
      evt.preventDefault();
    }
    
    const openTools = (preview) => (event) => {
      let nodeElement = WidgetFactory.getNodeElement(event.target);
      NodeCreator.createHamburger(nodeElement,preview);
    }
    
    // M A I N
    
    let nodeH = this.element;

    // Header
    let head = document.createElement('div'); head.className = 'header'; head.classList.add(node.class.replace('.','_').toLowerCase());
    let banner = document.createElement('p');
    banner.title = (node.help) ? node.help : "No Help";
    banner.dataset.nodeid = id;
    head.appendChild(banner);
    
    // Part I - Shrink/Expand Button
    let shrink = document.createElement('a');
    shrink.id = `expand_${id}`;
    shrink.href = '#';
    shrink.innerHTML = `<span class="expandB">&#9662;</span><span class="shrinkB">&#9656;</span>`;
    shrink.addEventListener('click', shrinkExpand);
    banner.appendChild(shrink);
    // Part II - Description/Title
    banner.appendChild(document.createTextNode(node.description) );
    // Part III - Hamburger Menu
    let toolset = document.createElement('span');
    toolset.className = 'toolset';
    banner.appendChild(toolset);
    let menu = WidgetFactory.create('bars','button',{icon:'bars',title:'Tools',name:'hamburger'},{},openTools(node.preview)); // fa-ellipsis-v
    menu.firstChild.classList = ''; // Remove all classes
    toolset.appendChild(menu);
    
    // Add event
    this.draggable( head,dragStartNode,dragOverNode, dragEndNode);
    return head;
  }

  /*
   * Create Shrinkable View of node
   *
   * @author Jean-Christophe Taveau
   */
  createShrinkArea(node,id,metadata) {

    let shrink = document.createElement('div');
    shrink.className = 'shrinkdiv'; shrink.classList.add(node.class.replace('.','_').toLowerCase());
    shrink.innerHTML = (this.hasInputs) ? '<span class="in_socket"><i class="fa fa-chevron-circle-right"></i></span>': '';
    shrink.innerHTML += '<p>&nbsp;</p>';
    shrink.innerHTML += (this.hasOutputs) ? '<span class="out_socket"><i class="fa fa-chevron-circle-right"></i></span>' : '';
    return shrink;
  }


  /*
   * Create Body
   *
   * @author Jean-Christophe Taveau
   */
  createBody(template,id,metadata) {

    // Body
    let body = document.createElement('div');
    body.id = 'body_'+id;
    body.className = 'body';
    // Main content

    NodeCreator.createContent( template.ui,body,this.id, metadata);

    return body;
  }


  /*
   * Create the footer
   *
   * @author Jean-Christophe Taveau
   */
  createFooter(node,id,metadata) {
  
    const resizeStart = (event) => {
      event.preventDefault();
      console.log('EVENT',event.target.dataset.nodeid);
      let dragged = document.getElementById(`node_${event.target.dataset.nodeid}`);
      DRAG.width = dragged.getBoundingClientRect().width;
      DRAG.node = dragged;
      return dragged;
    }

    const resizeMove = (event) => {
      event.preventDefault();
      let dragged = DRAG.node;

      // Apply the inverse of transform matrix of `board`
      DRAG.node.style.width = DRAG.width + ((DRAG.BBox.x - TWIP.tx)/TWIP.zoom + DRAG.newDX/TWIP.zoom)  + 'px';
      DRAG.node.style.height  = ((DRAG.BBox.y - TWIP.ty)/TWIP.zoom + DRAG.newDY/TWIP.zoom)  + 'px';
    };

    const resizeEnd = (event) => {
      // Do nothing?
      event.preventDefault();
    };


    let foot = document.createElement('div');
    foot.className = 'footer';
    foot.innerHTML = `<span style="align:right;margin:2px">${node.class}</span>`;
    let link = document.createElement('a');
    foot.appendChild(link);
    link.dataset.nodeid = id;
    link.innerHTML = `
      <svg preserveAspectRatio="xMinYMin" viewBox="0 0 22 22">
        <circle cx="18" cy="6" r="2" stroke="none" fill="#777"/>
        <circle cx="12" cy="12" r="2" stroke="none" fill="#777"/>
        <circle cx="18" cy="12" r="2" stroke="none" fill="#777"/>
        <circle cx="6"  cy="18" r="2" stroke="none" fill="#777"/>
        <circle cx="12" cy="18" r="2" stroke="none" fill="#777"/>
        <circle cx="18" cy="18" r="2" stroke="none" fill="#777"/>
      </svg>`; 

    this.draggable( link,resizeStart,resizeMove, resizeEnd);
    return foot;
  }



} // End of class Node

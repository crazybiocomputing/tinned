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
import {Draggable} from './draggable.js';
import {dragStartNode,dragOverNode, dragEndNode}  from './dragNode.js';
import {NodeCreator} from './nodeCreator.js';
import {WidgetFactory} from './widgetFactory.js';
import * as DOM from '../dom/dom.js';

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
  constructor(id,template,data) {
    super();
    this.id = id;
    console.log('NODE',id);
    this.sources = [];
    this.targets = []; // TODO
    this.template = template; // Useful?
    this.shrinkMode = false;

    // Step #1 - Set states
    // Init default states
    this.data = {meta: {pos:[0,0]},state:{},types:[]};
    template.ui.forEach( row => row.forEach(widget => {
        if (!['output','input'].includes(widget.widget) && widget.name) {
          const [_var,_type] = widget.name.split(':');
          this.data.state[_var] = widget.state;
          this.data.types.push(widget.widget);
        }
      })
    );
    // Fill with new data
    Object.keys(data.meta).forEach( key => this.data.meta[key] = data.meta[key]); // Bug à la création de noeuds, on ne peut pas avancer à cause des métadonnées
    Object.keys(data.state).forEach( key => this.data.state[key] = data.state[key]);
    
    this.element = document.createElement('section');

    // Check if `node` requires a preview
    this.preview = template.ui.some( p => p.preview !== undefined) || template.preview;

    // Obsolete??
    this.hasLayers = template.ui.some( (p) => p.layer !== undefined);

    // DEBUG: Check if node contains inputs and outputs
    this.hasOutputs = template.ui.some( (row) => row.find( w => w.widget === 'output'));
    this.hasInputs  = template.ui.some( (row) => row.find( w => w.widget === 'input'));

    // Step #2 - Create HTML Widgets
    this.createMarkup(id,template,data); 
  }

  /**
   * Is this node a `Consumer`
   *
   */
  isSink() {
    return this.hasInputs && !this.hasOutputs;
  }
  
  /**
   * Is this node a `Producer`
   *
   */
  isSource() {
    return this.hasOutputs && !this.hasInputs;
  }
  
  getArguments() {
    return this.template.ui.map( p => {
      const type = (p.input)  ? 'TO' : ( (p.output) ? 'FROM': 'AT');
      return `${p.name}__${type}__${this.id}`;
    });
  }

  getSockets(type = 3) {
    // type = 1 input
    // type = 2 output
    // type = 3 input + output
    let socks = ( (type & 1) === 1) ? this.template.ui.flat().filter( p => p.widget === 'input') : [];
    socks = ( (type & 2) === 2) ? this.template.ui.flat().filter( p => p.widget === 'output') : socks;
    return socks;
  }

  /**
   * Update widgets values
   * @param {object} state 
   * @author Jean-Christophe Taveau
   */
  setState(state) {
    Object.keys(state).forEach( key => {
      console.log(`#${key}__AT__${this.element.id}`);
      let child = this.element.querySelector(`#${key}__AT__${this.id}`);
      child.value = state[key];
      if (child.type === 'checkbox') {
        child.checked = state[key];
      }
    });
  }

  /*
   * @private
   * Create Node
   * @author Jean-Christophe Taveau
   */
  createMarkup(id,template,data) {

    // Main
    const metadata = data.meta;

    let nodeH = this.element;
    nodeH.id = 'node_'+id;
    nodeH.style.left = (metadata.pos) ? `${metadata.pos[0]}px`: `${Math.floor(Math.random() * 1000)}px`;
    nodeH.style.top  = (metadata.pos) ? `${metadata.pos[1]}px`: `${Math.floor(Math.random() * 600)}px`;

    // Head
    let head = this.createHeader(template,id,data);

    // Shrink
    let shrink = this.createShrinkArea(template,id,data);

    // Body
    let body = this.createBody(template,id,data);
    
    // Footer
    let foot = this.createFooter(template,id,data);

    // Append all the parts
    nodeH.appendChild(head);
    nodeH.appendChild(shrink);
    nodeH.appendChild(body);
    nodeH.appendChild(foot);

    if (data.meta?.shrink) {
      this.shrink(nodeH);
    }
  }

  shrink(element) {
    this.shrinkMode = !this.shrinkMode;
    element.classList.toggle('shrink');

    // Update banner
    const banner = element.querySelector('.banner .description');
    if (element.classList.contains('shrink')) {
      let count = 0;
      const args = Object.keys(this.data.state).reduce( (txt,key,i) => {
        let msg = this.data.state[key];
        let type = this.data.types[i] || '';
        // Create a new title in the banner including arguments of main widgets
        if (['checkbox','numerical','select','text','textarea'].includes(type)) {
          msg = (typeof msg === 'string' && (msg.length > 40 ||  [...msg].filter(ch => ch === '\n').length > 1)) ? '..' : msg;
          txt = (count === 0) ? txt + msg : txt + ',' + msg; 
          count++;
        }
        return txt;
      },'');
      banner.textContent = `${banner.dataset.desc}(${(args.length === 0)? '..' : args})`;
    }
    else {
      banner.textContent = banner.dataset.desc;
    }
    // Shrink mode is changed (false or true)
    TINNED.graph.updateEdges(element,element.classList.contains('shrink'));

  }
  /*
   * Create Header
   *
   * @author Jean-Christophe Taveau
   */
  createHeader(template,id,data) {
  
    const shrinkExpand = (evt) => {
      // Hide body, footer
      let id = evt.target.parentNode.id.match(/\d+/)[0];
      let node = document.getElementById(`node_${id}`);
      this.shrink(node);
      evt.preventDefault();
    }
    
    const openTools = (preview) => (event) => {
      let nodeElement = WidgetFactory.getNodeElement(event.target);
      NodeCreator.createHamburger(nodeElement,preview);
    }
    
    const removeNode = (_id) => (event) => TINNED.graph.removeNode(_id);

    // M A I N
    
    let nodeH = this.element;

    // Header
    let head = DOM.div(
      `.header.${template.class.replace('.','_').toLowerCase()}`,
      [
        // Banner
        DOM.p('.banner',
        {
          props: {title: `${(template.help) ? template.help : "No Help"}`},
          dataset: {nodeid: id}
        },
        [
          // Part I - Shrink/Expand Button
          DOM.a(`#expand_${id}`,{props: {href: '#'}, on: {click: shrinkExpand}},
          [
            DOM.span('.expandB','▾'),
            DOM.span('.shrinkB','▸')
          ]),
          // Part II - Description/Title
          DOM.span('.description',{dataset:{desc: template.description}},template.description),
          // Part III - Hamburger Menu
          DOM.span('.toolset',
          [
            DOM.div('.flex-cell',
            [
              DOM.a('#close__AT__bars',
              {
                props: {href: '#',title: "Remove..."},
                on: {click: removeNode(id)}           
              },
              [DOM.h('i.fa.fa-times')]
              )
            ])
          ])
        ])
      ]);

    /*
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
    */

    // Add event
    this.draggable( head,dragStartNode,dragOverNode, dragEndNode);

    return head;
  }

  /*
   * Create Shrinkable View of node
   *
   * @author Jean-Christophe Taveau
   */
  createShrinkArea(template,id,data) {

    return DOM.div(`.shrinkdiv.${template.class.replace('.','_').toLowerCase()}`,
    [
      (this.hasInputs)  ? DOM.span('.in_socket',[DOM.h('i.fa.fa-chevron-circle-right')]) : '',
      DOM.p(["\u00A0"]),
      (this.hasOutputs) ? DOM.span('.out_socket',[DOM.h('i.fa.fa-chevron-circle-right')]) : ''
    ]);

    /*
    document.createElement('div');
    shrink.className = 'shrinkdiv'; shrink.classList.add();
    shrink.innerHTML = (this.hasInputs) ? '<span class="in_socket"><i class="fa fa-chevron-circle-right"></i></span>': '';
    shrink.innerHTML += '<p>&nbsp;</p>';
    shrink.innerHTML += (this.hasOutputs) ? '<span class="out_socket"><i class="fa fa-chevron-circle-right"></i></span>' : '';
    return shrink;
    */
  }


  /*
   * Create Body
   *
   * @author Jean-Christophe Taveau
   */
  createBody(template,id,data) {
    // Body
    let body = DOM.div(`#body_${id}.body`);

    // Main content
    NodeCreator.createContent( template.ui,body,this.id, data);

    return body;
  }


  /*
   * Create the footer
   *
   * @author Jean-Christophe Taveau
   */
  createFooter(node,id,data) {
  
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

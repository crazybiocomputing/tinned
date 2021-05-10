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

import {Socket} from './socket.js';
import {WidgetFactory} from './widgetFactory.js';

export class NodeCreator {

  /**
   * Create Content in Node's body
   *
   * @author Jean-Christophe Taveau
   */
  static createContent(template_rows,parent,id, data) {
    let nodeid = id;
    let outputs = 0;
    let inputs = 0;
    template_rows.forEach( (row,index) => {
      if (row.layer !== undefined) {
        let container = document.createElement('div');
        container.className = 'layer';
        container.id = `layer_${index}`;
        NodeFactory.createRows(row.properties,container,nodeid);
        parent.appendChild(container);
        container.style.display = (index === 0) ? 'block': 'none';
      }
      else {
        let container = WidgetFactory.createRow(nodeid,row,data,(e) => {});
/*
        if (row.output !== undefined) {
          container.id = `o_${outputs++}`;
          container.classList.add('output');
        }
        else if (row.input !== undefined) {
          container.id = `i_${inputs++}`;
          container.classList.add('input');
        }
*/
        parent.appendChild(container);
      }
    });
  }

  static createRows(rows,parent,id) {
    let nodeid = id;
    let outputs = 0;
    let inputs = 0;
    rows.forEach( row => {
      let container = NodeFactory.createRow(row,nodeid);
      if (row.output !== undefined) {
        container.id = `o_${outputs++}`;
        // container.classList.add('output');
      }
      else if (row.input !== undefined) {
        container.id = `i_${inputs++}`;
        // container.classList.add('input');
      }
      parent.appendChild(container);
    });
  }


 
  /**
   * Create Hamburger Menu of Node
   *
   * @author Jean-Christophe Taveau
   */
   static createHamburger(parent,preview) {
  
    // Preview Action
      const preview_action = (evt) => {
        let eye = document.querySelector('.hamburger #hamburger__AT__eye');
        let eye_shut = document.querySelector('.hamburger #hamburger__AT__eye-slash');
        if (eye.style.display === 'none') {
          eye.style.display = 'block';
          eye_shut.style.display = 'none';
        }
        else {
          eye.style.display = 'none';
          eye_shut.style.display = 'block';
        }
      }
      
      // Inspect Action
      const inspect_action = (evt) => {
        let popup = document.getElementById('popup');
        popup.className = 'modal';
        popup.style.top = '0px';
        popup.style.left = '0px';
        popup.innerHTML = '<div class="modal-content"><span class="close">&times;</span><h1>Inspect</h1></div>';
      }
      // Help Action
      const help_action = (evt) => {
        let popup = document.getElementById('popup');
        popup.className = 'modal';
        popup.style.top = '0px';
        popup.style.left = '0px';
        popup.innerHTML = '<div class="modal-content"><span class="close">&times;</span><h1>Help</h1></div>';
      }
      // Close Action
      const close_action = (evt) => {
        console.info('Delete Node and Remove connected edges');
      }
      
    const item = (id,icon,title,callback,template) => {
      let item = document.createElement('li');
      let b = WidgetFactory.create(id,'button',template,{},callback);
      b.firstChild.classList = 'toolbar';
      item.appendChild(b);
      return item;
    }
      
    let menu = document.querySelector('#popup');
    menu.className = 'hamburger';
    menu.innerHTML = ''; // Reset
    // Menu Events are already defined in `board.js`
    // Define buttons in menu
    let preview_buttons = [
      {icon: 'eye', name: 'hamburger',title:'Preview - Shortcut: V',fun: preview_action},
      {icon: 'eye-slash', name: 'hamburger',title:'Preview - Shortcut: V',fun: preview_action,display: 'none'}
    ];
    let buttons = [
      {icon: 'binoculars', name: 'hamburger', title:'Inspect - Shortcut: I',fun: inspect_action},
      {icon: 'question-circle-o', name: 'hamburger', title:'Help - Shortcut: H',fun: help_action},
      {icon: 'trash', name: 'hamburger', title:'Delete - Shortcut: X',fun: close_action}
      // {icon: 'times-circle-o', name: 'hamburger', title:'Close - Shortcut: X',fun: close_action}
    ];
    let items = ( preview ? [...preview_buttons,...buttons] : buttons).map( b => item(b.icon,b.icon,b.title,b.fun,b));
    let ulist = document.createElement('ul');
    ulist.append(...items);
    menu.appendChild(ulist);
    menu.style.left = `${parent.offsetLeft + parent.offsetWidth}px`; //`${event.clientX}px`;
    menu.style.top = `${parent.offsetTop}px`; // `${event.clientY}px`;
    menu.style.display = 'block';
  }

  static createInspector(nodeid) {
    let nodeH = document.getElementById(nodeid);
    // Inputs
    let inputs = document.querySelectorAll(`#${nodeid} .input`);
    // Properties
    // let props = document.querySelectorAll(`#${nodeid} .widget`);
    // Outputs
    let outputs = document.querySelectorAll(`#${nodeid} .output`);
  }
  
} // End of class NodeGUI

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
import * as WL from './widgets/index.js' ;


export class WidgetFactory {

  /**
   * Create a Row
   * A row is usually made of a `Label` and a `Widget`. 
   * The label may be optional (ex: Widget collapsible).
   * An input or output socket may be associated with this row.
   *
   * @param {number} node_id - Node ID in DOM
   * @param {object} template_row - Row widgets as described in the template
   * @param {object} data - Row properties containing the various values of the widgets
   * @param {function} callback - Action triggered by a `change` Event on the widget.
   * 
   * @author Jean-Christophe Taveau
   */
  static createRow(node_id, cells, data, callback) {
    // Extract widget type
    // let widgets = Object.keys(cells).filter( prop => ['label','widget'].indexOf(prop.widget) !== -1);
    let numcolumns = cells.length; // filter( type => ['collapsible','input','output','source','name','zip'].indexOf(type) === -1).length;
    let container = document.createElement('div');
    container.className = `row-${numcolumns}`;

    cells.forEach( cell => {
      console.log(cell.widget,cell,data);
      let widget = WidgetFactory.create(node_id,cell.widget,cell,data,callback);
      console.log(widget);
      container.appendChild(widget);
      if (cell.widget === 'input') {
        container.classList.add('in_socket');
      }
      else if (cell.widget === 'output') {
        container.classList.add('out_socket');
      }
    });

    console.log(container);
    return container;
  }
  
  
  static create(id,type,row,data,action_func) {
    let element;
    switch (type) {
      case 'button': element = WL.button(id,row,data,action_func); break;
      case 'canvas': element = WL.canvas(id,row,data,action_func); break;
      case 'checkbox': element = WL.checkbox(id,row,data,action_func); break;
      case 'collapsible': element = WL.collapsible(id,row,data,action_func); break;
      case 'color': element = WL.color(id,row,data,action_func); break;
      case 'file': element = WL.file(id,row,data,action_func); break;
      case 'flowcontrols': element = WL.flowcontrols(id,row,data,action_func); break;
      case 'input': element = WL.input_socket(id,row,data,action_func); break;
      case 'label': element = WL.label(id,row,data,action_func); break;
      case 'numerical': element = WL.numerical(id,row,data,action_func); break;
      case 'password': element = WL.password(id,row,data,action_func); break;
      case 'selectlayer': element = WL.selectlayer(id,row,data,action_func); break;
      case 'select': element = WL.select(id,row,data,action_func); break;
      case 'output': element = WL.output_socket(id,row,data,action_func); break;
      case 'text': element = WL.text(id,row,data,action_func); break;
      case 'textarea': element = WL.textarea(id,row,data,action_func); break;
      default: 
        alert(`Unknown widget ${type}`);
    }
    
    /*
    let container;
    if (type !== 'input' && type !== 'output') {
      container = document.createElement('div');
      container.className = 'flex-cell';
      container.appendChild(element);
    }
    else {
      container = element;
    }
    */
    
    let container = document.createElement('div');
    container.className = 'flex-cell';
    if (Array.isArray(element)) {
      element.forEach( el => container.appendChild(el) );
    }
    else {
      container.appendChild(element);
    }
    return container;
  }
  
  static getNodeElement(child) {
    let el = child;
    while (el.tagName !== 'SECTION' && el.tagName !== 'BODY') {
      el = el.parentNode;
    }
    return el;
  }
  
} // End of class WidgetFactory




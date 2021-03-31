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
 *  along with TWIN.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

'use strict';

import {Socket} from './socket.js';


export class WidgetFactory {

  /**
   * Create a Row
   * A row is usually made of a `Label` and a `Widget`. 
   * The label may be optional (ex: Widget collapsible).
   * An input or output socket may be associated with this row.
   *
   * @param {number} node_id - Node ID in DOM
   * @param {object} template_row - Row widgets as described in the template
   * @param {object} metadata - Row properties containing the various values of the widgets
   * @param {function} callback - Action triggered by a `change` Event on the widget.
   * 
   * @author Jean-Christophe Taveau
   */
  static createRow(node_id, cells, metadata, callback) {
    // Extract widget type
    // let widgets = Object.keys(cells).filter( prop => ['label','widget'].indexOf(prop.widget) !== -1);
    let numcolumns = cells.length; // filter( type => ['collapsible','input','output','source','name','zip'].indexOf(type) === -1).length;
    let container = document.createElement('div');
    container.className = `row-${numcolumns}`;

    cells.forEach( cell => {
      console.log(cell.widget,cell,metadata);
      let widget = WidgetFactory.createWidget(node_id,cell.widget,cell,metadata,callback);
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
  
  
  static createWidget(id,type,row,metadata,action_func) {
    let element;
    switch (type) {
      case 'button': element = WidgetFactory.button(id,row,metadata,action_func); break;
      case 'canvas': element = WidgetFactory.canvas(id,row,metadata,action_func); break;
      case 'checkbox': element = WidgetFactory.checkbox(id,row,metadata,action_func); break;
      case 'collapsible': element = WidgetFactory.collapsible(id,row,metadata,action_func); break;
      case 'file': element = WidgetFactory.file(id,row,metadata,action_func); break;
      case 'flowcontrols': element = WidgetFactory.flowcontrols(id,row,metadata,action_func); break;
      case 'input': element = WidgetFactory.input_socket(id,row,metadata,action_func); break;
      case 'label': element = WidgetFactory.label(id,row,metadata,action_func); break;
      case 'numerical': element = WidgetFactory.numerical(id,row,metadata,action_func); break;
      case 'preview': element = WidgetFactory.canvas(id,row,metadata,action_func); break;
      case 'readonly': element = WidgetFactory.readonly(id,row,metadata,action_func); break;
      case 'selectlayer': element = WidgetFactory.selectlayer(id,row,metadata,action_func); break;
      case 'select': element = WidgetFactory.select(id,row,metadata,action_func); break;
      case 'output': element = WidgetFactory.output_socket(id,row,metadata,action_func); break;
      case 'text': element = WidgetFactory.text(id,row,metadata,action_func); break;
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
    container.appendChild(element);
    return container;
  }
  
  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static button(id,template_row,metadata,action_func) {
    let e = document.createElement('a');
    e.id = `${template_row.name || 'unknown'}__AT__${id}`;
    e.className = 'button';
    if (template_row.icon) {
      let i = document.createElement('i');
      i.className = `fa fa-${template_row.icon}`;
      i.ariaHidden = true;
      e.appendChild(i);
    }
    else {
      e.innerHTML = template_row.button;
    }
    e.setAttribute('href','#');
    e.title = template_row.title || 'No Tooltip';

    if ( template_row.display) {
      e.style.display = template_row.display;
    }
    e.addEventListener('click',action_func);
    return e;
  }
  

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static canvas(id,row,metadata,action_func) {
    // <div class="graphics"><canvas></canvas></div>
    // Check if canvas is already created TODO
    let container = document.createElement('div');
    container.className = 'graphics';
    let cnvs = document.createElement('canvas');
    cnvs.className = 'preview';
    container.appendChild(cnvs);
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static checkbox(id,row,metadata,action_func) {
    let input = document.createElement('input');
    input.id = `${row.name || 'unknown'}__AT__${id}`;
    input.className = "check";
    input.setAttribute("type", "checkbox");
    input.setAttribute('name',row.name || 'unknown');
    input.setAttribute('value',row.checkbox);
    input.checked = row.checkbox;

    // TODO Add event onchanged
    return input;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static collapsible(id,row,metadata,action_func) {
    let container = document.createElement('div');
    let input = document.createElement('input');
    input.id = `collapsible_${id}`;
    input.className = "toggle";
    input.setAttribute("type", "checkbox");
    input.setAttribute('name',row.name || 'unknown');
    input.checked = false;
    container.appendChild(input);
    
    // Create Label
    let label = document.createElement('label');
    label.className = 'lbl-toggle';
    label.setAttribute('for',`collapsible_${id}`);
    label.innerHTML = row.collapsible.label;
    container.appendChild(label);

    let content = document.createElement('div');
    content.className = 'collapsible-content';
    container.appendChild(content);
    row.collapsible.section.forEach( section_row => {
      let widgets_row = WidgetFactory.createRow(id,section_row,undefined);
      content.appendChild(widgets_row);
    });

    return container;
  /*

  <label for="collapsible" class="lbl-toggle">Advanced</label>
  <input class="collapsible toggle" type="checkbox">
  <div class="collapsible-content">

  </div>
  */
  } 
  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static file(id,row,metadata,action_func) {
    // Create File Widget
   let container = document.createElement('div');
    // From MDN
    // https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
    let inp = document.createElement('input');
    inp.id = `${row.name || 'unknown'}__AT__${id}`;
    inp.className = "visually-hidden";
    inp.setAttribute("type", "file");
    
    inp.addEventListener("change", (event) => {
      let files = event.target.files;
      let root = document.querySelector(`#node_${id}`); //WidgetFactory.getNodeElement(event.target);
      root.dataset.file = files[0].name;
      TWIN.args[inp.id] = files[0]; 
      // Update 
      TWIN.graph.update(id); 
      /*
      // Preview
      let c = document.querySelector(`#node_${id} .preview`);
      let ctx = c.getContext("2d");
      ctx.beginPath();
      ctx.arc(100, 75, 50, 0, 2 * Math.PI);
      ctx.stroke(); 
      */
    });
    // <input type="file" id="fileElem" multiple accept="image/*" class="visually-hidden">
    let e = document.createElement('label');
    e.className = 'button';
    e.setAttribute('for',inp.id);
    e.innerHTML = row.title;
    container.appendChild(inp);
    container.appendChild(e);
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static flowcontrols(id,row,metadata,action_func) {
    let buttons = row.flowcontrols;
    let controls = document.createElement('div');
    controls.className = 'flowcontrols';

    [...buttons].forEach ( (b,index) => {
      let button = WidgetFactory.button(id,row);
      button.id = `${b || 'unknown'}__AT__${id}`;
      button.classList.add("square");
      button.classList.add(b);
      button.innerHTML = `<i class="fa fa-${b}"></i>`;
      controls.appendChild(button);
    });

    return controls;
  }

  /*
   * Create an input socket
   *
   * @author Jean-Christophe Taveau
   */
  static input_socket(id,row,metadata,action_func) {
    // Create Input Socket
    let container = document.createElement('div');
    container.className = 'input';
    let socket = new Socket(id,'input',row.name);
    container.appendChild(socket.button);
    return container;
  }
  
  
  /*
   * 
   * @author Jean-Christophe Taveau
   */
  static label(id,row,metadata,action_func) {
    let e = document.createElement('label');
    e.innerHTML = row.title;
    if (row.output === undefined && row.input === undefined) {
      e.innerHTML += '&nbsp;';
    }
    else {
      // e.title = row.input || row.output;
    }

    return e;
  }

  
  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static numerical(id,template_row,metadata,action_func) {

    // Create Numerical
    let input = document.createElement('input');
    input.id = `${template_row.name.split(':')[0] || 'unknown'}__AT__${id}`;
    input.className = "numerical";
    input.setAttribute("type", "text");
    input.setAttribute('name',template_row.name || 'unknown');
    input.setAttribute('minlength',4);
    input.setAttribute('maxlength',40);
    // input.setAttribute('size',10);
    input.setAttribute('value',metadata[template_row.name] || template_row.state);
    TWIN.args[input.id] = metadata[template_row.name] || template_row.state;
    input.addEventListener('input',(event)=> {
      let value = event.srcElement.value;
      event.srcElement.value = /^\d*\.?\d*$/.test(event.srcElement.value) ? value : value.slice(0,-1);
      return false;
    });
    input.addEventListener('blur',(event) => {
      console.info(`Add the ${event.srcElement.value} in queue`);
      TWIN.args[input.id] = +event.srcElement.value;
      // Update 
      TWIN.graph.update(id); 
    });

    // TODO Add event onchanged
    return input;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static readonly(id,row,metadata,action_func) {
    let input = document.createElement('input');
    input.className = "readonly";
    input.readOnly = true;
    input.setAttribute("type", "text");
    input.setAttribute('name',row.name || 'unknown');
    input.setAttribute('minlength',4);
    input.setAttribute('maxlength',40);
    // input.setAttribute('size',10);
    input.setAttribute('value',row.readonly);

    // TODO Add event onchanged
    return input;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static select(id,row,metadata,action_func) {
    let container = document.createElement('div');
    container.className = "select-container";
    let select = document.createElement('select');
    let options = row.items.reduce( (html,item,index) => html + `<option value="${index}">${item}</option>`,'');
    select.innerHTML = options;
    container.appendChild(select);
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static selectlayer(id,row,metadata,action_func) {
    let container = document.createElement('div');
    container.className = "flex-cell select-container";
    let select = document.createElement('select');
    select.id = `selectlayer_${id}`;
    let options = row.selectlayer.reduce( (html,item,index) => html + `<option value="${index}">${item}</option>`,'');
    select.innerHTML = options;
    select.addEventListener("change",displayLayer);
    
    container.appendChild(select);
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static text(id,row,metadata,action_func) {

    let input = document.createElement('textArea');
    input.className = "textarea";
    input.setAttribute("type", "text");
    input.setAttribute('name',row.name || 'unknown');
    input.setAttribute('readonly',true);

    return input;
  }



  /*
   * Create an output socket
   * 
   * @author Jean-Christophe Taveau
   */
  static output_socket(id,row,metadata,action_func) {

    // Create Output Socket
    let container = document.createElement('div');
    container.className = 'output';
    let socket = new Socket(id,'output',row.name);
    container.appendChild(socket.button);

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




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

import {TINNED} from '../../tinned.js';
import * as DOM from '../../dom/dom.js';

/**
   * Widget 
   * @author Jean-Christophe Taveau
   */
 export const numerical = (id,template_row,metadata,action_func) => {

  // Create Numerical
  let [_key,_type] = template_row.name.split(':');
  let input = DOM.input(`#${_key}__AT__${id}.numerical`,
    {
      attrs: { 
        type: "text",
        name: template_row.name || 'unknown',
        minlength: 4,
        maxlength: 40,
        value: metadata[template_row.name] || template_row.state
      },
      dataset: {
        type: _type
      }
    },
    []);

  // Restrict alphabet to numbers and several signs/symbols
  input.addEventListener('input',(event)=> {
    let value = event.target.value;
    event.target.value = /^\d*\.?\d*$/.test(event.target.value) ? value : value.slice(0,-1);
    return false;
  });

  // Only send modification when typing finished
  let typingTimer; //timer identifier

  //user is "finished typing," do something
  const doneTyping = (event) => () => {
    console.info(`Add the ${event.target.value} in queue`);
    // Obsolete - TINNED.args[input.id] = +event.target.value;
    let [key,nid] = input.id.split('__AT__');
    TINNED.graph.getNode(parseInt(nid)).data.state[key] = +event.target.value;
    // Update 
    TINNED.graph.update(id); 
  }

  //on keyup, start the countdown
  input.addEventListener('keyup', (ev) => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping(ev), 500); // 500ms
  });

  //on keydown, clear the countdown 
  input.addEventListener('keydown', () => clearTimeout(typingTimer));

  // TODO Add event onchanged
  return input;
}



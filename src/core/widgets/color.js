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

/**
   * Widget 
   * @author Jean-Christophe Taveau
   */
 export const color = (id,template_row,metadata,action_func) => {

  // Create Numerical
  let input = document.createElement('input');
  input.id = `${template_row.name.split(':')[0] || 'unknown'}__AT__${id}`;
  input.className = "color";
  input.setAttribute("type", "color");
  input.setAttribute('name',template_row.name || 'unknown');
  input.setAttribute('minlength',4);
  input.setAttribute('maxlength',40);
  // input.setAttribute('size',10);
  input.setAttribute('value',metadata[template_row.name] || template_row.state);
  TINNED.args[input.id] = metadata[template_row.name] || template_row.state;
  input.addEventListener('input',(event)=> {
    let value = event.srcElement.value;
    event.srcElement.value = /^\d*\.?\d*$/.test(event.srcElement.value) ? value : value.slice(0,-1);
    return false;
  });
  input.addEventListener('blur',(event) => {
    console.info(`Add the ${event.srcElement.value} in queue`);
    TINNED.args[input.id] = +event.srcElement.value;
    // Update 
    TINNED.graph.update(id); 
  });

  // TODO Add event onchanged
  return input;
}



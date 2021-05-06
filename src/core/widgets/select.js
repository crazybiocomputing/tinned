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
 export const select = (id,row,metadata,action_func) => {
  let container = document.createElement('div');
  container.className = "select-container";
  let select = document.createElement('select');
  select.id = `${row.name.split(':')[0] || 'unknown'}__AT__${id}`;

  let options = row.items.reduce( (html,item,index) => html + `<option value="${item}">${item}</option>`,'');
  select.innerHTML = options;
  container.appendChild(select);

  select.addEventListener('change',(event)=> {
    console.log(event);
    const selectedItem = row.items[event.target.selectedIndex];
    let [key,nid] = select.id.split('__AT__');
    TINNED.graph.getNode(parseInt(nid)).data.state[key] = selectedItem;
    // Update 
    TINNED.graph.update(id); 
    return false;
  });
  return container;
}
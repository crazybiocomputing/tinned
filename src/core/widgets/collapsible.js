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

import {WidgetFactory} from '../widgetFactory.js';

/**
   * Widget 
   * @author Jean-Christophe Taveau
   */
 export const collapsible = (id,row,metadata,action_func) => {
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
  label.innerHTML = row.title;
  container.appendChild(label);

  let content = document.createElement('div');
  content.className = 'collapsible-content';
  container.appendChild(content);
  row.section.forEach( section_row => {
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


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
export const button = (id,template_row,metadata,action_func) => {

  let [_key,_type] = template_row.name.split(':');
  let _button = DOM.h(
    `a#${_key}__AT__${id}.button`,
    {
      attrs: { 
        name: _key || 'unknown',
        href: '#',
        title: template_row.title || 'No Tooltip'
      },
      style: {
        display: template_row.display
      },
      dataset: {
        type: _type
      }
    },
    (template_row.icon) ? [DOM.h(`i.fa.fa-${template_row.icon}`)] : template_row.button);
    
/*
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
*/
  let clicked = false;

  _button.addEventListener('click',(ev) => {
    const element = ev.target;
    let [key,nid] = element.id.split('__AT__');
    TINNED.graph.getNode(parseInt(nid)).data.state[key] = !clicked;
    // Update 
    TINNED.graph.update(id);
  });
  return _button;
}
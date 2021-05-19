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

const newButton = (id,row) => {
  let [_key,_type] = row.name.split(':');
  let _button = DOM.h(
    `a#${_key}__AT__${id}.button`,
    {
      attrs: { 
        name: _key || 'unknown',
        href: '#',
        title: row.title || 'No Tooltip'
      },
      style: {
        display: row.display
      },
      dataset: {
        type: _type
      },
      on: {
        'click': (ev) => {
          let [key,nid] = ev.target.id.split('__AT__');
          TINNED.graph.getNode(parseInt(nid)).data.state[key] = !clicked;
          // Update 
          // TINNED.graph.update(id);
        }
      }
    },
    (row.icon) ? [DOM.h(`i.fa.fa-${row.icon}`)] : row.button
  );
    
  let clicked = false;

  // Add other event(s) if any
  if (row.on) {
    Object.keys(row.on).forEach( eventType => _button.addEventListener(eventType,row.on[eventType]) );
  }
  return _button;
}

/**
   * Widget 
   * @author Jean-Christophe Taveau
   */
export const button = (id,template_row,metadata,action_func) => {

  if (template_row.group) {
    console.log('GROUP');
    return template_row.group.map( b => newButton(id,b));
  }
  else {
    return newButton(id,template_row);
  }
}
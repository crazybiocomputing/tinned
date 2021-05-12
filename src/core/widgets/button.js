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
      },
      on: {
        'click': (ev) => {
          let [key,nid] = ev.target.id.split('__AT__');
          TINNED.graph.getNode(parseInt(nid)).data.state[key] = !clicked;
          // Update 
          TINNED.graph.update(id);
        }
      }
    },
    (template_row.icon) ? [DOM.h(`i.fa.fa-${template_row.icon}`)] : template_row.button
  );
    
  let clicked = false;

  // Add other event(s) if any
  if (template_row.on) {
    Object.keys(template_row.on).forEach( eventType => _button.addEventListener(eventType,template_row.on[eventType]) );
  }
  return _button;
}
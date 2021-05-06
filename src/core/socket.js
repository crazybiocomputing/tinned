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

import {Draggable} from './draggable.js';
import {edgeStart,edgeDrag,edgeEnd} from './dragEdge.js';

export class Socket extends Draggable {
  
  constructor(id,type,name='unknown') {
    super();
    let _button = document.createElement('button');
    // Extract name + type
    let data = name.split(':');
    _button.id = (type === 'input') ? `${data[0]}__IN__${id}` :`${data[0]}__OUT__${id}`;
    _button.dataset.type = data[1] || 'any';
    _button.innerHTML = '<i class="fa fa-chevron-circle-right" aria-hidden="true"></i>';
    this.draggable(_button,edgeStart,edgeDrag,edgeEnd);
    this.socket = _button;
  }
  
  get button() {
    return this.socket;
  }
} // End of class Socket

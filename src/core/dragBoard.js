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

import {TINNED} from '../tinned.js';
import {DRAG} from './common.js';
  


// Pan Event with mouse wheel click
export const translStart = (event) => {
  // Do nothing
  if (DRAG.button !== 2) {
    return false;
  }
  console.log('start',event.which);
  DRAG.button = event.which;
  return document.querySelector('#board');
}

export const translOver = (event) => {
    console.log('middle button',event.which);

  if (DRAG.button !== 2) {
    return true;
  }

  console.log('middle button',DRAG.newDX,DRAG.newDY);
  document.querySelector('#board').style.transform = `
    translate(50%,50%) 
    scale(${TINNED.zoom}) 
    translate(${TINNED.translate.x + DRAG.newDX}px,${TINNED.translate.y + DRAG.newDY}px) 
    translate(-50%,-50%)`;
  TINNED.graph.updateAllEdges();

}

export const translEnd = (event) => {
  // Do nothing
  if (DRAG.button !== 2) {
    return true;
  }
  TINNED.translate.x += DRAG.newDX;
  TINNED.translate.y += DRAG.newDY;
  event.preventDefault();
  }


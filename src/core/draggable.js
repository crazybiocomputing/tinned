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
import {DRAG,getBoardTranslations,getBoundingBox,getClickedCoords,getViewportCenter} from './common.js';

/**
 * Generic version of draggable
 */
export class Draggable {

  draggable(element,funcStart,funcOver,funcEnd) {

    const dragstart = (event) => {

      // centers the tile at (pageX, pageY) coordinates
      const moveAt = (pageX, pageY) => {
        // console.log(orgX,orgY,pageX,pageY,dx,dy,' = ',pageX - orgX + dx,pageY - orgY + dy);
        DRAG.newDX = (pageX  - DRAG.orgX); ///TINNED.zoom; // WRONG
        DRAG.newDY = (pageY  - DRAG.orgY); ///TINNED.zoom;
      }

      const drag_over = (event) => {
        moveAt(event.pageX, event.pageY);
        // Run function
        funcOver(event);

        event.preventDefault();
        return false;
      }
      
      const drag_end = (event) => {
        window.removeEventListener('mousemove', drag_over,false);
        window.removeEventListener('mouseup', drag_end,false);
        // Update Edges
        funcEnd(event);
      }
      

      // M A I N of `dragstart`

      console.log(event);
      
      // Clean popup
      document.getElementById('popup').style.display = 'none';
      
      // Init
      DRAG.button = event.which;
      [TINNED.tx,TINNED.ty] = getBoardTranslations();

      // Step #1
      let dragged = funcStart(event);

      if (dragged === false) {
        return;
      }

      [DRAG.orgX,DRAG.orgY] = getClickedCoords(event); 
      [DRAG.cx,DRAG.cy] = getViewportCenter();
      DRAG.BBox = getBoundingBox(dragged);

      // Move the tile on mousemove
      window.addEventListener('mousemove', drag_over);

      // Drop the tile, remove unneeded handlers
      window.addEventListener('mouseup', drag_end);
      event.preventDefault();

    };

    // M A I N
    if (element.classList) {
      element.classList.add('movable');
    }
    else {
      element.className = 'movable';
    }

    element.addEventListener('mousedown', dragstart,false); 
    element.addEventListener('dragstart', (e) => {e.preventDefault();return false},false); 
    element.addEventListener('dragover', (e) => {return false},false); 
    element.addEventListener('drop', (e) => false,false); 
  }

} // End of class Draggable

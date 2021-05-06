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

/*
   * Functions used for click and drag of `node`
   *
   * @author Jean-Christophe Taveau
   */
  export const dragStartNode = (event) => {
    event.preventDefault();
    let element = event.target;
    while (!element.dataset.nodeid) {
      element = element.parentNode; // Set parent
    }
    let dragged = document.getElementById(`node_${element.dataset.nodeid}`);

    DRAG.node = dragged;
    dragged.style.zIndex = 1000;
    let isShrinked = dragged.classList.contains('shrink');
    console.log(event.target.dataset.nodeid,dragged);
    // Update Edges
    TINNED.graph.updateEdges(dragged,isShrinked);
    return dragged;
  }

  export const dragOverNode = (event) => {
    event.preventDefault();
    let dragged = DRAG.node;
    // Update Node(s)
    /************
    console.info('-----------\n   DRAG\n-----------');
    console.info('TRANSF. ',getMatrix(document.getElementById('board') ) );
    console.info(dragged.getBoundingClientRect().x,dragged.getBoundingClientRect().y);

    console.info(DRAG);
    console.info(TINNED);
    *************/


    // Apply the inverse of transform matrix of `board`
    DRAG.node.style.left = ((DRAG.BBox.x - TINNED.tx)/TINNED.zoom + DRAG.newDX/TINNED.zoom)  + 'px';
    DRAG.node.style.top  = ((DRAG.BBox.y - TINNED.ty)/TINNED.zoom + DRAG.newDY/TINNED.zoom)  + 'px';

    // Update Edges
    let isShrinked = dragged.classList.contains('shrink');
    TINNED.graph.updateEdges(dragged,isShrinked);
  }

  export const dragEndNode = (event) => {
    // Update Edges
    let dragged = DRAG.node;
    dragged.style.zIndex = 1;
    TINNED.graph.updateEdges(dragged,dragged.classList.contains('shrink'));
  }

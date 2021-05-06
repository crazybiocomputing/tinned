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
import {DRAG,getID,xmlns} from './common.js';

/*
  * Functions used for click and drag of `edge`
  *
  * @author Jean-Christophe Taveau
  */
export const edgeStart = (event) => {
  console.log('EDGE start',event.target);
  DRAG.edge = event.target;
  event.preventDefault();
  // Get canvas
  let ctx = document.querySelector('main svg');
  let line = document.createElementNS(xmlns,'line');
  line.dataset.source = event.target.id;
  line.dataset.target = event.target.id;
  line.setAttribute('id',`rubberband`);
  line.setAttribute('stroke-width',2.0);
  line.setAttribute('x1',event.x);
  line.setAttribute('y1',event.y);
  line.setAttribute('x2',event.x);
  line.setAttribute('y2',event.y);
  line.setAttribute("stroke", "#dfdfdf");
  ctx.append(line);
  return event.target;
}

export  const edgeDrag = (event) => {
  console.log('EDGE drag');
  let line = document.getElementById('rubberband');
  line.setAttribute('x2',event.x);
  line.setAttribute('y2',event.y);
  event.preventDefault();
}

export  const edgeEnd = (event) => {
  // Check if target is a complementary node (output/input) to source (input/output) node
  // Add an edge to the graph
  if ( event.target.id.includes('__OUT__') || event.target.id.includes('__IN__') ) {     
    if ( getID(DRAG.edge.id) !== getID(event.target.id) ) {
      if ( DRAG.edge.dataset.type==="any" ||
        event.target.dataset.type==="any" ||
        DRAG.edge.dataset.type === event.target.dataset.type) {
        let one = {
          type:DRAG.edge.id.includes('__OUT__') ? 0 : 1,
          name:DRAG.edge.id.replace(/__.*__/,"@")
        };
        let two = {
          type:event.target.id.includes('__OUT__') ? 0 : 1,
          name:event.target.id.replace(/__.*__/,"@")
        };
        console.log(one,two);
        if (one.type + two.type === 1) {
          const newEdg = TINNED.graph.appendEdge(
            one.type === 0 ? one.name : two.name,
            one.type === 1 ? one.name : two.name
          );
          // Only set one - the last - edge per input.
          TINNED.graph.removeDuplicate(newEdg);
        }
      }
    }
  }   

  // Otherwise delete line
  document.getElementById('rubberband').remove();
  event.preventDefault();
  console.info(TINNED.graph);
}
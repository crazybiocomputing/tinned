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
import {getID, xmlns, xmlns} from './common.js';


const DRAG = {
  BBox:null,
  orgX: 0,
  orgY: 0,
  dx: 0,
  dy: 0,
  newDX: 0,
  newDY: 0
}
  
  
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


  /*
   * Functions used for click and drag of `edge`
   *
   * @author Jean-Christophe Taveau
   */
export const edgeStart = (event) => {
    console.log('EDGE start',event.target);
    DRAG.edge = getID(event.target.id);
    event.preventDefault();
    // Get canvas
    let xmlns=xmlns;
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
    console.log(event.target);
    // Add an edge to the graph
    console.log(DRAG.edge,getID(event.target.id) );
    TINNED.graph.appendEdge(DRAG.edge,getID(event.target.id) );
    // Otherwise delete line
    document.getElementById('rubberband').remove();
    console.log('EDGE end',event.target);
    event.preventDefault();
  }

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

  
  /**
   * Get Transformed coordinates
   */
  const getMatrix = (element) => {
    const parseMatrix = (transform) => transform.split(/\(|,|\)/).slice(1,-1).map( v => parseFloat(v) );

    let transform = window.getComputedStyle(element,null).transform;
    console.log(transform);
    return (transform === 'none') ?  parseMatrix('matrix(1.0, 0.0, 0.0, 1.0, 0.0, 0.0)') : parseMatrix(transform);
  }

  const getBoardTranslations = () => {
    let matrix = getMatrix(document.getElementById('board') );
    return [matrix[4],matrix[5]];
  }

  const getClickedCoords = (event) => [event.pageX,event.pageY];

  const getViewportCenter = () => {
    let cx = document.documentElement.clientWidth/2.0;
    let cy = document.documentElement.clientHeight/2.0;
    return [cx,cy];
  }


  const getBoundingBox = (element) => element.getBoundingClientRect(); 

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
  TINNED.graph.updateAllEdges(document.querySelectorAll('section'));

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


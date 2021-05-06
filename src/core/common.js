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

export const xmlns = "http://www.w3.org/2000/svg";

export const DRAG = {
  BBox:null,
  orgX: 0,
  orgY: 0,
  dx: 0,
  dy: 0,
  newDX: 0,
  newDY: 0
}

/**
 * Return Numerical ID used by graph from node ID (in DOM)
 *
 * @author Jean-Christophe Taveau
 */
export const getID = (nodeid) => nodeid.match(/\d+/)[0];

/**
 * Get Transformed coordinates
 */
export const getMatrix = (element) => {
  const parseMatrix = (transform) => transform.split(/\(|,|\)/).slice(1,-1).map( v => parseFloat(v) );

  let transform = window.getComputedStyle(element,null).transform;
  console.log(transform);
  return (transform === 'none') ?  parseMatrix('matrix(1.0, 0.0, 0.0, 1.0, 0.0, 0.0)') : parseMatrix(transform);
}

export const getBoardTranslations = () => {
  let matrix = getMatrix(document.getElementById('board') );
  return [matrix[4],matrix[5]];
}

export const getClickedCoords = (event) => [event.pageX,event.pageY];

export const getViewportCenter = () => {
  let cx = document.documentElement.clientWidth/2.0;
  let cy = document.documentElement.clientHeight/2.0;
  return [cx,cy];
}


export const getBoundingBox = (element) => element.getBoundingClientRect(); 
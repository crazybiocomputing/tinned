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

/**
 * SVG renderer
 * Jean-Christophe Taveau
 * 2021/02/09
 */
 
 export const svg_renderer = (graph) => {
  
  const root = document.createElementNS("http://www.w3.org/2000/svg",'svg');
  root.setAttribute("viewBox", graph.root.attrs.viewBox);
  root.setAttributeNS(null,'width',graph.root.attrs.width);
  root.setAttributeNS(null,'height',graph.root.attrs.height);
  root.setAttributeNS(null,'fill','#fa1');
  graph.parent.appendChild(root);
  // Draw children
  for (let child of graph.root.children) {
    child.parent = root;
    draw_svg(child);
  }
} 

const draw_svg = (node) => {
  let e = document.createElementNS("http://www.w3.org/2000/svg",node.type);
  node.parent.appendChild(e);
  
  if (node.type === 'text') {
    e.textContent = node.content;
  }
  
  if (node.type === 'g') {
    e.setAttributeNS(null,"transform", `translate(${node.box.x},${node.box.y})`);

    e.textContent = node.content;
  }
  
  for (let key of Object.keys(node.attrs) ) {
    e.setAttributeNS(null,key,node.attrs[key]);
  }

  if (node.children.length > 0) {
    for (let child of node.children) {
      child.parent = e;
      draw_svg(child);
    }
  }
}

/* access the text element you want to measure
var el = document.getElementsByTagName('text')[3];
el.getComputedTextLength(); // returns a pixel integer
*/


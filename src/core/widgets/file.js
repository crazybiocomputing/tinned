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
   * Widget 
   * @author Jean-Christophe Taveau
   */
 export const file = (id,row,metadata,action_func) => {
  // Create File Widget
 let container = document.createElement('div');
  // From MDN
  // https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
  let inp = document.createElement('input');
  inp.id = `${row.name || 'unknown'}__AT__${id}`;
  inp.className = "visually-hidden";
  inp.setAttribute("type", "file");
  
  inp.addEventListener("change", (event) => {
    let files = event.target.files;
    let root = document.querySelector(`#node_${id}`); //WidgetFactory.getNodeElement(event.target);
    root.dataset.file = files[0].name;
    TINNED.args[inp.id] = files[0]; 
    // Update 
    TINNED.graph.update(id); 
    /*
    // Preview
    let c = document.querySelector(`#node_${id} .preview`);
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.stroke(); 
    */
  });
  // <input type="file" id="fileElem" multiple accept="image/*" class="visually-hidden">
  let e = document.createElement('label');
  e.className = 'button';
  e.setAttribute('for',inp.id);
  e.innerHTML = row.title;
  container.appendChild(inp);
  container.appendChild(e);
  return container;
}
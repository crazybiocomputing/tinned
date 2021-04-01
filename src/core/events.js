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
   * Events
   */
  const shrinkExpand = (evt) => {
    console.log('SHRINK/EXPAND');

    // Hide body, footer
    let id = evt.target.parentNode.id.match(/\d+/)[0];
    let node = document.getElementById(`node_${id}`);
    console.log(evt.target.parentNode.id,id);
    console.log(node);
    node.classList.toggle('shrink');

    // Shrink mode is true
    TINNED.graph.updateEdges(node,node.classList.contains('shrink'));
    console.log(node);
    evt.preventDefault();

  }

  const displayLayer = (evt) => {
    console.log(evt.target.value,evt.target.id);
    let id = evt.target.id.match(/\d+/)[0];
    console.log(id);
    // Pass #1
    let layers = document.querySelectorAll(`#body_${id} .layer`);
    layers.forEach( (layer) => layer.style.display = (layer.id === `layer_${evt.target.value}`) ?  "block" : "none");
    // Pass #2
    layers = document.querySelectorAll(`#body_${id} .outputs .layer`);
    layers.forEach( (layer) => layer.style.display = (layer.id === `layer_${evt.target.value}`) ?  "block" : "none");
    console.log(layers);
  }




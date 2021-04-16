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

import {TINNED} from '../../tinned.js';
import * as DOM from '../../dom/dom.js';

/**
 * Widget File
 * @author Jean-Christophe Taveau
 */
export const file = (id,row,metadata,action_func) => {

  // Event
  const setFile = (event) => {
    let files = event.target.files;
    let root = document.querySelector(`#node_${id}`);
    root.dataset.file = files[0].name;
    // Update / notify
    let node = TINNED.graph.nodes.find( n => n.id === id);
    node.data.state._file = files[0]; 
    TINNED.graph.update(node);
  }

  // Create File Widget
  // From MDN
  // https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications

  const [_var,_type] = row.name.split(':');
  const input_id = `${_var || 'unknown'}__AT__${id}`;

  return DOM.h('div',
    [
      DOM.input(
        `#${input_id}.visually-hidden`,
        {
          attrs: {type: "file"},
          on: {change: setFile}
        },
        []
      ),
      DOM.h('label.button',{attrs: {for: input_id}},row.title)
    ]
  );

}
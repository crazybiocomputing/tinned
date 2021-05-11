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

import {of} from '../../callbags/callbag-of.js';
import {share} from '../../callbags/callbag-share.js';

const objectNew = (node) => (stream) => {
  // Params
  if (node.data.state.save) {
    // Update code from textarea
    node.data.state.data = document.querySelector(`#data__AT__${node.id}`).value;
    node.data.state.save = false;
  }
  let obj = new Function( `return ${node.data.state?.data || '{}'}`)();
  // Set multicast source$ in stream
  stream.setCallbags(`value@${node.id}`,share(of(obj)));
  // Return stream
  return stream;
}

export const object_ui =  {
  id: "BASX_OBJECT",
  class: "primitive",
  description: "Object",
  tags: ["dictionary"],
  help: ["Object"],
  func: objectNew,
  ui: [
    [
      {widget:"label",title: "Result"}, 
      {widget: "output",name:"value:any"}
    ],
    [
      {widget:"button", state: "",icon: 'floppy-o',title: 'Save',name: "save:boolean"}
    ],
    [
      {widget:"textarea", state: "{\n  project: 'tinned',\n  lang: 'JS'\n}",name: "data:object"}
    ]
  ]
};
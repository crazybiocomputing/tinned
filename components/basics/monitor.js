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

import {subscribe} from '../../callbags/callbag-subscribe.js';

const monitor = (node) => (stream) => {
  // Get source
  let source$ = stream[node.sources[0]];
  const textarea = document.querySelector(`#node_${node.id} textarea`);

  subscribe({
    next: val => {
      // Update node
      if (typeof val === 'object') {
        val = JSON.stringify(val);
      }
      node.data.state.log += val + '\n';
      textarea.innerHTML = node.data.state?.log;
    },
    complete: () => {
      node.data.state.log += 'Completed!\n';
      textarea.innerHTML = node.data.state?.log;
    },
    error: err => alert( err )
  })(source$);
 
  return stream;
}

/*
,
    error: (err) => alert(err),
    complete: () => {
      node.data.state.log += 'Completed!\n';
      textarea.innerHTML = node.data.state?.log;
    }
  }
 */
export const monitor_ui = {
  id: "BASX_MONITOR",
  class: "consumer",
  description: "Monitor",
  tags: ["console","display","log","print","show"],
  help: ["Data subscriber"],
  func: monitor,
  ui: [
    [
      {widget: "input",name: "datain:any"},
      {widget:"label",title: "Data"}
    ],
    [
      {widget:"textarea", state: "",name: "log:string"}
    ],
    [
      {widget:'button', state: 0, button:'Refresh <i class="fa fa-refresh"></i>',name: 'refresh:string'}
    ]
  ]
};
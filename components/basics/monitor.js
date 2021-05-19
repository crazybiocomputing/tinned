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

import {pipe} from '../../callbags/callbag-pipe.js';
import {fromEvent} from '../../callbags/callbag-from-event.js';
import {filter} from '../../callbags/callbag-filter.js';
import {merge} from '../../callbags/callbag-merge.js';
import {subscribe} from '../../callbags/callbag-subscribe.js';

const monitor = (node) => (stream) => {
  // Get source...
  let source$ = stream.getCallbags(node)[0];
  const textarea = document.querySelector(`#node_${node.id} textarea`);
  const button = document.querySelector(`#refresh__AT__${node.id}`);

  const refreshLog = () => {
    if (node.data.state.refresh) {
      // Update code from textarea
      node.data.state.log = ''; // Reset
      node.data.state.refresh = false;
      textarea.innerHTML = '';
    }
  }

  const mergeWith = (...newSources) => current => merge(current, ...newSources);

  const dispose = pipe(
    source$,
    mergeWith(fromEvent(button,'click')),
    filter( val => {
      if (val !== undefined && val.target && val.target.id.includes('refresh')) {
        refreshLog();
        return false;
      }
      return true;
    }),
    subscribe({
      next: val => {
        // Update node
        if (typeof val === 'object') {
          val = JSON.stringify(val,null,2);
        }
        node.data.state.log += val + '\n';
        textarea.innerHTML = node.data.state?.log;
      },
      // Never reached because of merge with `click` button that never stops...
      complete: () => {
        node.data.state.log += 'Completed!\n';
        textarea.innerHTML = node.data.state?.log;
      },
      error: err => alert( err )
    })
  );
 
  // Store unsubscribe...
  stream.disposals.push(dispose);

  return stream;
}

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
      {widget:'button', state: false, icon:'refresh',title: 'Refresh',name: 'refresh:boolean'}
    ],
    [
      {widget:"textarea", state: "",attrs: {readonly:true}, name: "log:string"}
    ],

  ]
};

/*
Other possible syntaxes ....
ui: [
  {
    widget:"textarea", 
    name: "log:string", 
    state: '',
    attrs: {readonly:true}
  }
]

  DOM.div('.insocket',
    {},
    [
      DOM.button(
        '#datain.movable',
        {
          dataset: {type: any}
        },
        [DOM.h('i.fa.fa-chevron-circle-right')]
      )
    ]
  )
]

*/
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

import {StreamBag} from '../../src/streamBag.js';
import {pipe} from '../../callbags/callbag-pipe.js';
import {tap} from '../../callbags/callbag-tap.js';
import {merge} from '../../callbags/callbag-merge.js';
import { fromEvent } from '../../callbags/callbag-from-event.js';
import {filter} from '../../callbags/callbag-filter.js';
import {flatMap} from '../../callbags/callbag-flat-map.js';
import {forEach} from '../../callbags/callbag-for-each.js';
import { fromIter } from '../../callbags/callbag-from-iter.js';
import { count } from '../../callbags/callbag-count.js';
import { map } from '../../callbags/callbag-map.js';

const toIterFunc = (node) => (stream) => {
  // Get source...
  let source$ = stream.getCallbag(`datain@${node.id}`);
  // Params
  const checkbox = document.querySelector(`#hasindex__AT__${node.id}`);
  let hasIndex = node.data.state?.hasIndex || false;
  // Buffer stream
  let buf;
  let innerStream$;

  const stream$ = pipe(
    merge(source$,fromEvent(checkbox,'click')),
    filter(ev_or_val => {
      const isEvent = (ev_or_val !== undefined && ev_or_val?.target?.id);
      if (isEvent) {
        node.data.state.hasIndex = checkbox.checked;
        hasIndex = node.data.state.hasIndex;
        return false;
      }
      return true;
    }),
    forEach(arr => {
      console.info(arr);
      // InnerStream$
      let innerStream = StreamBag.from(stream); // Create inner from outer stream
      // innerStream.setCallbag(fromIter(arr))
      stream.current = innerStream;
      innerStream.setCallbags(`stream@${node.id}`,fromIter(arr));
    })
    /*
    map( arr => {
      let result;
      // InnerStream$
      // let innerStream = StreamBag.from(stream); // Create inner from outer stream
      // innerStream.setCallbag(fromIter(arr))
      pipe(
        fromIter(arr),
        count(),
        forEach(x => result = `COUNT: ${x}`)
      );
      return result;
    })
    */
  );

  // Return stream
  return stream;
}

export const toiterable_ui =   {
  id: "BASX_TOITERABLE",
  class: "programming",
  description: "ToIterable",
  tags: ["cluster","series","group"],
  func: toIterFunc,
  ui: [
    [
      {widget:"label",title: "Item"}, 
      {widget: "output",name:"stream:any"}
    ],
    [
      {widget:"label",title: "With&nbsp;Index"}, 
      {widget: "checkbox",state: false, name:"hasindex:any"}
    ],
    [
      {widget: "input",name: "datain:any"},
      {widget:"label",title: "Array"}
    ],
  ]
};


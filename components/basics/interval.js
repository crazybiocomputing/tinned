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

import {Observable} from '../../src/core/observable.js';

const interval = (node) => (stream) => {
  let period = node.data.state.period;
  // Create observable
  const obs = new Observable(observer => {
      let counter = 0;
      const id = setInterval(() => observer.next(++counter), period);
      return () => {
        console.log('Teardown');
        clearInterval(id);
      }
    });
  
  // Set in stream
  node.targets.forEach( key => {
    stream[key] = obs;
  });
  // Return stream
  return stream;
}

export const interval_ui =   {
  id: "PROG_INTERVAL",
  class: "programming",
  description: "interval",
  tags: ["time","timeout","asynchronous"],
  func: interval,
  ui: [
    [
      {widget:"label",title: "Data"}, 
      {widget: "output",name:"stream:stream"}
    ],
    [
      {widget: "label", title: "Interval(ms)"},
      {widget: "numerical", state: 500,name: "period:number"}
    ]
  ]
};


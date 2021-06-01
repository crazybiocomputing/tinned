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

import {interval} from '../../callbags/callbag-interval.js';
import {fromEvent} from '../../callbags/callbag-from-event.js';
import {takeUntil} from '../../callbags/callbag-take-until.js';
import {share} from '../../callbags/callbag-share.js';
import {pipe} from '../../callbags/callbag-pipe.js';

const intervalFunc = (node) => (stream) => {

  // Get param
  const numericalChanged$ = document.querySelector(`#node_${node.id} input`);
  let period = node.data.state.period

  // Create multicast callbag
  const source$ = pipe(
    interval(period),
    takeUntil(fromEvent(numericalChanged$,'focus')),
    share
  );
  
  // Set in stream
  stream.setCallbags(`stream@${node.id}`,source$);
  // Return stream
  return stream;
}

export const interval_ui =   {
  id: "PROG_INTERVAL",
  class: "producer",
  description: "Interval",
  tags: ["periodic","time","timeout","asynchronous"],
  func: intervalFunc,
  ui: [
    [
      {widget:"label",title: "Data"}, 
      {widget: "output",name:"stream:number"}
    ],
    [
      {widget:"label",title: "Multicast"}, 
      {widget: "checkbox", state: false,name: "multicast:boolean"}
    ],
    [
      {widget:'button', state: false, icon:'play',title: 'Play',name: 'play:boolean'},
      {widget:'button', state: false, icon:'stop',title: 'Stop',name: 'stop:boolean'},
    ],
    [
      {widget: "label", title: "Interval(ms)"},
      {widget: "numerical", state: 1000,name: "period:number"}
    ]
  ]
};


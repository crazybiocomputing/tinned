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

import {random} from '../../callbags/callbag-random.js';
import {fromEvent} from '../../callbags/callbag-from-event.js';
import {takeUntil} from '../../callbags/callbag-take-until.js';
import {map} from '../../callbags/callbag-map.js';
import {concatMap} from '../../callbags/callbag-concat-map.js';
import {share} from '../../callbags/callbag-share.js';
import {pipe} from '../../callbags/callbag-pipe.js';


// Global
let linear_count = -1;
// PDFs Implementations
const uniform = () => Math.random();
const linear = () => ++linear_count;
const exponential = () => Math.random(); // TODO
const gaussian = () => 0.5; // TODO

const pdfFuncs = {Uniform: uniform,Normal:gaussian,Exp:exponential,Linear:linear};

const randomFunc = (node) => (stream) => {
  // Get param
  const play = document.querySelector(`#play__AT__${node.id}`);
  const stop = document.querySelector(`#stop__AT__${node.id}`);
  // Get period
  let period = node.data.state.period;

  // Init
  node.data.state.play = false;

  // Source(s)
  const stopWithClick$ = pipe(
    fromEvent(stop,'click'),
    map(ev => {
      // Update button
      play.style.display = 'inline-block';
      stop.style.display = 'none';
      // Reset some PDFs parameters
      linear_count = -1;
      return true;
    })
  )

  const startWithClick$ =  pipe(
    fromEvent(play,'click'),
    map(ev => {
      // Update button
      play.style.display = 'none';
      stop.style.display = 'inline-block';
      return true;
    })
  )

  // Create multicast callbag
  const source$ = pipe(
    random(period,pdfFuncs[node.data.state.pdf]),
    takeUntil(stopWithClick$),
    share
  );
  
  // Main stream
  const stream$ = pipe(
    startWithClick$,
    concatMap(() => source$) 
  );

  // Set in stream
  stream.setCallbags(`stream@${node.id}`,stream$);
  // Return stream
  return stream;
}

export const random_ui =   {
  id: "BASX_RANDOM",
  class: "producer",
  description: "Random",
  tags: ["gaussian","density","pdf","uniform","noise"],
  func: randomFunc,
  ui: [
    [
      {widget:"label",title: "Data"}, 
      {widget: "output",name:"stream:number"}
    ],
    [
      {
        widget:'button', 
        group:[
          {widget:'button', state: false, icon:'play',title: 'Play',name: 'play:boolean'},
          {widget:'button', state: false, icon:'stop',title: 'Stop',name: 'stop:boolean',display:'none'},          
        ]
      },
    ],
    [
      {widget: "label", title: "Interval&nbsp;(ms)"},
      {widget: "numerical", state: 1000,name: "period:number"}
    ],
    [
      {widget: "label", title: "PDF",tooltip: "Probability Density Function"},
      {widget: "select", state: 'Uniform', name: "pdf:string", "items": ["Uniform","Normal","Exp","Linear"]},
    ]
  ]
};


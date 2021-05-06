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

import {append,attr,bandwidth,newNode,newGeometry,scaleBand,scaleLinear,show} from './graphics.js';
import {axisBottom,axisLeft,getAxisBox,heckbert} from './axis.js';
import {svg_renderer} from './renderer/svg_renderer.js';

/**
 * Simple barchart
 * Jean-Christophe Taveau
 * 2021/02/09
 */
export const _barchart = (graphics,data,layout) => {
  // Create graph
  const graph = {
    parent: graphics,
    renderer: svg_renderer,
    root: newNode('svg')
  }
  
  attr(graph.root,'width',layout.width);
  attr(graph.root,'height',layout.height);
  
  const w = graph.root.attrs.width  - layout.margin[1] - layout.margin[3];
  const h = graph.root.attrs.height - layout.margin[0] - layout.margin[2];

  let area = append(graph.root,'g');
  area.box = {x: layout.margin[3], y: layout.margin[0], w: w, h: h};
  attr(area,'id','area');
  
  // Generate labels
  const x_labels = data[0].x;
  const y_labels = heckbert(0,Math.max(...data[0].y));
  const axisBox = getAxisBox(y_labels);
  
  // Bottom X- axis 
  const x_axis = axisBottom(x_labels,axisBox.w,h - axisBox.h,w - axisBox.w,axisBox.h);
  area.children.push(x_axis);
  
  // Left Y-axis
  const y_axis = axisLeft(y_labels,axisBox.w,0,w,h - axisBox.h);
  area.children.push(y_axis);

  // Create bars geometries from data
  const ww = w - axisBox.w;
  const hh = h - axisBox.h;
  let geom = newGeometry(0,0,ww,hh);
  geom.width = bandwidth([0,ww],data[0].x);
  geom.height = scaleLinear([0,hh],[0,Math.max(...data[0].y)],data[0].y);
  geom.x = scaleBand(geom.width,data[0].x);
  geom.y = geom.height.map( hi => hh - hi);
  
  // Main panel
  const drawArea = append(area,"g");
  drawArea.box.x = axisBox.w;
  drawArea.box.w = ww;
  drawArea.box.h = hh;
  attr(drawArea,'id','drawArea');
  
  // Create the bars
  for (let i in geom.x) {
    let bar = append(drawArea,"rect");
    attr(bar,'x',geom.x[i] + geom.pad[3]);
    attr(bar,'y',geom.y[i] + geom.pad[0]);
    attr(bar,'width',geom.width[i] - geom.pad[1] - geom.pad[3]);
    attr(bar,'height',geom.height[i]  - geom.pad[0] - geom.pad[2]);
    attr(bar,'color',layout.bar.color);
  }

  // Update size
  // attr(graph.root,'viewBox',`0 0 ${layout.width} ${layout.height + x_axis.box.h}`);
  // Render
  show(graph);
}

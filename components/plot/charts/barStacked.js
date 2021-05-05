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
 * Simple barchart
 * Jean-Christophe Taveau
 * 2021/02/09
 */

const zip = (...rows) => rows[0].map((_,i) => rows.map(row => row[i]));
const sum = (...rows) => rows.map( row => row.reduce( (s,v) => s + v,0));

const barStacked = (parent_id,data,layout,element='svg') => {
  // Create graph
  const graph = {
    parent: document.getElementById(parent_id),
    renderer: (element === 'svg') ? svg_renderer : canvas_renderer,
    root: newNode(element)
  }
  
  attr(graph.root,'width',layout.width);
  attr(graph.root,'height',layout.height);
  
  const w = graph.root.attrs.width  - layout.margin[1] - layout.margin[3];
  const h = graph.root.attrs.height - layout.margin[0] - layout.margin[2];

  let area = append(graph.root,'g');
  area.box = {x: layout.margin[3], y: layout.margin[0], w: w, h: h};
  attr(area,'id','area');
  
  // Totals
  const totals = sum(...zip(...data.map( d => d.y) ) );
  console.log(totals);
  
  // Generate labels
  const x_labels = data[0].x;
  const y_labels = heckbert(0,Math.max(...totals));
  const axisBox = getAxisBox(y_labels);
  
  // Bottom X- axis 
  const x_axis = axisBottom(x_labels,axisBox.w,h - axisBox.h,w - axisBox.w,axisBox.h);
  area.children.push(x_axis);
  
  // Left Y-axis
  const y_axis = axisLeft(y_labels,axisBox.w,0,w,h - axisBox.h);
  area.children.push(y_axis);

    
  const ww = w - axisBox.w;
  const hh = h - axisBox.h;
  
  // Main panel
  const drawArea = append(area,"g");
  drawArea.box.x = axisBox.w;
  drawArea.box.w = ww;
  drawArea.box.h = hh;
  attr(drawArea,'id','drawArea');

  const widths = bandwidth([0,ww],data[0].x);
  const zeros = new Array(widths.length).fill(0);
  const x = scaleBand(widths,data[0].x);
  let previous = newGeometry(zeros,zeros,widths,zeros);
  for (let i in data) {

    // Create bars geometries from trace
    let geom = newGeometry(zeros,zeros,ww,hh);
    geom.width = widths;
    geom.height = scaleLinear([0,hh],[0,Math.max(...totals)],data[i].y);
    geom.x = x;
    geom.y = geom.height.map( (hj,j) => hh - ( hj + previous.box.y[j] + previous.box.h[j]) );
    
    const colors = [
      '#67001f','#b2182b','#d6604d','#f4a582','#fddbc7',
      '#f7f7f7','#d1e5f0','#92c5de','#4393c3','#2166ac','#053061'
    ];
    
    // Layer
    let layer = append(drawArea,"g");
    attr(layer,'id',`layer${i}`);
    // Create the bars
    for (let j in geom.x) {
      let bar = append(layer,"rect");
      attr(bar,'x',geom.x[j] + geom.pad[3]);
      attr(bar,'y',geom.y[j] + geom.pad[0]);
      attr(bar,'width',geom.width[j] - geom.pad[1] - geom.pad[3]);
      attr(bar,'height',geom.height[j]  - geom.pad[0] - geom.pad[2]);
      attr(bar,'color',colors[i]);
    }
    previous = geom;
  }

  // Render
  show(graph);

}




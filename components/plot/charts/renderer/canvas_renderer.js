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
 * Canvas renderer
 * Jean-Christophe Taveau
 * 2021/02/09
 */
 export const canvas_renderer = (graph) => {
  const canvas = document.createElement('canvas');
  graph.parent.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  canvas.width = graph.root.attrs.width + 50;
  canvas.height = graph.root.attrs.height;

  // Draw children
  for (let child of graph.root.children) {
    child.parent = graph.root;
    draw_canvas(ctx,child);
  }
} 

const draw_canvas = (ctx,node) => {
  switch (node.type) {
  case 'g'   : drawGroup(ctx,node); break;
  case 'rect': drawRect(ctx,node); break;
  case 'line': drawLine(ctx,node); break;
  case 'text': drawText(ctx,node); break;
  case 'path': drawPath(ctx,node); break;
  }

  if (node.children.length > 0) {
    for (let child of node.children) {
      child.parent = node;
      draw_canvas(ctx,child);
    }
  }
}

const drawGroup = (ctx,node) => {
  node.tx = node.parent.tx + node.box.x;
  node.ty = node.parent.ty + node.box.y;
}

const drawRect = (ctx,node) => {
  const params = node.attrs;
  ctx.fillStyle = params.color || "green";
  ctx.fillRect(node.parent.tx + params.x,node.parent.ty + params.y,params.width,params.height);
}

const drawText = (ctx,node) => {
  const ALIGN = {middle:"center",start: "start",end: "end"};
  const params = node.attrs;
  ctx.font = `${params['font-size']}px ${params['font-family']}`;
  ctx.textAlign = ALIGN[params['text-anchor'] ];
  ctx.fillStyle = params.fill || "green";
  ctx.fillText(node.content,node.parent.tx + params.x,node.parent.ty + params.y);
}

const drawLine = (ctx,node) => {
  const params = node.attrs;
  ctx.fillStyle = params.color || "green";
  ctx.beginPath();
  ctx.moveTo(node.parent.tx + params.x1,node.parent.ty +params.y1);
  ctx.lineTo(node.parent.tx + params.x2,node.parent.ty +params.y2);
  ctx.stroke();
}

const drawPath = (ctx,node) => {
  const params = node.attrs;
  // Parse
  const words = params.d.split(/(?=[A-Z])/);
  console.log(words);
  ctx.beginPath();
  for (let w of words) {
    let x = +w.slice(1).split(/[ ,]/)[0];
    let y = +w.slice(1).split(/[ ,]/)[1];
    console.log(x,y);
    if (w[0] === 'M') {
      ctx.moveTo(node.parent.tx + x,node.parent.ty + y);
    }
    else if (w[0] === 'L') {
      ctx.lineTo(node.parent.tx + x,node.parent.ty + y);
    }
  }
  ctx.stroke();
}

/*
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');
  var text = ctx.measureText('foo'); // objet TextMetrics
  text.width; // 16;
}
*/

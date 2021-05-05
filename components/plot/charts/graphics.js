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
 * Graph and Nodes
 * Jean-Christophe Taveau
 * 2021/02/09
 */

/**
 * Nodes
 */
export const newNode = (type) => ({
  type: type,
  attrs: {},
  box: {x:0,y:0,w:0,h:0},
  tx: 0,
  ty: 0,
  children: []
});

export const attr = (primitive,key,value) => {
  primitive.attrs[key] = value;
  return primitive;
}

export const append = (parent, type) => {
  const child = newNode(type)
  parent.children.push(child);
  return child;
}

export const show = (graph) => graph.renderer(graph);

/**
 * Geometry
 */
export const newGeometry = (x,y,w,h) => ({
  box: {
    x: x,
    y: y,
    w: w,
    h: h,
  },
  pad : [0,2,0,2]
});

export const bandwidth = (minmax,data) => Array.from({length: data.length}, _ => (minmax[1] - minmax[0]) / data.length);

export const scaleBand = (bw,data) => Array.from({length: data.length}, (_,i) => i * bw[i]);

export const scaleLinear = (minmax,range,data) => {
  const k = minmax[1] - minmax[0];
  const m = range[0];
  const Mm = range[1];
  return data.map( d => Math.floor(minmax[0] + (d - m)/Mm * k) );
}

export const padding = (pad) => (geom) => {
  geom.padding = pad;
  return geom;
}



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

import {append,attr,newNode} from './graphics.js';
/**
 * Axis
 * Jean-Christophe Taveau
 * 2021/02/09
 */

const TICK_SIZE = 6.0;


/**
 *  Estimate Dimension Axis
 */
export const getAxisBox = (labels,font={size: 10, family: 'sans-serif'}) => {
  let box = {x: 0, y: 0, w: 0, h: 0};
  
  const maxWord = labels.reduce( (M,lab) => (M.toString().length < lab.toString().length) ? lab : M,'');
  let e = document.createElement('canvas');
  const ctx = e.getContext("2d");
  ctx.font = `${font.size}px ${font.family}`;
  const maxlen = ctx.measureText(maxWord).width;
  box.w = maxlen + TICK_SIZE;
  box.h = font.size + TICK_SIZE;
  console.log(box);
  return box;
}

/**
 *  Bottom Axis
 */
export const axisBottom = (labels,x,y,w,h,font={size: 10, family: 'sans-serif'}) => {

  const panel = newNode('g');
  panel.box = {
    x: x,
    y: y,
    w: w,
    h: h
  };
  attr(panel,'stroke','black');
  attr(panel,'stroke-width',1);
  let axis = append(panel,'path');
  attr(axis,'d',`M0.5 0.5 L${panel.box.w - 0.5} 0.5`);

  const shiftX = panel.box.w / (labels.length);

  for (let i in labels) {
    const sh = shiftX * i + shiftX / 2.0;
    let g = append(panel,'g');
    let tick = append(g,'line');
    attr(tick,'x1', sh);
    attr(tick,'y1',0 );
    attr(tick,'x2',sh);
    attr(tick,'y2', TICK_SIZE);

    let text = append(g,'text');
    text.content = labels[i];
    attr(text,'x',sh);
    attr(text,'y', font.size + font.size/2);
    attr(text,'stroke','none');
    attr(text,'fill','black');
    attr(text,'text-anchor','middle'),
    attr(text,'font-size',font.size);
    attr(text,'font-family',font.family);
  }
  return panel;
}

/**
 *  Bottom Axis
 */
export const axisTop = (labels,x,y,w,h,font={size: 10, family: 'sans-serif'}) => {

  const panel = newNode('g');
  panel.box = {
    x: x,
    y: y,
    w: w,
    h: h
  };
  attr(panel,'stroke','black');
  attr(panel,'stroke-width',1);
  let axis = append(panel,'path');
  attr(axis,'d',`M0.5,0.5 L${panel.box.w - 0.5},0.5`);

  const shiftX = panel.box.w / (labels.length);

  for (let i in labels) {
    const sh = shiftX * i + shiftX / 2.0;
    let g = append(panel,'g');
    let tick = append(g,'line');
    attr(tick,'x1', sh);
    attr(tick,'y1',0);
    attr(tick,'x2',sh);
    attr(tick,'y2',TICK_SIZE);

    let text = append(g,'text');
    text.content = labels[i];
    attr(text,'x',sh);
    attr(text,'y',font.size + font.size/2);
    attr(text,'stroke','none');
    attr(text,'fill','black');
    attr(text,'text-anchor','middle'),
    attr(text,'font-size',font.size);
    attr(text,'font-family',font.family);
  }
  return panel;
}

/**
 *  Left Axis
 */
export const axisLeft = (labels,x,y,w,h,font={size: 10, family: 'sans-serif'}) => {
  const panel = newNode('g');
  panel.box = {
    x: x,
    y: y,
    w: w,
    h: h
  };
  
  // TODO Estimate label max width

  
  attr(panel,'stroke','black');
  attr(panel,'stroke-width',1);
  let axis = append(panel,'path');
  attr(axis,'d',`M0.5 0.5 L0.5 ${panel.box.h + 0.5}`);

  const shiftY = panel.box.h / (labels.length - 1);
  for (let i in labels) {
    let g = append(panel,'g');
    let tick = append(g,'line');
    attr(tick,'x1',0.0);
    attr(tick,'y1',panel.box.h - shiftY * i );
    attr(tick,'x2',-TICK_SIZE);
    attr(tick,'y2', panel.box.h - shiftY * i);

    let text = append(g,'text');
    text.content = labels[i];
    attr(text,'x',- 6.0);
    attr(text,'y',panel.box.h - shiftY * i + font.size / 2.0);
    attr(text,'stroke','none');
    attr(text,'fill','black');
    attr(text,'text-anchor','end'),
    attr(text,'font-size',font.size);
    attr(text,'font-family',font.family);
  }
  // Calc bounding box
  return panel;
}

/**
 * Calculate and update values for tick spacing and nice
 * minimum and maximum data points on the axis.
 */
export const heckbert = (domainMin, domainMax, maxTicks = 10) => {
    /*
     * Returns a "nice" number approximately equal to range Rounds
     * the number if round = true Takes the ceiling if round = false.
     *
     * @param {number} localRange - the data range
     * @param {boolean} round - If true round the data minimum down and the data maximum up. Loose labeling
     * @returns {number} A "nice" number to be used for the data range
     */
    const niceNum = (localRange, round) => {

      // exponent of localRange 
      let exponent = Math.floor(Math.log10(localRange));
      
      // fractional part of localRange between 1 to 10
      let fraction = localRange / Math.pow(10, exponent);
      
      // nice, rounded fraction
      let niceFraction; 
      let QF_round = [{q: 1.5, f: 1},{q: 3, f: 2},{q: 7, f: 5},{q: Number.MAX_VALUE, f: 10}];
      
      if (round) {
        if (fraction < 1.5) {
          niceFraction = 1;
        }
        else if (fraction < 3) {
          niceFraction = 2;
        }
        else if (fraction < 7) {
          niceFraction = 5;
        }
        else {
          niceFraction = 10;
        }
        niceFraction = QF_round.filter( (v) => fraction < v.q)[0].f;
      }
      else {
        if (fraction <= 1)
          niceFraction = 1;
        else if (fraction <= 2)
          niceFraction = 2;
        else if (fraction <= 5)
          niceFraction = 5;
        else
          niceFraction = 10;
      }

      return niceFraction * Math.pow(10, exponent);
    }
    
    ////////////// MAIN //////////////
    let range = niceNum(domainMax - domainMin, false);
    let tickSpacing = niceNum(range / (maxTicks - 1), true);
    let niceMin = Math.floor(domainMin / tickSpacing) * tickSpacing;
    let niceMax = Math.ceil(domainMax / tickSpacing) * tickSpacing;
        
    // Return tickValues
    return Array.from( {length: (niceMax - niceMin)/ tickSpacing + 1}, (v,i) => niceMin + i * tickSpacing);
  }
  



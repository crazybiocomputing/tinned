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

const tags = [
  'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 
  'base', 'bdo', 'bgsound', 'blink', 'blockquote', 'body', 'br', 'button', 
  'canvas', 'caption', 'col', 'colgroup', 'command', 'comment', 
  'datalist', 'dd', 'del', 'details', 'div', 'dl', 'dt', 'embed', 
  'fieldset', 'figure', 'b', 'i', 'small', 'footer', 'form', 
  'head', 'header', 'hgroup', 'h1', 'hr', 'html', 
  'iframe', 'ilayer', 'img', 'input', 'ins', 'keygen', 'keygen', 
  'label', 'layer', 'legend', 'li', 'link', 
  'map', 'mark', 'marquee', 'meta', 'meter', 'multicol', 
  'nav', 'nobr', 'noembed', 'noscript', 'object', 
  'ol', 'optgroup', 'option', 'output', 'p', 'param', 
  'cite', 'code', 'dfn', 'em', 'kbd', 'samp', 'strong', 'var', 
  'pre', 'progress', 'q', 'ruby', 'script', 'section', 
  'select', 'spacer', 'span', 'style', 'sub', 'sup', 
  'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 
  'time', 'title', 'tr', 'ul', 'video', 'wbr', 'wbr', 'xmp'];
  

// Inspired by snabbdom API

const parseArg1 = (arg0) => {
  let _id = (typeof arg0 === 'string') ? arg0 : '';
  let _children = (Array.isArray(arg0)) ? arg0 : [];
  return [_id,{},'',_children];
}

const parseArg2 = (arg0,arg1) => {
  let _id = (typeof arg0 === 'string') ? arg0 : '';
  let _options = (typeof arg0 === 'object') ? arg0 : {};
  let _content = (typeof arg1 === 'string') ? arg1 : '';
  let _children = (Array.isArray(arg1)) ? arg1 : [];
  return [_id,_options,_content,_children];
}

const parseArg3 = (arg0, arg1,arg2) => {
  let _content,_children;
  _content = (typeof arg2 === 'string') ? arg2 : '';
  _children = (Array.isArray(arg2)) ? arg2 : [];
  return [arg0,arg1,_content,_children];
}

const _parseArgs = [parseArg1,parseArg2,parseArg3];

const error = () => {
  throw 'ERR: Too much arguments';
}

const parseArgs = (args) => (args.length <= 3) ? _parseArgs[args.length - 1](...args) : error();

function nodeHTML(id,options,content,children) { 
  // DEBUG  console.log(`create ${id} ${JSON.stringify(options)} ${content } ${children}[${children.length}]`);
  let type,elid,klass;

  // Type, ID, Classes
  if (id.includes('#')) {
    [type,elid,...klass] = id.split(/[\s\.#]/);
  }
  else {
    [type,...klass]  = id.split(/[\s\.]/);
  }

  let el = document.createElement(type);
  if (elid) {
    el.id = elid;
  }
  if (klass) {
    el.classList = klass.join(' ');
  }
  // Options -dataset
  if (options.dataset) {
    Object.keys(options.dataset).forEach( key => {
      el.dataset[key] = options.dataset[key]
    });    
  }
  // Options - style
  if (options.style) {
    Object.keys(options.style).forEach( key => {
      el.style[key] = options.style[key]
    });
  }
  if (options.props) {
    Object.keys(options.props).forEach( key => {
      el[key] = options.props[key]
    });    
  }
  if (options.on) {
    Object.keys(options.on).forEach( key => {
      console.log(key);
      el.addEventListener(key,options.on[key]);
    });
  }

  // Content
  el.textContent = content;

  // Children
  children.forEach( (child,i) => {
    let c = (typeof(child) === 'string') ? document.createTextNode(child) : child;
    console.log('create child ',c);
    el.appendChild(c);
  });

  return el;
};


export const h = (...args) => nodeHTML(...parseArgs(args));

export const div = (...args) => {
  let [id,...others] = parseArgs(args);
  return nodeHTML(`div${id}`,...others);
}

export const p = (...args) => {
  let [id,...others] = parseArgs(args);
  return nodeHTML(`p${id}`,...others);
}
export const a = (...args) => {
  let [id,...others] = parseArgs(args);
  return nodeHTML(`a${id}`,...others);
}
export const span = (...args) => {
  let [id,...others] = parseArgs(args);
  return nodeHTML(`span${id}`,...others);
}


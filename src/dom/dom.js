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
  

/*
 * Freely inspired by:
 * ⌞ snabbdom () 
 * ⌞ hyperscript (https://github.com/hyperhype/hyperscript)
 */

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

/*
 * Element Creation
 * @param {string} id Comprises Tag,ID,Class(es) or Tag,Class(es) (only in this order).
 * @param {object} options - Attributes
 * @param {string} content - text
 * @param {children} children - Element children
 * @returns 
 */
const nodeHTML = (id,options,content,children) => { 
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

  const setDataset = (elem,key,value) => elem.dataset[key] = value;
  const setStyle = (elem,key,value) => elem.style[key] = value;
  const setProperty = (elem,key,value) => elem[key] = value;
  const setAttribute = (elem,key,value) => elem.setAttribute(key,value);
  const setListener = (elem,event,func) => elem.addEventListener(event,func);

  const setProp = [setDataset,setStyle,setProperty,setAttribute,setListener];

  // Options
  ['dataset','style','props','attrs','on'].forEach( (prop,i) => {
    if (prop in options) {
      Object.keys(options[prop]).forEach( key => setProp[i](el,key,options[prop][key]) );
    }
  });
  // Content
  el.textContent = content;
  // Children
  children.forEach( (child,i) => {
    let c = (typeof(child) === 'string') ? document.createTextNode(child) : child;
    el.appendChild(c);
  });
  return el;
};


/**
 *  Generic HTML node
 * 
 */ 
export const h = (...args) => nodeHTML(...parseArgs(args));


/**
 * Hyperlink <a> Element Creation
 * @param  {...any} args
 * @returns 
 */
export const a = (...args) => {
  let [id,...others] = parseArgs(args);
  return nodeHTML(`a${id}`,...others);
}

// button
export const button = (...args) => {
  let [id,...others] = parseArgs(args);
  return nodeHTML(`button${id}`,...others);
}

// div
export const div = (...args) => {
  let [id,...others] = parseArgs(args);
  return nodeHTML(`div${id}`,...others);
}

// input
export const input = (...args) => {
  let [id,...others] = parseArgs(args);
  return nodeHTML(`input${id}`,...others);
}

// p
export const p = (...args) => {
  let [id,...others] = parseArgs(args);
  return nodeHTML(`p${id}`,...others);
}

// span
export const span = (...args) => {
  let [id,...others] = parseArgs(args);
  return nodeHTML(`span${id}`,...others);
}


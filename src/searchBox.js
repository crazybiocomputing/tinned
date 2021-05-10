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
 * Quentin Blechet
 * Marc Meynadier
 * Arnaud Simon
 */

'use strict';

import {TINNED} from './tinned.js';
import * as DOM from './dom/dom.js';

/**
 * @param {dom} element
 * @param {array} titles
 */
export const searchBox = (parent,tags) => {

  let board_id = document.querySelector("#board");
  let searchbox;
  let posX;
  let posY;

  const displayNode = (id,_tags) => {

    const newNode = (e) => {
      document.querySelector("#searchbar").value = "";
      id.innerHTML = "";
      TINNED.graph.appendNode(e.target.attributes[1].nodeValue,-1,{meta: {pos:[posX,posY]},state: {}});
      searchbox.style.display = 'none';
    };


    // MAIN
    id.innerHTML = '';
    _tags.forEach((t) => {
      let el = DOM.h('li.filtered', {},
      [
        DOM.h('a',
        {
          attrs: {
            href:'#'
          },
          on: {
            click: newNode
          },
          dataset: {
            nodeid: t.id
          }
        },
        `${t.description} : ${t.class}`),
        DOM.h('p',t.tags.join(", "))
      ]);
      id.appendChild(el);
    });
  };

  const displaySearchbox = () => {

    const searchNodes = (e) => {
      const nodeList = document.querySelector("#nodeList");
      const searchString = e.target.value.toLowerCase();
      const filteredTags = tags.filter((tag) => {
          if (searchString === "" || searchString.length <= 1){
            return;
          }
          return (
              tag.tags.join(",").includes(searchString) ||
              tag.description.toLowerCase().includes(searchString) ||
              tag.class.toLowerCase().includes(searchString)
          );
        });
      const filteredTagsV2 = filteredTags.slice(0, 5);
      displayNode(nodeList,filteredTagsV2);
    }

    searchbox = document.createElement('div');
    searchbox.className = "searchbox";
    searchbox.style.display = 'none';
    searchbox.style.position = 'absolute';    
    searchbox.addEventListener('click',(e) => e.stopPropagation());
    let header = DOM.div('.header.search',[DOM.h('p','Searchbox'),DOM.a('.close',[DOM.h('i.fa.fa-times')])]);
    let body = DOM.div('.body');
    let wrapper=DOM.input('#searchbar',
        {
          attrs: { 
            type: "text",
            name: 'searchbar',
            placeholder: "search for a Node"
          },
          on: {keyup: searchNodes}
          },[]);
    let list = DOM.h('ul#nodeList',{},[]);
    body.appendChild(wrapper);
    body.appendChild(list);
    let footer = DOM.div('.footer',[DOM.h('p','Search')]);
    searchbox.appendChild(header);
    searchbox.appendChild(body);
    searchbox.appendChild(footer);
    return searchbox;
  };

  const openSearchbox = (ev) => {
    console.log("Event : ",ev.target.id);
    if (searchbox.style.display == 'block' || ev.target.id !== "board"){
      return false;
    }
    console.log(ev);
    posX = ev.clientX;
    posY = ev.clientY;
    searchbox.style.top = `${ev.clientY}px`;
    searchbox.style.left = `${ev.clientX}px`;
    searchbox.style.display = 'block';
    return false;
  }

  const closeSearchbox = (ev) => {
    searchbox.style.display = 'none';
    document.querySelector("#searchbar").value = "";
    document.querySelector("ul#nodeList").innerHTML = "";
  }

  board_id.appendChild(displaySearchbox());
  parent.onmousedown= (ev) =>{
    if (ev.which === 1) {
      openSearchbox(ev);
      }
    }

  if (document.querySelector(".close")){
    document.querySelector(".close").addEventListener('click',closeSearchbox);
  }
};
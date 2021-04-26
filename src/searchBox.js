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

import {TINNED} from './tinned.js';
import * as DOM from './dom/dom.js';

/**
 * @param {dom} element - HTML parent element
 * @param {array} titles - [{id:<string>,description: <string>,tags: [<string>, ...]},...]
 */
export const searchBox = (parent,tags) => {

  let searchbox;
  let posX;
  let posY;

  const displayNode = (parent,_tags) => {

    // New node
    const newNode = (e) => {
      // Step #1 - Add new node
      TINNED.graph.appendNode(t.id,-1,{meta: {pos:[posX,posY]},state: {}});
      // Step #2 - Add new eventlistener for drawing edge between sockets
      // Step #3 - Close searchbox
      searchbox.display.style = 'none';
    }


    // MAIN
    parent.innerHTML = '';
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
        t.description)
      ]);
      parent.appendChild(el);
    });
/*
            return `
            <li class="Node">
                <h2><a href=# onclick=return board.graph.appendNode(${tag.id});>${tag.description}</a></h2>
            </li>
        `;
       */ 

  };

  const displaySearchbox = () => {

    const searchNodes = (e) => {
      const nodeList = document.getElementById("nodeList");
      const searchString = e.target.value.toLowerCase();
      const filteredTags = tags.filter((tag) => {
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
    let search = DOM.input('#searchbar',
    {
      attrs: { 
        type: "text",
        name: 'searchbar',
        placeholder: "search for a Node",
        value: 0
      },
      on: {keyup: searchNodes}
    },
    []);
    let ulist = DOM.h('ul#nodeList',{},[]);

    searchbox.appendChild(search);
    searchbox.appendChild(ulist);

    /*
    let searchbox = DOM.div(
      '.header.search',
      {},
      [
        p('Searchbox'),
        div(.'body',[
          div('#searchWrapper',
          [search])
        ])
      ]
    );
          <p> Searchbox </p>
        </div>
        <div class = "body">
        <div id="searchWrapper">
          <input
            type="text"
            name="searchbar"
            id="searchbar"
            placeholder="search for a Node"
          />
        </div>
          <ul id="NodeList"></ul>
        </div>
        <div class = "footer">
          <a href=# >fermer la searchbox</a>
        </div>`;
      searchbox.innerHTML = html;
      */

    return searchbox;
  };

  const toggleDisplay = (ev) => {
    console.log(ev);
    posX = ev.clientX;
    posY = ev.clientY;
    searchbox.style.top = `${ev.clientY}px`;
    searchbox.style.left = `${ev.clientX}px`;
    searchbox.style.display = (searchbox.style.display === 'none') ? 'block' : 'none';
    return false;
  }

  /*
  const Hide = (classe) => {
    document.getElementsByClassName(classe).style.display = "none";
  }
  const Show = (classe) => {
    document.getElementsByClassName(classe).style.display = "contents";
  }

  const check_mouse_down = (classe) => {
    if (document.getElementsByClassName(classe).style.display == "contents"){
      parent.onmousedown(Show("searchbox"));
    }
    else {
      parent.onmousedown(Hide("searchbox"));
    }
  }
*/

/*
const searchbar = document.getElementById("searchbar");
searchbar.addEventListener('keyup', (e) => {
  const NodeList = document.getElementById("NodeList");
  const searchString = e.target.value.toLowerCase();
  const filteredTags = tags.filter((tag) => {
      return (
          tag.tags.join(",").includes(searchString) ||
          tag.description.toLowerCase().includes(searchString) ||
          tag.class.toLowerCase().includes(searchString)
      );
    });
  const filteredTagsV2 = filteredTags.slice(0, 5);
  displayNode(filteredTagsV2,NodeList);
});
*/

  parent.appendChild(displaySearchbox());
  parent.addEventListener('click',toggleDisplay);
  // check_mouse_down("searchbox");
}
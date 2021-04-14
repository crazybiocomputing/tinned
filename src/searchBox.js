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
 * @param {dom} element - HTML parent element
 * @param {array} titles - [{id:<string>,description: <string>,tags: [<string>, ...]},...]
 */
export const searchBox = (parent,tags) => {
    
  const displayNode = (tags,id) => {
    const htmlString = tags
        .map((tag) => {
            return `
            <li class="Node">
                <h2><a href=# onclick=return >${tag.description}</a></h2>
                <p>${tag.tags.join(",")}</p>
            </li>
        `;
        })
        .join('');
    id.innerHTML = htmlString;
  };

  const displaySearchbox = () => {
    const searchbox = document.createElement('div');
    searchbox.className = "searchbox"; 
    const html = `<div id="searchWrapper">
          <input
            type="text"
            name="searchbar"
            id="searchbar"
            placeholder="search for a Node"
          />
        </div>
        <ul id="NodeList"></ul>
      </div>`;
      searchbox.innerHTML = html;
    return searchbox;
  }

  // **WARNING**. Check if there is no other event in Board!!
  // Add Events
  parent.onmousedown = function(){
      parent.appendChild(displaySearchbox() );
  }

  parent.onmouseup = function (){
    const NodeList = document.getElementById("NodeList");
    const searchbar = document.getElementById("searchbar");
    searchbar.addEventListener('keyup', (e) => {
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
  }
}
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
   * Widget 
   * @author Jean-Christophe Taveau
   */
 export const selectlayer = (id,row,metadata,action_func) => {
  let container = document.createElement('div');
  container.className = "flex-cell select-container";
  let select = document.createElement('select');
  select.id = `selectlayer_${id}`;
  let options = row.selectlayer.reduce( (html,item,index) => html + `<option value="${index}">${item}</option>`,'');
  select.innerHTML = options;
  select.addEventListener("change",displayLayer);
  
  container.appendChild(select);
  return container;
}
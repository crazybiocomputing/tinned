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
 export const flowcontrols = (id,row,metadata,action_func) => {
  let buttons = row.flowcontrols;
  let controls = document.createElement('div');
  controls.className = 'flowcontrols';

  [...buttons].forEach ( (b,index) => {
    let button = WidgetFactory.button(id,row);
    button.id = `${b || 'unknown'}__AT__${id}`;
    button.classList.add("square");
    button.classList.add(b);
    button.innerHTML = `<i class="fa fa-${b}"></i>`;
    controls.appendChild(button);
  });

  return controls;
}
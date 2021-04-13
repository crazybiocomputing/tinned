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
 export const checkbox = (id,template,metadata,action_func) => {
 let input = document.createElement('input');
 let [_name,_type] = template.name.split(':');
 input.id = `${_name || 'unknown'}__AT__${id}`;
 input.className = "check";
 input.setAttribute("type", "checkbox");
 input.setAttribute('name',_name || 'unknown');
 console.log(metadata);
 input.setAttribute('value', template.state);
 input.checked = (template.state) ? true : false;

 // TODO Add event onchanged
 return input;
}


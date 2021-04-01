/*
 *  TINNED: TINy Node EDitor
 *  Copyright (C) 2019  Jean-Christophe Taveau.
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

export class TINNED {

  static get version() {
    return "0.1";
  } 
  
  static get authors() {
    return ["Jean-Christophe Taveau"];
  }

  static init() {
    console.log('INIT TINNED');
    this.zoom = 1.0;
    this.translate = {x:0,y:0};
    this.tx = 0;
    this.ty = 0;
    this.graph;
  }
  
  
} // End of class TINNED


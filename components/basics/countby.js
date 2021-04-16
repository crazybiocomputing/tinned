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

import {Observable} from '../../src/core/observable.js';

const countby = (node) => (sourceObservable) => {
  // TODO
  return sourceObservable;
}

export const countby_ui = {
  id: "BASX_COUNTBY",
  class: "programming",
  description: "CountBy",
  tags: ["sort"],
  func: countby,
  ui: [
    [
      {widget: "label", title: "Counts"},
      {widget: "output", name: "counts:[number]" }
    ],
    [
      {widget: "input", name: "data:any"},
      {widget: "label", title: "Data"}
    ]
  ]
};
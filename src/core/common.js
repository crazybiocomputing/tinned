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

export const xmlns = "http://www.w3.org/2000/svg";

/**
 * Return Numerical ID used by graph from node ID (in DOM)
 *
 * @author Jean-Christophe Taveau
 */
export const getID = (nodeid) => nodeid.match(/\d+/)[0];

// From Eric Elliott, Reduce (Composing Software)
// https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d

export const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
export const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

export const zip = (...rows) => rows[0].map((_,i) => rows.map(row => row[i]));
export const sum = (...rows) => rows.map( row => row.reduce( (s,v) => s + v,0));

export const curry = (
  f, arr = []
) => (...args) => (
  a => a.length === f.length ?
    f(...a) :
    curry(f, a)
)([...arr, ...args]);


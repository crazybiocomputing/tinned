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

import {fromPromise} from '../../callbags/callbag-from-promise.js';
import {fromIter} from '../../callbags/callbag-from-iter.js';
import {switchMap} from '../../callbags/callbag-switch-map.js';
import {share} from '../../callbags/callbag-share.js';
import {pipe} from '../../callbags/callbag-pipe.js';

const parseCSV = (txt,separator = ',') => {
  let [header,...rows] = txt.split('\n');
  header = header.split(separator);
  const data = rows.map(row => {
    const d = row.split(separator);
    let obj = header.reduce( (accu,h,i) => {
      accu[h] = d[i];
      return accu;
    },
    {});
    return obj;
  });
}

const parseJSON = (txt,dummy,) => JSON.parse(txt);

const parseText = (txt,dummy) => txt.split('\n');

const parse = [parseCSV,parseJSON,parseText];

const fetchData = (url,format,separator) => {
  return fetch(url)
  .then( response => {
    if (response.ok) {
      console.log('Download Done...');
      return response.text();
    }
    else {
      console.log('Wait..');
    }
  })
  .then(txt => {
    const [_format,_sep] = getFormat(txt,format,separator);
    const data = parse[_format](txt,_sep);
    return Promise.resolve(data);
  })
  .catch( err => {
    console.error(err);
    return Promise.reject(err);
  } );
};


const fetchFunc = (node) => (stream) => {
  // Get param
  let url = node.data.state.url;
  let format = node.data.state?.format || 'Auto';
  let sep = node.data.state?.separator || 'Auto';
  // Set multicast source$ in stream
  const stream$ = pipe(
    fromPromise(fetchData(url,format,sep)),
    switchMap(data => fromIter(Array.from({length: data.length}, (_,i) => i)), (data,num) => data[num]),
    share
  );
  stream.setCallbags(`dataout@${node.id}`,stream$);
  // Return stream
  return stream;
}

export const fetch_ui = {
  id: "BASX_FETCH",
  class: "producer",
  description: "Fetch",
  tags: ["url","csv","json","download"],
  func: fetchFunc,
  ui: [
    [
      {widget:"label",title: "Data"},
      {widget: "output", title: "Data",name: "dataout:any"}
    ],
    [
      {widget:"label",title: "URL"},
      {widget: "text", state: '',name: "url:string"}
    ],
    [
      {widget: "label", title: "AuthKey"},
      {widget: "password", state: '', name: "apikey:string"},
    ],
    [
      {widget: "label", title: "Format"},
      {widget: "select", state: 'Auto', name: "format:string", "items": ["Auto","CSV","JSON","Text"]},
    ],
    [
      {widget: "label", title: "Separator"},
      {widget: "select", state: 'Auto', name: "separator:string", "items": ["Auto","Comma","Tab","SemiColon","Space"]},
    ]
  ]
};

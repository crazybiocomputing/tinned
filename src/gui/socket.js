'use strict';

import {Draggable,edgeStart,edgeDrag,edgeEnd} from './draggable.js';

export class Socket extends Draggable {
  
  constructor(id,type,name='unknown') {
    super();
    let _button = document.createElement('button');
    // Extract name + type
    let data = name.split(':');
    _button.id = `${data[0]}@${id}`; // HACK: (type === 'input') ? `${name}__TO__${id}` :`${name }__FROM__${id}`;
    _button.dataset.type = data[1] || 'any';
    _button.innerHTML = '<i class="fa fa-chevron-circle-right" aria-hidden="true"></i>';
    this.draggable(_button,edgeStart,edgeDrag,edgeEnd);
    this.socket = _button;
  }
  
  get button() {
    return this.socket;
  }
} // End of class Socket

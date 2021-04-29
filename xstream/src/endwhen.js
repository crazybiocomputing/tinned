'use strict';

import {NO,NO_IL,_try} from './common.js';

function EndWhenListener(out, op) {
      this.out = out;
      this.op = op;
  }
  EndWhenListener.prototype._n = function () {
      this.op.end();
  };
  EndWhenListener.prototype._e = function (err) {
      this.out._e(err);
  };
  EndWhenListener.prototype._c = function () {
      this.op.end();
  };


export function EndWhen(o, ins) {
      this.type = 'endWhen';
      this.ins = ins;
      this.out = NO;
      this.o = o;
      this.oil = NO_IL;
  }
  EndWhen.prototype._start = function (out) {
      this.out = out;
      this.o._add(this.oil = new EndWhenListener(out, this));
      this.ins._add(this);
  };
  EndWhen.prototype._stop = function () {
      this.ins._remove(this);
      this.o._remove(this.oil);
      this.out = NO;
      this.oil = NO_IL;
  };
  EndWhen.prototype.end = function () {
      var u = this.out;
      if (u === NO)
          return;
      u._c();
  };
  EndWhen.prototype._n = function (t) {
      var u = this.out;
      if (u === NO)
          return;
      u._n(t);
  };
  EndWhen.prototype._e = function (err) {
      var u = this.out;
      if (u === NO)
          return;
      u._e(err);
  };
  EndWhen.prototype._c = function () {
      this.end();
  };


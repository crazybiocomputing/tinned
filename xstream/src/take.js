'use strict';

import {NO,NO_IL,_try} from './common.js';

export function Take(max, ins) {
      this.type = 'take';
      this.ins = ins;
      this.out = NO;
      this.max = max;
      this.taken = 0;
  }
  Take.prototype._start = function (out) {
      this.out = out;
      this.taken = 0;
      if (this.max <= 0)
          out._c();
      else
          this.ins._add(this);
  };
  Take.prototype._stop = function () {
      this.ins._remove(this);
      this.out = NO;
  };
  Take.prototype._n = function (t) {
      var u = this.out;
      if (u === NO)
          return;
      var m = ++this.taken;
      if (m < this.max)
          u._n(t);
      else if (m === this.max) {
          u._n(t);
          u._c();
      }
  };
  Take.prototype._e = function (err) {
      var u = this.out;
      if (u === NO)
          return;
      u._e(err);
  };
  Take.prototype._c = function () {
      var u = this.out;
      if (u === NO)
          return;
      u._c();
  };
  
'use strict';

import {NO,NO_IL,_try} from './common.js';

export function Filter(passes, ins) {
      this.type = 'filter';
      this.ins = ins;
      this.out = NO;
      this.f = passes;
  }
  Filter.prototype._start = function (out) {
      this.out = out;
      this.ins._add(this);
  };
  Filter.prototype._stop = function () {
      this.ins._remove(this);
      this.out = NO;
  };
  Filter.prototype._n = function (t) {
      var u = this.out;
      if (u === NO)
          return;
      var r = _try(this, t, u);
      if (r === NO || !r)
          return;
      u._n(t);
  };
  Filter.prototype._e = function (err) {
      var u = this.out;
      if (u === NO)
          return;
      u._e(err);
  };
  Filter.prototype._c = function () {
      var u = this.out;
      if (u === NO)
          return;
      u._c();
  };

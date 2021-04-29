'use strict';

import {NO,NO_IL,_try} from './common.js';

export function Fold(f, seed, ins) {
      var _this = this;
      this.type = 'fold';
      this.ins = ins;
      this.out = NO;
      this.f = function (t) { return f(_this.acc, t); };
      this.acc = this.seed = seed;
  }
  Fold.prototype._start = function (out) {
      this.out = out;
      this.acc = this.seed;
      out._n(this.acc);
      this.ins._add(this);
  };
  Fold.prototype._stop = function () {
      this.ins._remove(this);
      this.out = NO;
      this.acc = this.seed;
  };
  Fold.prototype._n = function (t) {
      var u = this.out;
      if (u === NO)
          return;
      var r = _try(this, t, u);
      if (r === NO)
          return;
      u._n(this.acc = r);
  };
  Fold.prototype._e = function (err) {
      var u = this.out;
      if (u === NO)
          return;
      u._e(err);
  };
  Fold.prototype._c = function () {
      var u = this.out;
      if (u === NO)
          return;
      u._c();
  };

'use strict';

import {NO,NO_IL,_try} from './common.js';

export function MapOp(project, ins) {
      this.type = 'map';
      this.ins = ins;
      this.out = NO;
      this.f = project;
  }
  MapOp.prototype._start = function (out) {
      this.out = out;
      this.ins._add(this);
  };
  MapOp.prototype._stop = function () {
      this.ins._remove(this);
      this.out = NO;
  };
  MapOp.prototype._n = function (t) {
      var u = this.out;
      if (u === NO)
          return;
      var r = _try(this, t, u);
      if (r === NO)
          return;
      u._n(r);
  };
  MapOp.prototype._e = function (err) {
      var u = this.out;
      if (u === NO)
          return;
      u._e(err);
  };
  MapOp.prototype._c = function () {
      var u = this.out;
      if (u === NO)
          return;
      u._c();
  };

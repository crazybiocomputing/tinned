"use strict";

// TODO
class groupByOperator {

  constructor(ins) {
        this.ins = ins;
        this.type = 'pairwise';
        this.val = null;
        this.has = false;
        this.out = null;
    }
  
  _start(out) {
        this.out = out;
        this.ins._add(this);
    };
  
  _stop = function () {
        this.ins._remove(this);
        this.has = false;
        this.out = null;
        this.val = null;
    };
  
    _n = function (t) {
        var u = this.out;
        if (!u)
            return;
        if (this.has) {
            var prev = this.val;
            this.val = t;
            u._n([prev, t]);
        }
        else {
            this.val = t;
            this.has = true;
        }
    };
  
  // Error
  _e = function (err) {
        var u = this.out;
        if (!u)
            return;
        u._e(err);
    };
  
  // Complete
  _c = function () {
        var u = this.out;
        if (!u)
            return;
        u._c();
    };

} // End of class GroupByOperator


export const groupBy = (ins) => {
    return new Stream(new groupByOperator(ins));
}
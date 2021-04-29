'use strict';

export function MemoryStream(producer) {
      var _this = _super.call(this, producer) || this;
      _this._has = false;
      return _this;
  }
  MemoryStream.prototype._n = function (x) {
      this._v = x;
      this._has = true;
      _super.prototype._n.call(this, x);
  };
  MemoryStream.prototype._add = function (il) {
      var ta = this._target;
      if (ta)
          return ta._add(il);
      var a = this._ils;
      a.push(il);
      if (a.length > 1) {
          if (this._has)
              il._n(this._v);
          return;
      }
      if (this._stopID !== NO) {
          if (this._has)
              il._n(this._v);
          clearTimeout(this._stopID);
          this._stopID = NO;
      }
      else if (this._has)
          il._n(this._v);
      else {
          var p = this._prod;
          if (p !== NO)
              p._start(this);
      }
  };
  MemoryStream.prototype._stopNow = function () {
      this._has = false;
      _super.prototype._stopNow.call(this);
  };
  MemoryStream.prototype._x = function () {
      this._has = false;
      _super.prototype._x.call(this);
  };
  MemoryStream.prototype.map = function (project) {
      return this._map(project);
  };
  MemoryStream.prototype.mapTo = function (projectedValue) {
      return _super.prototype.mapTo.call(this, projectedValue);
  };
  MemoryStream.prototype.take = function (amount) {
      return _super.prototype.take.call(this, amount);
  };
  MemoryStream.prototype.endWhen = function (other) {
      return _super.prototype.endWhen.call(this, other);
  };
  MemoryStream.prototype.replaceError = function (replace) {
      return _super.prototype.replaceError.call(this, replace);
  };
  MemoryStream.prototype.remember = function () {
      return this;
  };
  MemoryStream.prototype.debug = function (labelOrSpy) {
      return _super.prototype.debug.call(this, labelOrSpy);
  };

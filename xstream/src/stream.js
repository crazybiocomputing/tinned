'use strict';

import {NO,NO_IL,noop,cp} from './common.js';
import {EndWhen} from './endwhen.js';
import {Filter} from './filter.js';
import {Fold} from './fold.js';
import {FromArray} from './fromarray.js';
import {MapOp} from './mapop.js';
import {MemoryStream} from './memorystream.js';
import {Periodic} from './periodic.js';
import {Take} from './take.js';


export function Stream(producer) {
      this._prod = producer || NO;
      this._ils = [];
      this._stopID = NO;
      this._dl = NO;
      this._d = false;
      this._target = null;
      this._err = NO;
  }
  Stream.prototype._n = function (t) {
      var a = this._ils;
      var L = a.length;
      if (this._d)
          this._dl._n(t);
      if (L == 1)
          a[0]._n(t);
      else if (L == 0)
          return;
      else {
          var b = cp(a);
          for (var i = 0; i < L; i++)
              b[i]._n(t);
      }
  };
  Stream.prototype._e = function (err) {
      if (this._err !== NO)
          return;
      this._err = err;
      var a = this._ils;
      var L = a.length;
      this._x();
      if (this._d)
          this._dl._e(err);
      if (L == 1)
          a[0]._e(err);
      else if (L == 0)
          return;
      else {
          var b = cp(a);
          for (var i = 0; i < L; i++)
              b[i]._e(err);
      }
      if (!this._d && L == 0)
          throw this._err;
  };
  Stream.prototype._c = function () {
      var a = this._ils;
      var L = a.length;
      this._x();
      if (this._d)
          this._dl._c();
      if (L == 1)
          a[0]._c();
      else if (L == 0)
          return;
      else {
          var b = cp(a);
          for (var i = 0; i < L; i++)
              b[i]._c();
      }
  };
  Stream.prototype._x = function () {
      if (this._ils.length === 0)
          return;
      if (this._prod !== NO)
          this._prod._stop();
      this._err = NO;
      this._ils = [];
  };
  Stream.prototype._stopNow = function () {
      this._prod._stop();
      this._err = NO;
      this._stopID = NO;
  };
  Stream.prototype._add = function (il) {
      var ta = this._target;
      if (ta)
          return ta._add(il);
      var a = this._ils;
      a.push(il);
      if (a.length > 1)
          return;
      if (this._stopID !== NO) {
          clearTimeout(this._stopID);
          this._stopID = NO;
      }
      else {
          var p = this._prod;
          if (p !== NO)
              p._start(this);
      }
  };
  Stream.prototype._remove = function (il) {
      var _this = this;
      var ta = this._target;
      if (ta)
          return ta._remove(il);
      var a = this._ils;
      var i = a.indexOf(il);
      if (i > -1) {
          a.splice(i, 1);
          if (this._prod !== NO && a.length <= 0) {
              this._err = NO;
              this._stopID = setTimeout(function () { return _this._stopNow(); });
          }
          else if (a.length === 1) {
              this._pruneCycles();
          }
      }
  };
  
  Stream.prototype._pruneCycles = function () {
      if (this._hasNoSinks(this, []))
          this._remove(this._ils[0]);
  };
  
  Stream.prototype._hasNoSinks = function (x, trace) {
      if (trace.indexOf(x) !== -1)
          return true;
      else if (x.out === this)
          return true;
      else if (x.out && x.out !== NO)
          return this._hasNoSinks(x.out, trace.concat(x));
      else if (x._ils) {
          for (var i = 0, N = x._ils.length; i < N; i++)
              if (!this._hasNoSinks(x._ils[i], trace.concat(x)))
                  return false;
          return true;
      }
      else
          return false;
  };
  Stream.prototype.ctor = function () {
      return this instanceof MemoryStream ? MemoryStream : Stream;
  };
  
  Stream.prototype.addListener = function (listener) {
      listener._n = listener.next || noop;
      listener._e = listener.error || noop;
      listener._c = listener.complete || noop;
      this._add(listener);
  };
  
  Stream.prototype.removeListener = function (listener) {
      this._remove(listener);
  };
  
  Stream.prototype.subscribe = function (listener) {
      this.addListener(listener);
      return new StreamSub(this, listener);
  };
  
  Stream.prototype[Symbol.observable] = function () {
      return this;
  };
  
  Stream.create = function (producer) {
      if (producer) {
          if (typeof producer.start !== 'function'
              || typeof producer.stop !== 'function')
              throw new Error('producer requires both start and stop functions');
          internalizeProducer(producer); 
      }
      return new Stream(producer);
  };
  
  Stream.createWithMemory = function (producer) {
      if (producer)
          internalizeProducer(producer); 
      return new MemoryStream(producer);
  };
  
  Stream.never = function () {
      return new Stream({ _start: noop, _stop: noop });
  };
  
  Stream.empty = function () {
      return new Stream({
          _start: function (il) { il._c(); },
          _stop: noop,
      });
  };
  
  Stream.throw = function (error) {
      return new Stream({
          _start: function (il) { il._e(error); },
          _stop: noop,
      });
  };
  
  Stream.from = function (input) {
      if (typeof input[Symbol.observable] === 'function')
          return Stream.fromObservable(input);
      else if (typeof input.then === 'function')
          return Stream.fromPromise(input);
      else if (Array.isArray(input))
          return Stream.fromArray(input);
      throw new TypeError("Type of input to from() must be an Array, Promise, or Observable");
  };
  
  Stream.of = function () {
      var items = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          items[_i] = arguments[_i];
      }
      return Stream.fromArray(items);
  };
  
  Stream.fromArray = function (array) {
      return new Stream(new FromArray(array));
  };
  
  Stream.fromPromise = function (promise) {
      return new Stream(new FromPromise(promise));
  };
  
  Stream.fromObservable = function (obs) {
      if (obs.endWhen !== undefined)
          return obs;
      var o = typeof obs[Symbol.observable] === 'function' ? obs[Symbol.observable]() : obs;
      return new Stream(new FromObservable(o));
  };
  
  Stream.periodic = function (period) {
      return new Stream(new Periodic(period));
  };
  Stream.prototype._map = function (project) {
      return new (this.ctor())(new MapOp(project, this));
  };
  
  Stream.prototype.map = function (project) {
      return this._map(project);
  };
  
  Stream.prototype.mapTo = function (projectedValue) {
      var s = this.map(function () { return projectedValue; });
      var op = s._prod;
      op.type = 'mapTo';
      return s;
  };
  
  Stream.prototype.filter = function (passes) {
      var p = this._prod;
      if (p instanceof Filter)
          return new Stream(new Filter(and(p.f, passes), p.ins));
      return new Stream(new Filter(passes, this));
  };
  
  Stream.prototype.take = function (amount) {
      return new (this.ctor())(new Take(amount, this));
  };
  
  Stream.prototype.drop = function (amount) {
      return new Stream(new Drop(amount, this));
  };
  
  Stream.prototype.last = function () {
      return new Stream(new Last(this));
  };
  
  Stream.prototype.startWith = function (initial) {
      return new MemoryStream(new StartWith(this, initial));
  };
  
  Stream.prototype.endWhen = function (other) {
      return new (this.ctor())(new EndWhen(other, this));
  };
  
  Stream.prototype.fold = function (accumulate, seed) {
      return new MemoryStream(new Fold(accumulate, seed, this));
  };
  
  Stream.prototype.replaceError = function (replace) {
      return new (this.ctor())(new ReplaceError(replace, this));
  };
  
  Stream.prototype.flatten = function () {
      return new Stream(new Flatten(this));
  };
  
  Stream.prototype.compose = function (operator) {
      return operator(this);
  };
  
  Stream.prototype.remember = function () {
      return new MemoryStream(new Remember(this));
  };
  
  Stream.prototype.debug = function (labelOrSpy) {
      return new (this.ctor())(new Debug(this, labelOrSpy));
  };
  
  Stream.prototype.imitate = function (target) {
      if (target instanceof MemoryStream)
          throw new Error('A MemoryStream was given to imitate(), but it only ' +
              'supports a Stream. Read more about this restriction here: ' +
              'https://github.com/staltz/xstream#faq');
      this._target = target;
      for (var ils = this._ils, N = ils.length, i = 0; i < N; i++)
          target._add(ils[i]);
      this._ils = [];
  };
  
  Stream.prototype.shamefullySendNext = function (value) {
      this._n(value);
  };
  
  Stream.prototype.shamefullySendError = function (error) {
      this._e(error);
  };
  
  Stream.prototype.shamefullySendComplete = function () {
      this._c();
  };
  
  Stream.prototype.setDebugListener = function (listener) {
      if (!listener) {
          this._d = false;
          this._dl = NO;
      }
      else {
          this._d = true;
          listener._n = listener.next || noop;
          listener._e = listener.error || noop;
          listener._c = listener.complete || noop;
          this._dl = listener;
      }
  };
  
  Stream.merge = function merge() {
      var streams = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          streams[_i] = arguments[_i];
      }
      return new Stream(new Merge(streams));
  };
  
  Stream.combine = function combine() {
      var streams = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          streams[_i] = arguments[_i];
      }
      return new Stream(new Combine(streams));
  };

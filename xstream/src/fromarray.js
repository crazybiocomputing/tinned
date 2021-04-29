'use strict';

export function FromArray(a) {
    this.type = 'fromArray';
    this.a = a;
}
FromArray.prototype._start = function (out) {
    var a = this.a;
    for (var i = 0, n = a.length; i < n; i++)
        out._n(a[i]);
    out._c();
};
FromArray.prototype._stop = function () {
};

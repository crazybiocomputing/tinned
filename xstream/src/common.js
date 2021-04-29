'use strict';

// Global
export const NO = {};

export function noop() { }

export function cp(a) {
    var l = a.length;
    var b = Array(l);
    for (var i = 0; i < l; ++i)
        b[i] = a[i];
    return b;
}

export function and(f1, f2) {
    return function andFn(t) {
        return f1(t) && f2(t);
    };
}

export function _try(c, t, u) {
    try {
        return c.f(t);
    }
    catch (e) {
        u._e(e);
        return NO;
    }
}

export const NO_IL = {
    _n: noop,
    _e: noop,
    _c: noop,
};

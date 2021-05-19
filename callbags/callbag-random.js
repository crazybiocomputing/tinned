/**
 * 
 * Based on callbag-interval.js
 * @author Jean-Christophe Taveau
 */

'use strict';

export const random = (period,pdf) => (start, sink) => {
  if (start !== 0) return;
  const id = setInterval(() => {
    sink(1, pdf());
  }, period);
  sink(0, t => {
    if (t === 2) clearInterval(id);
  });
};



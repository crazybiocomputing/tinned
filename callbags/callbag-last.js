/**
 * Emit the last value emitted from source on completion, based on provided expression.
 *
 * @param {Function} predicate
 * @param {Function} resultSelector
 */
 const kTrue = () => true
 const identity = a => a
 
export const last = (predicate = kTrue, resultSelector = identity) => source => (start, slink) => {
   if (start !== 0) return;
   let talkback;
   let lastVal;
   let matched = false;
   source(0, (t, d) => {
     if (t === 0) {
       talkback = d;
       slink(t, d);
     } else if (t === 1) {
       if (predicate(d)) {
         lastVal = d;
         matched = true;
       } 
       talkback(1);
     } else if (t === 2) {
       if (matched) slink(1, resultSelector(lastVal));
       slink(2);
     } else {
       slink(t, d);
     }
   });
 };

 
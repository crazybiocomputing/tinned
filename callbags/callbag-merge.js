/**
 * callbag-merge
 * -------------
 *
 * Callbag factory that merges data from multiple callbag sources. Works well
 * with listenable sources, and while it may work for some pullable sources,
 * it is only designed for listenable sources.
 *
 * `npm install callbag-merge`
 *
 * Example:
 *
 *     const interval = require('callbag-interval');
 *     const forEach = require('callbag-for-each');
 *     const merge = require('callbag-merge');
 *
 *     const source = merge(interval(100), interval(350));
 *
 *     forEach(x => console.log(x))(source); // 0
 *                                           // 1
 *                                           // 2
 *                                           // 0
 *                                           // 3
 *                                           // 4
 *                                           // 5
 *                                           // ...
 */

export function merge(...sources) {
    return (start, sink) => {
      if (start !== 0) return;
      const n = sources.length;
      const sourceTalkbacks = new Array(n);
      let startCount = 0;
      let endCount = 0;
      let ended = false;
      const talkback = (t, d) => {
        if (t === 2) ended = true;
        for (let i = 0; i < n; i++) sourceTalkbacks[i] && sourceTalkbacks[i](t, d);
      };
      for (let i = 0; i < n; i++) {
        if (ended) return;
        sources[i](0, (t, d) => {
          if (t === 0) {
            sourceTalkbacks[i] = d;
            if (++startCount === 1) sink(0, talkback);
          } else if (t === 2 && d) {
            ended = true;
            for (let j = 0; j < n; j++) {
              if (j !== i) sourceTalkbacks[j] && sourceTalkbacks[j](2);
            }
            sink(2, d);
          } else if (t === 2) {
            sourceTalkbacks[i] = void 0;
            if (++endCount === n) sink(2);
          } else sink(t, d);
        });
      }
    };
  }
  

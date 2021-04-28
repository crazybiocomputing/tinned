/*
 *  TINNED: TINy Node EDitor
 *  Copyright (C) 2021  Jean-Christophe Taveau.
 *
 *  This file is part of TINNED
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with TINNED.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


'use strict';

import {Observable} from './observable.js';


/**
 * Map operator
 * From https://dev.to/mr_bertoli/rxjs-from-scratch-pipeable-operators-1g18
 *  
 */ 
 export const map = (mapFunc) => (sourceObservable) => {
  // return a new Observable
  return new Observable(observer => {
    const sourceSubscription = sourceObservable.subscribe({
      next(val) {
        let next;
        try {
          next = mapFunc(val);
        } catch (e) {
          observer.error(e);
          observer.complete();
        }
        observer.next(next);
      },
      error(err) {
        observer.error(err);
      },
      complete() {
        observer.complete();
      }
    });
    return () => {
      sourceSubscription.unsubscribe();
    }
  });
} 

/**
 * Filter operator
 * @param predicate - A function returning a boolean
 *  
 */ 
 export const filter = (predicate) => (sourceObservable) => {
  return new Observable(observer => {
    const sourceSubscription = sourceObservable.subscribe({
      next(val) {
        try {
          if (predicate(val)) {
            observer.next(val);
          }
        } catch (e) {
          observer.error(e);
          observer.complete();
        }
      },
      error(err) {
        observer.error(err);
      },
      complete() {
        observer.complete();
      }
    });
    return () => {
      sourceSubscription.unsubscribe();
    }
  });
}

/**
 * Reduce operator
 * @param reduxFunc - A function
 * @param initAccu  - Init value of accumulator
 *  
 */ 
 export const reduce = (reduxFunc,initAccu) => (sourceObservable) => {
  return new Observable(observer => {
    let accumulator = initAccu;
    const sourceSubscription = sourceObservable.subscribe({
      next(val) {
        try {
          accumulator = reduxFunc(accumulator,val);
        } catch (e) {
          observer.error(e);
          observer.next(accumulator);
          observer.complete();
        }
      },
      error: (err) => observer.error(err),
      complete: () => {
        observer.next(accumulator);
        observer.complete();
      }
    });
    return () => {
      sourceSubscription.unsubscribe();
    }
  });
} 

/**
 * Scan operator
 * @param reduxFunc - A function
 * @param initAccu  - Init value of accumulator
 *  
 */ 
 export const scan = (reduxFunc,initAccu) => (sourceObservable) => {
  return new Observable(observer => {
    let accumulator = initAccu;
    const sourceSubscription = sourceObservable.subscribe({
      next(val) {
        try {
          accumulator = reduxFunc(accumulator,val);
          observer.next(accumulator);
        } catch (e) {
          observer.error(e);
          observer.complete();
        }
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    });
    return () => {
      sourceSubscription.unsubscribe();
    }
  });
} 

/**
 * GroupBy operator
 * @param selectFunc - A function returning a boolean
 *  
 */ 
 export const groupBy = (selectFunc) => (sourceObservable) => {
   let groups = {};
  return new Observable(observer => {
    const sourceSubscription = sourceObservable.subscribe({
      next: (val) => {
          const key = selectFunc(val);
          if (!groups[key]) {
            groups[key] = [];
          }
          groups[key].push(val);
      },
      error: (err) => observer.error(err),
      complete: () => {
        // Object.keys(groups).forEach( k => console.log(groups[k]));
        Object.keys(groups).forEach( k => observer.next(groups[k]));
        observer.complete();
      }
    });
    return () => {
      sourceSubscription.unsubscribe();
    }
  });
}


/**
 * Zip operator - TODO
 * @param sources - Various source Observables
 *  
 */ 
 export const zip =  (...srcObservables) => {
  // TODO
  let output = [];
  let num = srcObservables.length;
  return new Observable(observer => {
    const srcSubscriptions = srcObservables.map( obs => {
      return obs.subscribe(
        {
          next: (val) => {
            // innerSubscription?
              output.push(val);
              observer.next(output);
          },
          error: (err) => observer.error(err),
          complete: () => observer.complete()
        }
      );
    });
    return () => {
      srcSubscriptions.forEach( subs => subs.unsubscribe());
    }
  });
} 

/**
 * Buffer operator
 * @param size - Buffer size
 * @param sourceObservable - Source
 *  
 */ 
 export const buffer = (size) => (sourceObservable) => {
  // TODO
  let buf = [];
  return new Observable(observer => {
    const sourceSubscription = sourceObservable.subscribe({
      next(val) {
        try {
          buf.push(val);
          if (buf.length > size) {
            observer.next(buf);
            buf = [];
          }
        } catch (e) {
          observer.error(e);
          observer.complete();
        }
      },
      error(err) {
        observer.error(err);
      },
      complete() {
        observer.complete();
      }
    });
    return () => {
      sourceSubscription.unsubscribe();
    }
  });
} 

/**
 * BufferWhen operator
 * @param predicate - Function terminating the Buffer accumulation
 * @param sourceObservable - Source
 *  
 */ 
 export const bufferWhen = (predicate) => (sourceObservable) => {
  // TODO
  let buf = [];
  return new Observable(observer => {
    const sourceSubscription = sourceObservable.subscribe({
      next(val) {
        try {
          buf.push(val);
          if (predicate(val)) {
            observer.next(buf);
            buf = [];
          }
        } catch (e) {
          observer.error(e);
          observer.complete();
        }
      },
      error(err) {
        observer.error(err);
      },
      complete() {
        observer.complete();
      }
    });
    return () => {
      sourceSubscription.unsubscribe();
    }
  });
} 

/**
 * Share operator
 * Mirror the source
 * 
 * @param sourceObservable - Source
 *  
 */ 
 export const share = () => (sourceObservable) => {
  // TODO
  return new Observable(observer => {
    let cache = undefined;
    let firstObs = sourceObservable;
    const sourceSubscription = sourceObservable.subscribe({
      next(val) {
        try {
          // ???
          if (cache !== undefined) {
            cache = val;
          }
          observer.next(cache);
          // reset
          cache = undefined;
        } catch (e) {
          observer.error(e);
          observer.complete();
        }
      },
      error(err) {
        observer.error(err);
      },
      complete() {
        observer.complete();
      }
    });
    return () => {
      sourceSubscription.unsubscribe();
    }
  });
} 

/**
 * Interval operator
 * From https://dev.to/mr_bertoli/rxjs-from-scratch-pipeable-operators-1g18
 *  
 */ 
export const interval = (period) => {
  let counter = 0;
  return new Observable(observer => {
    const id = setInterval(() => observer.next(++counter), period);
    return () => {
      clearInterval(id);
    }
  });
}

/**
 * Throttle Time operator
 * From https://dev.to/mr_bertoli/rxjs-from-scratch-pipeable-operators-1g18
 *  
 */
export const throttleTime = (time) => (sourceObservable) => {
  let lastEventTime = 0;
  return new Observable(observer => {
    const sourceSubscription = sourceObservable.subscribe({
      next(val) {
        // rarefy event emission
        if (Date.now() - lastEventTime > time) {
          lastEventTime = Date.now();
          observer.next(val);
        }
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    })
    return () => sourceSubscription.unsubscribe();
  });
}

/**
 * Debounce Time operator
 * From https://dev.to/mr_bertoli/rxjs-from-scratch-pipeable-operators-1g18
 *  
 */
export const debounceTime = (delay) => (sourceObservable) => {
  let interval;
  return new Observable(observer => {
    const sourceSubscription = sourceObservable.subscribe({
      next: (val) => {
        // postpone and group rapid sequences of events
        clearInterval(interval);
        interval = setTimeout(() => observer.next(val), delay);
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    })
    return () => {
      // teardown logic
      clearInterval(interval);
      sourceSubscription.unsubscribe();
    }
  })
}

/**
 * Take operator
 * From https://dev.to/mr_bertoli/rxjs-from-scratch-pipeable-operators-1g18
 *  
 */ 
export const take = (howMany) => (sourceObservable) => {
  return new Observable(observer => {
    let counter = 0;
    const sourceSubscription = sourceObservable.subscribe({
      next: (val) => {
        counter++;
        observer.next(val);
        if (counter >= howMany) {
          observer.complete();
        }
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    })
    return () => sourceSubscription.unsubscribe();
  });
}

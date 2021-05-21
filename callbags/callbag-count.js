
'use strict';

import {pipe} from './callbag-pipe.js';
import {scan} from './callbag-scan.js';
import {last} from './callbag-last.js';

export const count = (predicate,) => source => {
  return pipe(
    source,
    scan( (_count,obj) => predicate(obj) ? ++_count : _count, 0),
    last()
  );
}
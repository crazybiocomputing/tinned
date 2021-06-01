
'use strict';

import {pipe} from './callbag-pipe.js';
import {scan} from './callbag-scan.js';
import {last} from './callbag-last.js';

const countAll = x => true;

export const count = (predicate = countAll) => source => {
  return pipe(
    source,
    scan( (_count,obj) => predicate(obj) ? ++_count : _count, 0),
    last()
  );
}
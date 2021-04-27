
// From https://dev.to/mr_bertoli/rxjs-from-scratch-pipeable-operators-1g18

'use strict';

import {scan as rxp_scan} from '../../src/functional/reactive.js';

// Filter operator
const scan = (node) => (stream) => {
  // Get params + source.s
  let sourceObservable = stream[node.sources[0]];
  let init;
  stream[node.sources[1]].subscribe(
    {
      next: (v) => init = v, 
      complete: () => true
    }
  );
  const code = node.data.state.code;
  const redux = new Function('accu','x','const foo = ' + code + '\nreturn foo(accu,x);');
  // Create Observable
  const obs = rxp_scan(redux,init)(sourceObservable);
  // Store observable in stream
  node.targets.forEach( key => {
    stream[key] = obs;  
  });
  // Return stream
  return stream;
}

export const scan_ui =  {
  id: "PROG_SCAN",
  class: "reactive",
  description: "Scan",
  tags: ["fold","accumulate","reduce"],
  help: ["For each input `x`, calculate f(x) and accumulate result"],
  func: scan,
  ui: [
    [
      {widget:"label",title: "Result"}, 
      {widget: "output",name:"value:any"}
    ],
    [
      {widget: "input",name: "x:any"},
      {widget:"label",title: "x"}
    ],
    [
      {widget: "input",state: 0,name: "init:any"},
      {widget:"label",title: "Init"}
    ],
    [
      {widget:"textarea", state: "(accu,x) => (accu = x);\n",name: "code:string"}
    ]
  ]
};
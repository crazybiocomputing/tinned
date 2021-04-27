
// From https://dev.to/mr_bertoli/rxjs-from-scratch-pipeable-operators-1g18

'use strict';

import {reduce as rxp_reduce} from '../../src/functional/reactive.js';

// Filter operator
const reduce = (node) => (stream) => {
  // Get params + source.s
  let sourceObservable = stream[node.sources[0]];
  const code = node.data.state.code;
  const redux = new Function('accu','x','const foo = ' + code + '\nreturn foo(accu,x);');
  // Create Observable
  const obs = rxp_reduce(redux)(sourceObservable);
  // Store observable in stream
  node.targets.forEach( key => {
    stream[key] = obs;  
  });
  // Return stream
  return stream;
}

export const reduce_ui =  {
  id: "PROG_REDUCE",
  class: "reactive",
  description: "Reduce",
  tags: ["fold","accumulate","scan"],
  help: ["For each input `x`, calculate f(x) and accumulate result"],
  func: reduce,
  ui: [
    [
      {widget:"label",title: "Result"}, 
      {widget: "output",name:"result:any"}
    ],
    [
      {widget: "input",name: "x:any"},
      {widget:"label",title: "x"}
    ],
    [
      {widget: "input",name: "init:any"},
      {widget:"label",title: "Init"}
    ],
    [
      {widget:"textarea", state: "(accu,x) => (accu = x);\n",name: "code:string"}
    ]
  ]
};
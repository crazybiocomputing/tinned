
// From https://dev.to/mr_bertoli/rxjs-from-scratch-pipeable-operators-1g18

'use strict';

import {map as rxp_map} from '../../src/functional/reactive.js';


// MAP operator

const map = (node) => (stream) => {

  // Get params + source.s
  let sourceObservable = stream[node.sources[0]];
  const code = node.data.state.code;
  const mapFunc = new Function('x','const foo = ' + code + '\nreturn foo(x);');
  // Create Observable
  const obs = rxp_map(mapFunc)(sourceObservable);
  // Store observable in stream
  node.targets.forEach( key => {
    stream[key] = obs;  
  });
  // Return stream
  return stream;
}

export const map_ui =  {
  id: "BASX_MAP",
  class: "tool",
  description: "Map",
  tags: ["map","forEach"],
  help: ["For each input `x`, calculate f(x)"],
  func: map,
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
      {widget:"textarea", state: "(x) => x;\n",name: "code:string"}
    ]
  ]
};

// From https://dev.to/mr_bertoli/rxjs-from-scratch-pipeable-operators-1g18

'use strict';

// Filter operator
const filter = (node) => (stream) => {
  // Get params + source.s
  let sourceObservable = stream[node.sources[0]];
  const code = node.data.state.code;
  const predicate = new Function('x','const foo = ' + code + '\nreturn foo(x);');
  // Create Observable
  const obs = sourceObservable.filter(predicate)();
  // Store observable in stream
  node.targets.forEach( key => {
    stream[key] = obs;  
  });
  // Return stream
  return stream;
}

export const filter_ui =  {
  id: "PROG_FILTER",
  class: "reactive",
  description: "Filter",
  tags: ["filter"],
  help: ["Filter input data according to predicate"],
  func: filter,
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

// From https://dev.to/mr_bertoli/rxjs-from-scratch-pipeable-operators-1g18

'use strict';

import {Observable} from '../../src/core/observable.js';


// MAP operator

const map = (node) => (sourceObservable) => {
  // return a new Observable
  return new Observable(observer => {
    const sourceSubscription = sourceObservable.subscribe({
      next(val) {
        let next;
        try {
          // Get mapFunc from node
          // TODO const mapFunc = eval(node)
          const code = node.data.state.code;
          const mapFunc = new Function('x','const foo = ' + code + '\nreturn foo(x);');
          next = mapFunc(val);
        } catch (e) {
          this.error(e);
          this.complete();
        }
        observer.next(next);
      },
      error(err) {
        observer.error(err);
      },
      complete() {
        observer.complete();
      }
    })
    return () => {
      sourceSubscription.unsubscribe();
    }
  });
}

export const map_ui =  {
  id: "BASX_MAP",
  class: "programming",
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
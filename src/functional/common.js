// From Eric Elliott, Reduce (Composing Software)
// https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d

export const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
export const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

export const zip = (...rows) => rows[0].map((_,i) => rows.map(row => row[i]));
export const sum = (...rows) => rows.map( row => row.reduce( (s,v) => s + v,0));

export const curry = (f, arr = []) => 
  (...args) => (
    a => a.length === f.length ?
      f(...a) :
      curry(f, a)
  )([...arr, ...args]);


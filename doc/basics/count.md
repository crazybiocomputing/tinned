# Count

_Count the number of elements passing via the stream_

| Screenshot of the node |
|------------------------|
|Legend|


## Inputs

### Input Name

_Description_

## Properties

### Predicate

_A function filtering the elements that must be counted. This function takes one argument `x` corresponding to the element in the stream and returns a boolean (`true` for the element counted or `false` for the others)._
_By default, this function always returns `true` meaning that all the elements are counted._

> **Note**: The code must be saved by clicking on the floppy-disk icon (💾) to take into account the modified code in the stream.
 

_This function is an anonymous function and must follow the JavaScript syntax below_

```javascript
function (x) {
  // Do something...
  // Return true for the elements you want to count or false for the others.
}
```

### Example : Counting the even numbers

_The basic syntax..._

```javascript
function (x) {
  if (x % 2 === 0) {
    return true;
   }
  return false;
}
```
_... or a more concise way with the ternary operator_

```javascript
function (x) {
  return (x%2 === 0) ? true : false;
}
```
_... or just the condition because it returns true or false and avoids the redundancy of the previous coding..._

```javascript
function (x) {
  return (x%2 === 0);
}
```

_... and finally with ES6 syntax. 

```javascript
(x) => (x%2 === 0)
```

## Outputs

### Output Name
_A number corresponding to the number of elements passing through the stream_.

## Example

### Visual code

| ![count.png](img/count_example.png) |
|-------------------------------------|
|In the upper path, we are counting all the numbers emitted by the node `range(0,100,1)` whereas the lower path only counts the number multiple of 3.|

### JavaScript Code

```javascript
import * as cbag from './callbags/index.js';

// Create the series of 100 numbers from 0 to 99
const source$ = cbag.fromIter(Array.from({length: 100}, (_,i) => i);

// Run the stream
cbag.pipe(
  source$,
  cbag.count( x => true),
  cbag.subscribe(val => console.log(val))
);
```

# Count

_Count the number of _

| Screenshot of the node |
|------------------------|
|Legend|


## Inputs

### Input Name

_Description_

## Properties

### Predicate

_A function taking one argument `x` filtering the elements that must be counted._
_By default, this function always returns `true` meaning that all the elements are counted._
_This function is an anonymous function and must follow the following JavaScript syntax:_

```javascript
function (x) {
  // Do something and return true or false
}
```

### Example : Counting the odd numbers

_The basic syntax_

```javascript
function (x) {
  if (x % 2 === 0) {
    return true;
   }
  return false;
}
```
_... or a more concise way with ES6 syntax and the ternary operator_

```javascript
(x) => (x%2 === 0) ? true : false
```
_or just the condition because it returns true or false and avoids the redundancy of the previous coding..._

```javascript
(x) => (x%2 === 0)
```
    
## Outputs

### Output Name
_A number corresponding to the number of elements passing through the stream_.

## Example

| ![count.png](img/count_example.png) |
|-------------------------------------|
|In the upper path, we are counting all the numbers emitted by the node `range(0,100,1)` whereas the lower path only counts the number multiple of 3.|

# Iterable

_Pullable Node emitting a stream of an iterable primitive/object (String, Array, etc.)_

| Screenshot of the node |
|------------------------|
|Legend|


## Inputs

### None

_None_

## Properties
   
### Property Name

_Description_

## Outputs

### Output Name
    _A stream of items_

## Example

| ![Iterable](./img/first_example.png) |
|------------------------|
|The _Iterable_ is composed of an Array of numbers|

### String

For defining a String, you must enclose your series of items by single (or double quotes). For example,

```javascript
// This is a String
'Hello'
'1234'
"Yes,I'm a String!"
```

For multiline String, use the back quotes <kbd>`</kbd>...
```javascript
// A multi-line String
`Hello
world
`
```

The Iterable will emit the characters of the String. If the input String is 'Hello', the iterable will emit <kbd>H</kbd>, <kbd>e</kbd>, <kbd>l</kbd>, <kbd>l</kbd>, and <kbd>o</kbd>.
### Array

For defining an Array, you must enclose your series of items by square brackets <kbd>[</kbd> and <kbd>]</kbd>.

### Other Data Structures

You may define Map, Set.

> **Note**: This is only for expert programmer because we have to wrap the data into a IIFE function.

For example, a Map object may be defined as follows.

```javascript
( () => {
  let map = new Map();
  map.set('a',100);
  return map;
})()
```


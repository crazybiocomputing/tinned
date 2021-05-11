# Iterable

_Stream an iterable primitive/object (String, Array, etc.)_

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

### String

### Array

### Other Data Structures

This is only for expert programmer because we have to wrap the data into a IIFE function.

For example, a Map object may be defined as follows.

```javascript
(()=>{let map = new Map();
map.set('a',100);
return map;
})()
```


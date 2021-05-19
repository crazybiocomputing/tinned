# ToIterable

_Node converting a collection (or String) into a stream of items._

| ![ToIterable](img/to_iterable.png) |
|------------------------|
|Node ToIterable|


## Inputs

_A Collection or a String_

## Properties
   
### Property `With Index`

_If checked, the index of the item in the input is set with the value into the output.
The output is an object containing two properties:
- index
- value
_

## Outputs

### Output Name

_The output is an Array. The behavior is different of the node [Iterable](./iterable.md)_

## Example

```
Random(1000,Uniform) --> Buffer(10) --> ToIterable(false) --> Statistics(Mean) --> Monitor(..)
```

## See Also

_.

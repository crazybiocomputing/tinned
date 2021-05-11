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

_A function filtering the elements that must be counted._
_By default, this function always returns `true` meaning that all the elements are counted._
    
## Outputs

### Output Name
_A number corresponding to the number of elements passing through the stream_.

## Example

| ![count.png](img/count_example.png) |
|-------------------------------------|
|In the upper path, we are counting all the numbers emitted by the node `range(0,100,1)` whereas the lower path only counts the number multiple of 3.|

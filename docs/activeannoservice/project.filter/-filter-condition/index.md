[activeannoservice](../../index.md) / [project.filter](../index.md) / [FilterCondition](./index.md)

# FilterCondition

`sealed class FilterCondition`

Light wrapper classes around MongoDB query elements. To use the [FilterCondition](./index.md) as a parameter for MongoDB find, call [buildQuery](build-query.md) +on the
[FilterCondition](./index.md) object.
Support for:

* all Comparison Query Operators (https://docs.mongodb.com/manual/reference/operator/query-comparison/)
* all Logical Query Operators (https://docs.mongodb.com/manual/reference/operator/query-logical/)
  * You cannot wrap AND, OR and NOR inside a NOT as NOT cannot be a top-level operator (as in MongoDB)
* The Exists Element Query Operator (https://docs.mongodb.com/manual/reference/operator/query-element/)
  * Type check not supported
* The Regex Evaluation Query Operators is supported (https://docs.mongodb.com/manual/reference/operator/query-evaluation/)
  * Every other Evaluation Query Operator is not supported
* Geospatial operators are currently not supported (https://docs.mongodb.com/manual/reference/operator/query-geospatial/)
* The All and Size Array Query operators are supported (https://docs.mongodb.com/manual/reference/operator/query-array/)
  * ElemMatch is currently not supported
* Bitwise Query Operators are not supported (https://docs.mongodb.com/manual/reference/operator/query-bitwise/)

### Properties

| Name | Summary |
|---|---|
| [key](key.md) | `val key: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |

### Functions

| Name | Summary |
|---|---|
| [buildBson](build-bson.md) | `fun buildBson(): BsonDocument` |
| [buildQuery](build-query.md) | `fun buildQuery(): ObjectNode` |
| [equals](equals.md) | `open fun equals(other: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [hashCode](hash-code.md) | `open fun hashCode(): `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [toString](to-string.md) | `open fun toString(): `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |

### Inheritors

| Name | Summary |
|---|---|
| [And](../-and/index.md) | `class And : `[`FilterCondition`](./index.md) |
| [ContainsAll](../-contains-all/index.md) | Equivalent to And connection between Contains conditions, exists as shorthand Example: { tags: { $all: [ssl,security](#) } } =&gt; { $and: [{tags:ssl},{tags:security}](#) }`class ContainsAll : `[`FilterCondition`](./index.md) |
| [DateGreaterThanEquals](../-date-greater-than-equals/index.md) | Filter based on a mapping a date string to timestamp and then performing GTE on the [value](../-date-greater-than-equals/value.md) provided.`class DateGreaterThanEquals : `[`FilterCondition`](./index.md) |
| [DateLessThanEquals](../-date-less-than-equals/index.md) | Filter based on a mapping a date string to timestamp and then performing LTE on the [value](../-date-less-than-equals/value.md) provided. If the value is not existing, won't return the document`class DateLessThanEquals : `[`FilterCondition`](./index.md) |
| [Equals](../-equals/index.md) | Use for direct equals or array contains`class Equals : `[`FilterCondition`](./index.md) |
| [GreaterThan](../-greater-than/index.md) | `class GreaterThan : `[`FilterCondition`](./index.md) |
| [GreaterThanEquals](../-greater-than-equals/index.md) | `class GreaterThanEquals : `[`FilterCondition`](./index.md) |
| [In](../-in/index.md) | `class In : `[`FilterCondition`](./index.md) |
| [KeyExists](../-key-exists/index.md) | `class KeyExists : `[`FilterCondition`](./index.md) |
| [LessThan](../-less-than/index.md) | `class LessThan : `[`FilterCondition`](./index.md) |
| [LessThanEquals](../-less-than-equals/index.md) | `class LessThanEquals : `[`FilterCondition`](./index.md) |
| [Nor](../-nor/index.md) | `class Nor : `[`FilterCondition`](./index.md) |
| [Not](../-not/index.md) | `class Not : `[`FilterCondition`](./index.md) |
| [NotEquals](../-not-equals/index.md) | `class NotEquals : `[`FilterCondition`](./index.md) |
| [NotIn](../-not-in/index.md) | `class NotIn : `[`FilterCondition`](./index.md) |
| [Or](../-or/index.md) | `class Or : `[`FilterCondition`](./index.md) |
| [Regex](../-regex/index.md) | `class Regex : `[`FilterCondition`](./index.md) |
| [Size](../-size/index.md) | `class Size : `[`FilterCondition`](./index.md) |
| [StringEquals](../-string-equals/index.md) | Class to compare value inside document and [value](../-string-equals/value.md) both as strings, using Mongos expr feature`class StringEquals : `[`FilterCondition`](./index.md) |

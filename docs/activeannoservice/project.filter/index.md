[activeannoservice](../index.md) / [project.filter](./index.md)

## Package project.filter

### Types

| Name | Summary |
|---|---|
| [And](-and/index.md) | `class And : `[`FilterCondition`](-filter-condition/index.md) |
| [ContainsAll](-contains-all/index.md) | Equivalent to And connection between Contains conditions, exists as shorthand Example: { tags: { $all: [ssl,security](#) } } =&gt; { $and: [{tags:ssl},{tags:security}](#) }`class ContainsAll : `[`FilterCondition`](-filter-condition/index.md) |
| [DateGreaterThanEquals](-date-greater-than-equals/index.md) | Filter based on a mapping a date string to timestamp and then performing GTE on the [value](-date-greater-than-equals/value.md) provided.`class DateGreaterThanEquals : `[`FilterCondition`](-filter-condition/index.md) |
| [DateLessThanEquals](-date-less-than-equals/index.md) | Filter based on a mapping a date string to timestamp and then performing LTE on the [value](-date-less-than-equals/value.md) provided. If the value is not existing, won't return the document`class DateLessThanEquals : `[`FilterCondition`](-filter-condition/index.md) |
| [Equals](-equals/index.md) | Use for direct equals or array contains`class Equals : `[`FilterCondition`](-filter-condition/index.md) |
| [FilterCondition](-filter-condition/index.md) | Light wrapper classes around MongoDB query elements. To use the [FilterCondition](-filter-condition/index.md) as a parameter for MongoDB find, call [buildQuery](-filter-condition/build-query.md) +on the [FilterCondition](-filter-condition/index.md) object. Support for:`sealed class FilterCondition` |
| [GreaterThan](-greater-than/index.md) | `class GreaterThan : `[`FilterCondition`](-filter-condition/index.md) |
| [GreaterThanEquals](-greater-than-equals/index.md) | `class GreaterThanEquals : `[`FilterCondition`](-filter-condition/index.md) |
| [In](-in/index.md) | `class In : `[`FilterCondition`](-filter-condition/index.md) |
| [KeyExists](-key-exists/index.md) | `class KeyExists : `[`FilterCondition`](-filter-condition/index.md) |
| [LessThan](-less-than/index.md) | `class LessThan : `[`FilterCondition`](-filter-condition/index.md) |
| [LessThanEquals](-less-than-equals/index.md) | `class LessThanEquals : `[`FilterCondition`](-filter-condition/index.md) |
| [Nor](-nor/index.md) | `class Nor : `[`FilterCondition`](-filter-condition/index.md) |
| [Not](-not/index.md) | `class Not : `[`FilterCondition`](-filter-condition/index.md) |
| [NotEquals](-not-equals/index.md) | `class NotEquals : `[`FilterCondition`](-filter-condition/index.md) |
| [NotIn](-not-in/index.md) | `class NotIn : `[`FilterCondition`](-filter-condition/index.md) |
| [Or](-or/index.md) | `class Or : `[`FilterCondition`](-filter-condition/index.md) |
| [Regex](-regex/index.md) | `class Regex : `[`FilterCondition`](-filter-condition/index.md) |
| [Size](-size/index.md) | `class Size : `[`FilterCondition`](-filter-condition/index.md) |
| [StringEquals](-string-equals/index.md) | Class to compare value inside document and [value](-string-equals/value.md) both as strings, using Mongos expr feature`class StringEquals : `[`FilterCondition`](-filter-condition/index.md) |

### Functions

| Name | Summary |
|---|---|
| [toBsonValue](to-bson-value.md) | `fun toBsonValue(value: `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)`?): BsonValue` |

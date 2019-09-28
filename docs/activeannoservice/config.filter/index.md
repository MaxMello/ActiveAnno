[activeannoservice](../index.md) / [config.filter](./index.md)

## Package config.filter

### Types

| Name | Summary |
|---|---|
| [And](-and/index.md) | `class And : `[`FilterCondition`](-filter-condition/index.md) |
| [ContainsAll](-contains-all/index.md) | `class ContainsAll : `[`FilterCondition`](-filter-condition/index.md)<br>Equivalent to And connection between Contains conditions, exists as shorthand Example: { tags: { $all: [ssl,security](#) } } =&gt; { $and: [{tagsssl},{tagssecurity}](#) } |
| [Equals](-equals/index.md) | `class Equals : `[`FilterCondition`](-filter-condition/index.md)<br>Use for direct equals or array contains |
| [FilterCondition](-filter-condition/index.md) | `sealed class FilterCondition`<br>Light wrapper classes around MongoDB query elements. To use the [FilterCondition](-filter-condition/index.md) as a parameter for MongoDB find, call [buildQuery](-filter-condition/build-query.md) on the [FilterCondition](-filter-condition/index.md) object. Support for: |
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

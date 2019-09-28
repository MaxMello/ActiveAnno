[activeannoservice](../../index.md) / [config](../index.md) / [UserRoles](./index.md)

# UserRoles

`data class UserRoles`

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `UserRoles(managers: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`UserIdentifier`](../-user-identifier.md)`>, curators: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`UserIdentifier`](../-user-identifier.md)`>, annotators: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`UserIdentifier`](../-user-identifier.md)`>)` |

### Properties

| Name | Summary |
|---|---|
| [annotators](annotators.md) | `val annotators: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`UserIdentifier`](../-user-identifier.md)`>`<br>Users that are allowed to the annotation view |
| [curators](curators.md) | `val curators: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`UserIdentifier`](../-user-identifier.md)`>`<br>Users that are allowed to the curation view |
| [managers](managers.md) | `val managers: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`UserIdentifier`](../-user-identifier.md)`>`<br>The creator of a configuration should be the manager by default, but it is possible to add additional managers or remove the initial manager Minimum required length = 1 |

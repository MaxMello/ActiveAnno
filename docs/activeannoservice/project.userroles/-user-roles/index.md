[activeannoservice](../../index.md) / [project.userroles](../index.md) / [UserRoles](./index.md)

# UserRoles

`data class UserRoles`

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `UserRoles(managers: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`UserIdentifier`](../-user-identifier.md)`>, curators: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`UserIdentifier`](../-user-identifier.md)`>, annotators: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`UserIdentifier`](../-user-identifier.md)`>)` |

### Properties

| Name | Summary |
|---|---|
| [annotators](annotators.md) | Users that are allowed to the annotation view`val annotators: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`UserIdentifier`](../-user-identifier.md)`>` |
| [curators](curators.md) | Users that are allowed to the curation view`val curators: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`UserIdentifier`](../-user-identifier.md)`>` |
| [managers](managers.md) | The creator of a project should be the manager by default, but it is possible to add additional managers or remove the initial manager`val managers: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`UserIdentifier`](../-user-identifier.md)`>` |

[activeannoservice](../../../index.md) / [annotationdefinition](../../index.md) / [HierarchicalTagSetAnnotationDefinition](../index.md) / [HierarchicalTagSetOption](./index.md)

# HierarchicalTagSetOption

`data class HierarchicalTagSetOption`

Option for a hierarchical tag set.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Option for a hierarchical tag set.`HierarchicalTagSetOption(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?, children: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<HierarchicalTagSetOption>? = null)` |

### Properties

| Name | Summary |
|---|---|
| [children](children.md) | `val children: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<HierarchicalTagSetOption>?` |
| [id](id.md) | `val id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [name](name.md) | `val name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [shortName](short-name.md) | Shorter version of name, optional. If present, will be used for UI elements with limited space, i.e. for inline span labels`val shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |

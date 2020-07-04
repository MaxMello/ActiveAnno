[activeannoservice](../../index.md) / [project.layout.elements.display](../index.md) / [MetaDataMapping](./index.md)

# MetaDataMapping

`data class MetaDataMapping : `[`DisplayElement`](../-display-element.md)

For a meta data element, use the value as a key to the [mapping](mapping.md) map and display a list of
[DisplayElement](../-display-element.md)s or the fallback if no value is found for the key

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | For a meta data element, use the value as a key to the [mapping](mapping.md) map and display a list of [DisplayElement](../-display-element.md)s or the fallback if no value is found for the key`MetaDataMapping(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, mapping: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`DisplayElement`](../-display-element.md)`>>, fallback: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`DisplayElement`](../-display-element.md)`>)` |

### Properties

| Name | Summary |
|---|---|
| [fallback](fallback.md) | `val fallback: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`DisplayElement`](../-display-element.md)`>` |
| [id](id.md) | `val id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [mapping](mapping.md) | `val mapping: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`DisplayElement`](../-display-element.md)`>>` |

[activeannoservice](../../index.md) / [project.sort](../index.md) / [SortElement](./index.md)

# SortElement

`data class SortElement`

Single sort element with key and order

Example of sorting by information gain for an active learning model
key = configAnnotationData.CONFIG_ID.generatedAnnotationData.annotations.ANNOTATION_ID.probability
order = asc

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Single sort element with key and order`SortElement(key: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, order: `[`Order`](../-order/index.md)`)` |

### Properties

| Name | Summary |
|---|---|
| [key](key.md) | `val key: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [order](order.md) | `val order: `[`Order`](../-order/index.md) |

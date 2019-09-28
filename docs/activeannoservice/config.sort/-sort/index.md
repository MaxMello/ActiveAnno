[activeannoservice](../../index.md) / [config.sort](../index.md) / [Sort](./index.md)

# Sort

`data class Sort`

Data class representing mongo DB sort

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `Sort(sorts: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`SortElement`](../-sort-element/index.md)`>)`<br>Data class representing mongo DB sort |

### Properties

| Name | Summary |
|---|---|
| [sorts](sorts.md) | `val sorts: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`SortElement`](../-sort-element/index.md)`>`<br>List of sorts, first element has highest priority |

### Functions

| Name | Summary |
|---|---|
| [buildSort](build-sort.md) | `fun buildSort(): BsonDocument`<br>Convert model to BsonDocument to pass to mongo query |

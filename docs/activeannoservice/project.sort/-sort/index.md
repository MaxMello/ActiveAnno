[activeannoservice](../../index.md) / [project.sort](../index.md) / [Sort](./index.md)

# Sort

`data class Sort`

Data class representing mongo DB sort

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Data class representing mongo DB sort`Sort(sorts: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`SortElement`](../-sort-element/index.md)`>)` |

### Properties

| Name | Summary |
|---|---|
| [sorts](sorts.md) | List of sorts, first element has highest priority`val sorts: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`SortElement`](../-sort-element/index.md)`>` |

### Functions

| Name | Summary |
|---|---|
| [buildSort](build-sort.md) | Convert model to BsonDocument to pass to mongo query`fun buildSort(): BsonDocument` |

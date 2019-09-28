[activeannoservice](../../index.md) / [config](../index.md) / [Column](./index.md)

# Column

`data class Column`

A column is part of a row and has a width dependent of screen size. Every row should have at least one column.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `Column(width: `[`ColumnSizes`](../-column-sizes/index.md)`, children: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Element`](../-element.md)`>)`<br>A column is part of a row and has a width dependent of screen size. Every row should have at least one column. |

### Properties

| Name | Summary |
|---|---|
| [children](children.md) | `val children: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Element`](../-element.md)`>`<br>The actual UI elements, elements in the list will just be parsed as html elements one after another in the column. |
| [width](width.md) | `val width: `[`ColumnSizes`](../-column-sizes/index.md) |

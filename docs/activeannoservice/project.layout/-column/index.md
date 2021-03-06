[activeannoservice](../../index.md) / [project.layout](../index.md) / [Column](./index.md)

# Column

`data class Column`

A column is part of a row and has a width dependent of screen size. Every row should have at least one column.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | A column is part of a row and has a width dependent of screen size. Every row should have at least one column.`Column(width: `[`ColumnSizes`](../-column-sizes/index.md)`, children: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`LayoutElement`](../-layout-element.md)`>)` |

### Properties

| Name | Summary |
|---|---|
| [children](children.md) | The actual UI elements, elements in the list will just be parsed as html elements one after another in the column.`var children: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`LayoutElement`](../-layout-element.md)`>` |
| [width](width.md) | `val width: `[`ColumnSizes`](../-column-sizes/index.md) |

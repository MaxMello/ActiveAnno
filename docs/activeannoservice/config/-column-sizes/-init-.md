[activeannoservice](../../index.md) / [config](../index.md) / [ColumnSizes](index.md) / [&lt;init&gt;](./-init-.md)

# &lt;init&gt;

`ColumnSizes(xs: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`, sm: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`? = null, md: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`? = null, lg: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`? = null, xl: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`? = null)`

The UI defines 5 different screen size breakpoints, from smallest (xs) to largest (xl). The actual pixel breakpoints
are defined by the UI. Column sizes should be in [1,12](#) range, 12 being the full width of the row, 1 being 1/12 width of the row.
At least xs needs to be defined.


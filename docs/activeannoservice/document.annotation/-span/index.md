[activeannoservice](../../index.md) / [document.annotation](../index.md) / [Span](./index.md)

# Span

`data class Span`

A span is a single piece of a string, expressed by [begin](begin.md) and [end](end.md).

When reading annotations, you can either extract the referenced substring by using the [begin](begin.md) and [end](end.md) values,
or use the copy of the substring [text](text.md) directly.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | A span is a single piece of a string, expressed by [begin](begin.md) and [end](end.md).`Span(begin: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`, end: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`, text: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null)` |

### Properties

| Name | Summary |
|---|---|
| [begin](begin.md) | Inclusive start of span`val begin: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [end](end.md) | Exclusive end of span`val end: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [text](text.md) | `val text: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |

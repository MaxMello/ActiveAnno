[activeannoservice](../../index.md) / [document.annotation](../index.md) / [Span](index.md) / [&lt;init&gt;](./-init-.md)

# &lt;init&gt;

`Span(begin: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`, end: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`, text: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null)`

A span is a single piece of a string, expressed by [begin](begin.md) and [end](end.md).

When reading annotations, you can either extract the referenced substring by using the [begin](begin.md) and [end](end.md) values,
or use the copy of the substring [text](text.md) directly.


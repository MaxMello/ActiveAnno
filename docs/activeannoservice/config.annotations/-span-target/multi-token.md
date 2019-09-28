[activeannoservice](../../index.md) / [config.annotations](../index.md) / [SpanTarget](index.md) / [multiToken](./multi-token.md)

# multiToken

`val multiToken: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)

Allow multiple tokens in a single span. Example:
    "A great comment". Span: "great comment". If false, only "A", "great" or "comment" would be allowed.


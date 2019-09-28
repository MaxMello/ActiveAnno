[activeannoservice](../../index.md) / [document](../index.md) / [Document](index.md) / [&lt;init&gt;](./-init-.md)

# &lt;init&gt;

`Document(_id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null, storeTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, originalDocument: ObjectNode, restrictedConfig: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null, configAnnotationData: `[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`ConfigAnnotationData`](../-config-annotation-data/index.md)`> = mutableMapOf())`

The data class representing a document with some [originalDocument](original-document.md), a unique [_id](_id.md), optionally a [restrictedConfig](restricted-config.md)
(marking the document to belong only to that one config), and the [configAnnotationData](config-annotation-data.md) holding all the annotations
for every config related to the document.


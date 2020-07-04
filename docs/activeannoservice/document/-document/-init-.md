[activeannoservice](../../index.md) / [document](../index.md) / [Document](index.md) / [&lt;init&gt;](./-init-.md)

# &lt;init&gt;

`Document(@BsonId id: `[`DocumentID`](../-document-i-d.md)` = newId<Document>().toString(), storeTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, originalDocument: ObjectNode, restrictedProjectID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null, projectAnnotationData: `[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, `[`ProjectAnnotationData`](../-project-annotation-data/index.md)`> = mutableMapOf())`

The data class representing a document with some [originalDocument](original-document.md), a unique [id](id.md), optionally a [restrictedProjectID](restricted-project-i-d.md)
(marking the document to belong only to that one project), and the [projectAnnotationData](project-annotation-data.md) holding all the annotations
for every project related to the document.


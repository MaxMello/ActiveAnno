[activeannoservice](../index.md) / [project.annotationschema.generator](index.md) / [generateMissingAnnotationsForAllDocumentsBulk](./generate-missing-annotations-for-all-documents-bulk.md)

# generateMissingAnnotationsForAllDocumentsBulk

`suspend fun `[`Project`](../project/-project/index.md)`.generateMissingAnnotationsForAllDocumentsBulk(chuckSize: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 100, limit: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = Int.MAX_VALUE): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)

Given a [Project](../project/-project/index.md), generate missing annotations for all documents for the project and update the documents. This method does it multiple chunks,
given a size parameter


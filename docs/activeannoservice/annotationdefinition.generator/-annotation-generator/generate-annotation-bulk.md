[activeannoservice](../../index.md) / [annotationdefinition.generator](../index.md) / [AnnotationGenerator](index.md) / [generateAnnotationBulk](./generate-annotation-bulk.md)

# generateAnnotationBulk

`open suspend fun generateAnnotationBulk(documentsWithGeneratedAnnotationData: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Pair`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/index.html)`<`[`Document`](../../document/-document/index.md)`, `[`GeneratedAnnotationData`](../../document.annotation/-generated-annotation-data/index.md)`>>): `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`Document`](../../document/-document/index.md)`, `[`Annotation`](../../document.annotation/-annotation.md)`<*>>`

Open function to generate annotations in bulk, might be more efficient. By default, just iterates through
[documentsWithGeneratedAnnotationData](generate-annotation-bulk.md#annotationdefinition.generator.AnnotationGenerator$generateAnnotationBulk(kotlin.collections.List((kotlin.Pair((document.Document, document.annotation.GeneratedAnnotationData)))))/documentsWithGeneratedAnnotationData) and calls [generateAnnotation](generate-annotation.md) for each. Can be overwritten to implement true bulk behavior.


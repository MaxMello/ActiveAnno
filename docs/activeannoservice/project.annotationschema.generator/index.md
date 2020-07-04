[activeannoservice](../index.md) / [project.annotationschema.generator](./index.md)

## Package project.annotationschema.generator

### Types

| Name | Summary |
|---|---|
| [GeneratedAnnotationResultHandling](-generated-annotation-result-handling/index.md) | `data class GeneratedAnnotationResultHandling` |
| [GeneratorSortingPolicy](-generator-sorting-policy/index.md) | How to handle sorting of documents for annotators when generated results is available`enum class GeneratorSortingPolicy` |
| [GeneratorTiming](-generator-timing/index.md) | `sealed class GeneratorTiming` |
| [HandlingPolicy](-handling-policy/index.md) | `sealed class HandlingPolicy` |
| [HandlingPolicyType](-handling-policy-type/index.md) | `enum class HandlingPolicyType` |

### Functions

| Name | Summary |
|---|---|
| [generateAnnotationData](generate-annotation-data.md) | For an AnnotationSchema, execute all [AnnotationGenerator](../annotationdefinition.generator/-annotation-generator/index.md) and return the [GeneratedAnnotationData](../document.annotation/-generated-annotation-data/index.md)`suspend fun `[`DenormalizedAnnotationSchema`](../project.annotationschema/-denormalized-annotation-schema/index.md)`.generateAnnotationData(document: `[`Document`](../document/-document/index.md)`): `[`GeneratedAnnotationData`](../document.annotation/-generated-annotation-data/index.md) |
| [generateAnnotationDataBulk](generate-annotation-data-bulk.md) | `suspend fun `[`DenormalizedAnnotationSchema`](../project.annotationschema/-denormalized-annotation-schema/index.md)`.generateAnnotationDataBulk(documents: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Document`](../document/-document/index.md)`>): `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`Document`](../document/-document/index.md)`, `[`GeneratedAnnotationData`](../document.annotation/-generated-annotation-data/index.md)`>` |
| [generateMissingAnnotationsForAllDocumentsBulk](generate-missing-annotations-for-all-documents-bulk.md) | Given a [Project](../project/-project/index.md), generate missing annotations for all documents for the project and update the documents. This method does it multiple chunks, given a size parameter`suspend fun `[`Project`](../project/-project/index.md)`.generateMissingAnnotationsForAllDocumentsBulk(chuckSize: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 100, limit: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = Int.MAX_VALUE): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |

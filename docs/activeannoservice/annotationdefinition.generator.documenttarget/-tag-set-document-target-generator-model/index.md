[activeannoservice](../../index.md) / [annotationdefinition.generator.documenttarget](../index.md) / [TagSetDocumentTargetGeneratorModel](./index.md)

# TagSetDocumentTargetGeneratorModel

`class TagSetDocumentTargetGeneratorModel : `[`AnnotationGenerator`](../../annotationdefinition.generator/-annotation-generator/index.md)

Use this class for external ML models which are already trained and don't need any training data

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Use this class for external ML models which are already trained and don't need any training data`TagSetDocumentTargetGeneratorModel(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, annotationDefinitionID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, input: `[`AnnotationStepKey`](../../project.annotationschema/-annotation-step-key/index.md)`, predictUrl: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, httpAuthentication: `[`HttpAuthentication`](../../common/-http-authentication/index.md)` = HttpAuthentication.None, finalizeCondition: `[`FinalizeCondition`](../../annotationdefinition.generator/-finalize-condition/index.md)` = FinalizeCondition.Always, createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis())` |

### Properties

| Name | Summary |
|---|---|
| [httpAuthentication](http-authentication.md) | `var httpAuthentication: `[`HttpAuthentication`](../../common/-http-authentication/index.md) |
| [predictUrl](predict-url.md) | `var predictUrl: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |

### Functions

| Name | Summary |
|---|---|
| [generateAnnotation](generate-annotation.md) | `suspend fun generateAnnotation(document: `[`Document`](../../document/-document/index.md)`, generatedAnnotationData: `[`GeneratedAnnotationData`](../../document.annotation/-generated-annotation-data/index.md)`): `[`DocumentTargetAnnotation`](../../document.annotation/-document-target-annotation/index.md) |
| [updateModel](update-model.md) | Call this to update the mutable fields of an [AnnotationGenerator](../../annotationdefinition.generator/-annotation-generator/index.md)`fun updateModel(newAnnotationGenerator: `[`AnnotationGenerator`](../../annotationdefinition.generator/-annotation-generator/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |

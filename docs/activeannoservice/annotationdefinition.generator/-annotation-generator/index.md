[activeannoservice](../../index.md) / [annotationdefinition.generator](../index.md) / [AnnotationGenerator](./index.md)

# AnnotationGenerator

`abstract class AnnotationGenerator`

Base class for [AnnotationGenerator](./index.md)s. An annotation generator is responsible for automatically generating an annotation value, optionally with
a probability attached, for a specific annotation definition. This can be used for statistical methods, simple if-else annotation
(for example: if value in list of values, annotate with X), or for machine learning integration.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Base class for [AnnotationGenerator](./index.md)s. An annotation generator is responsible for automatically generating an annotation value, optionally with a probability attached, for a specific annotation definition. This can be used for statistical methods, simple if-else annotation (for example: if value in list of values, annotate with X), or for machine learning integration.`AnnotationGenerator(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, annotationDefinitionID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, targetType: `[`TargetType`](../../annotationdefinition.target/-target-type/index.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, input: `[`AnnotationStepKey`](../../project.annotationschema/-annotation-step-key/index.md)`, finalizeCondition: `[`FinalizeCondition`](../-finalize-condition/index.md)` = FinalizeCondition.Always, createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis())` |

### Properties

| Name | Summary |
|---|---|
| [annotationDefinitionID](annotation-definition-i-d.md) | `val annotationDefinitionID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [createdTimestamp](created-timestamp.md) | `val createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |
| [description](description.md) | `var description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [finalizeCondition](finalize-condition.md) | `var finalizeCondition: `[`FinalizeCondition`](../-finalize-condition/index.md) |
| [id](id.md) | `val id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [input](input.md) | We need to define the [input](input.md) to an [AnnotationGenerator](./index.md) directly here, because a single [AnnotationGenerator](./index.md) can be shared by multiple projects. For prediction, a generator is always in context of a specific project, but for updating it, it is not.`var input: `[`AnnotationStepKey`](../../project.annotationschema/-annotation-step-key/index.md) |
| [name](name.md) | `var name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [targetType](target-type.md) | `val targetType: `[`TargetType`](../../annotationdefinition.target/-target-type/index.md) |

### Functions

| Name | Summary |
|---|---|
| [generateAnnotation](generate-annotation.md) | `abstract suspend fun generateAnnotation(document: `[`Document`](../../document/-document/index.md)`, generatedAnnotationData: `[`GeneratedAnnotationData`](../../document.annotation/-generated-annotation-data/index.md)`): `[`Annotation`](../../document.annotation/-annotation.md)`<*>` |
| [generateAnnotationBulk](generate-annotation-bulk.md) | Open function to generate annotations in bulk, might be more efficient. By default, just iterates through [documentsWithGeneratedAnnotationData](generate-annotation-bulk.md#annotationdefinition.generator.AnnotationGenerator$generateAnnotationBulk(kotlin.collections.List((kotlin.Pair((document.Document, document.annotation.GeneratedAnnotationData)))))/documentsWithGeneratedAnnotationData) and calls [generateAnnotation](generate-annotation.md) for each. Can be overwritten to implement true bulk behavior.`open suspend fun generateAnnotationBulk(documentsWithGeneratedAnnotationData: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`Pair`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/index.html)`<`[`Document`](../../document/-document/index.md)`, `[`GeneratedAnnotationData`](../../document.annotation/-generated-annotation-data/index.md)`>>): `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`Document`](../../document/-document/index.md)`, `[`Annotation`](../../document.annotation/-annotation.md)`<*>>` |
| [updateModel](update-model.md) | Call this to update the mutable fields of an [AnnotationGenerator](./index.md)`open fun updateModel(newAnnotationGenerator: `[`AnnotationGenerator`](./index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |

### Inheritors

| Name | Summary |
|---|---|
| [DetectedLanguageGenerator](../../annotationdefinition.generator.documenttarget/-detected-language-generator/index.md) | [AnnotationGenerator](./index.md) which detects the language using the "Lingua" library, storing the annotation under the defined key as the ISO 639-1 Code (in upper case). The "unknown" key from Lingua is defined as the string "UNKNOWN"`class DetectedLanguageGenerator : `[`AnnotationGenerator`](./index.md) |
| [TagSetDocumentTargetGeneratorModel](../../annotationdefinition.generator.documenttarget/-tag-set-document-target-generator-model/index.md) | Use this class for external ML models which are already trained and don't need any training data`class TagSetDocumentTargetGeneratorModel : `[`AnnotationGenerator`](./index.md) |
| [UpdatableAnnotationGenerator](../-updatable-annotation-generator/index.md) | Base class for [AnnotationGenerator](./index.md)s which are updatable, for example ML models, as compared to static models like a statistics based generator`abstract class UpdatableAnnotationGenerator : `[`AnnotationGenerator`](./index.md) |

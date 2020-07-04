[activeannoservice](../../index.md) / [annotationdefinition.generator](../index.md) / [UpdatableAnnotationGenerator](./index.md)

# UpdatableAnnotationGenerator

`abstract class UpdatableAnnotationGenerator : `[`AnnotationGenerator`](../-annotation-generator/index.md)

Base class for [AnnotationGenerator](../-annotation-generator/index.md)s which are updatable, for example ML models, as compared to static models like a statistics based generator

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Base class for [AnnotationGenerator](../-annotation-generator/index.md)s which are updatable, for example ML models, as compared to static models like a statistics based generator`UpdatableAnnotationGenerator(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, annotationDefinitionID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, targetType: `[`TargetType`](../../annotationdefinition.target/-target-type/index.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, input: `[`AnnotationStepKey`](../../project.annotationschema/-annotation-step-key/index.md)`, finalizeCondition: `[`FinalizeCondition`](../-finalize-condition/index.md)`, startThreshold: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`, updateThreshold: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`, dataFilter: `[`FilterCondition`](../../project.filter/-filter-condition/index.md)`, versions: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`UpdatableAnnotationGeneratorVersion`](../-updatable-annotation-generator-version/index.md)`> = mutableListOf(), createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis())` |

### Properties

| Name | Summary |
|---|---|
| [dataFilter](data-filter.md) | How to select the data for updating of this generator. Will be combined with a filter of existing finalized annotation results for the related annotation of this generator`var dataFilter: `[`FilterCondition`](../../project.filter/-filter-condition/index.md) |
| [startThreshold](start-threshold.md) | How many samples are required minimum to start training / updating / predicting.`var startThreshold: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [updateThreshold](update-threshold.md) | How many new samples are required compared to the previous version to update`var updateThreshold: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |
| [versions](versions.md) | `var versions: `[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)`<`[`UpdatableAnnotationGeneratorVersion`](../-updatable-annotation-generator-version/index.md)`>` |

### Functions

| Name | Summary |
|---|---|
| [optimize](optimize.md) | Optionally, subclasses can implement [optimize](optimize.md) to optimize e.g. hyperparameters of a ML model`open suspend fun optimize(data: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`Document`](../../document/-document/index.md)`, `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationResult`](../../document.annotation/-annotation-result/index.md)`>>): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [update](update.md) | Implement this for updating the annotation generator given the [version](update.md#annotationdefinition.generator.UpdatableAnnotationGenerator$update(annotationdefinition.generator.UpdatableAnnotationGeneratorVersion, kotlin.collections.Map((document.Document, kotlin.collections.List((document.annotation.AnnotationResult)))))/version)`abstract suspend fun update(version: `[`UpdatableAnnotationGeneratorVersion`](../-updatable-annotation-generator-version/index.md)`, data: `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`Document`](../../document/-document/index.md)`, `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationResult`](../../document.annotation/-annotation-result/index.md)`>>): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [updateModel](update-model.md) | Call this to update the mutable fields of an [AnnotationGenerator](../-annotation-generator/index.md)`open fun updateModel(newAnnotationGenerator: `[`AnnotationGenerator`](../-annotation-generator/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |

### Inheritors

| Name | Summary |
|---|---|
| [TagSetDocumentTargetUpdatableGeneratorModel](../../annotationdefinition.generator.documenttarget/-tag-set-document-target-updatable-generator-model/index.md) | Generic updatable AnnotationGenerator for TagSetAnnotationDefinition and DocumentTarget.`class TagSetDocumentTargetUpdatableGeneratorModel : `[`UpdatableAnnotationGenerator`](./index.md) |

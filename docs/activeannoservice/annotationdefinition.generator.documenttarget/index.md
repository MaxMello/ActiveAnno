[activeannoservice](../index.md) / [annotationdefinition.generator.documenttarget](./index.md)

## Package annotationdefinition.generator.documenttarget

### Types

| Name | Summary |
|---|---|
| [DetectedLanguageGenerator](-detected-language-generator/index.md) | [AnnotationGenerator](../annotationdefinition.generator/-annotation-generator/index.md) which detects the language using the "Lingua" library, storing the annotation under the defined key as the ISO 639-1 Code (in upper case). The "unknown" key from Lingua is defined as the string "UNKNOWN"`class DetectedLanguageGenerator : `[`AnnotationGenerator`](../annotationdefinition.generator/-annotation-generator/index.md) |
| [TagSetDocumentTargetGeneratorModel](-tag-set-document-target-generator-model/index.md) | Use this class for external ML models which are already trained and don't need any training data`class TagSetDocumentTargetGeneratorModel : `[`AnnotationGenerator`](../annotationdefinition.generator/-annotation-generator/index.md) |
| [TagSetDocumentTargetUpdatableGeneratorModel](-tag-set-document-target-updatable-generator-model/index.md) | Generic updatable AnnotationGenerator for TagSetAnnotationDefinition and DocumentTarget.`class TagSetDocumentTargetUpdatableGeneratorModel : `[`UpdatableAnnotationGenerator`](../annotationdefinition.generator/-updatable-annotation-generator/index.md) |
| [TrainingSampleWithLabels](-training-sample-with-labels/index.md) | `data class TrainingSampleWithLabels` |

### Extensions for External Classes

| Name | Summary |
|---|---|
| [kotlin.collections.Map](kotlin.collections.-map/index.md) |  |

### Properties

| Name | Summary |
|---|---|
| [NOT_SELECTED_VALUE](-n-o-t_-s-e-l-e-c-t-e-d_-v-a-l-u-e.md) | `const val NOT_SELECTED_VALUE: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |

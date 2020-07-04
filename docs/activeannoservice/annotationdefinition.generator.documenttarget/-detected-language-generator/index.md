[activeannoservice](../../index.md) / [annotationdefinition.generator.documenttarget](../index.md) / [DetectedLanguageGenerator](./index.md)

# DetectedLanguageGenerator

`class DetectedLanguageGenerator : `[`AnnotationGenerator`](../../annotationdefinition.generator/-annotation-generator/index.md)

[AnnotationGenerator](../../annotationdefinition.generator/-annotation-generator/index.md) which detects the language using the "Lingua" library, storing the annotation under the
defined key as the ISO 639-1 Code (in upper case). The "unknown" key from Lingua is defined as the string "UNKNOWN"

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | [AnnotationGenerator](../../annotationdefinition.generator/-annotation-generator/index.md) which detects the language using the "Lingua" library, storing the annotation under the defined key as the ISO 639-1 Code (in upper case). The "unknown" key from Lingua is defined as the string "UNKNOWN"`DetectedLanguageGenerator(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, annotationDefinitionID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, input: `[`AnnotationStepKey`](../../project.annotationschema/-annotation-step-key/index.md)`, possibleLanguagesIso6391: LanguagesIso639_1, createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis())` |

### Properties

| Name | Summary |
|---|---|
| [possibleLanguagesIso6391](possible-languages-iso6391.md) | `var possibleLanguagesIso6391: LanguagesIso639_1` |

### Functions

| Name | Summary |
|---|---|
| [generateAnnotation](generate-annotation.md) | `suspend fun generateAnnotation(document: `[`Document`](../../document/-document/index.md)`, generatedAnnotationData: `[`GeneratedAnnotationData`](../../document.annotation/-generated-annotation-data/index.md)`): `[`Annotation`](../../document.annotation/-annotation.md)`<*>` |
| [updateModel](update-model.md) | Call this to update the mutable fields of an [AnnotationGenerator](../../annotationdefinition.generator/-annotation-generator/index.md)`fun updateModel(newAnnotationGenerator: `[`AnnotationGenerator`](../../annotationdefinition.generator/-annotation-generator/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |

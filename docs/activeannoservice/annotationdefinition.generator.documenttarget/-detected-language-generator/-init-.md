[activeannoservice](../../index.md) / [annotationdefinition.generator.documenttarget](../index.md) / [DetectedLanguageGenerator](index.md) / [&lt;init&gt;](./-init-.md)

# &lt;init&gt;

`DetectedLanguageGenerator(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, annotationDefinitionID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, input: `[`AnnotationStepKey`](../../project.annotationschema/-annotation-step-key/index.md)`, possibleLanguagesIso6391: LanguagesIso639_1, createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis())`

[AnnotationGenerator](../../annotationdefinition.generator/-annotation-generator/index.md) which detects the language using the "Lingua" library, storing the annotation under the
defined key as the ISO 639-1 Code (in upper case). The "unknown" key from Lingua is defined as the string "UNKNOWN"


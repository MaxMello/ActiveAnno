[activeannoservice](../../index.md) / [annotationdefinition.generator](../index.md) / [AnnotationGenerator](index.md) / [&lt;init&gt;](./-init-.md)

# &lt;init&gt;

`AnnotationGenerator(@BsonId id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, annotationDefinitionID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, targetType: `[`TargetType`](../../annotationdefinition.target/-target-type/index.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, input: `[`AnnotationStepKey`](../../project.annotationschema/-annotation-step-key/index.md)`, finalizeCondition: `[`FinalizeCondition`](../-finalize-condition/index.md)` = FinalizeCondition.Always, createdTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis())`

Base class for [AnnotationGenerator](index.md)s. An annotation generator is responsible for automatically generating an annotation value, optionally with
a probability attached, for a specific annotation definition. This can be used for statistical methods, simple if-else annotation
(for example: if value in list of values, annotate with X), or for machine learning integration.


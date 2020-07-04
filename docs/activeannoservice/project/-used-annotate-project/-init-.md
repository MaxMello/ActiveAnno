[activeannoservice](../../index.md) / [project](../index.md) / [UsedAnnotateProject](index.md) / [&lt;init&gt;](./-init-.md)

# &lt;init&gt;

`UsedAnnotateProject(id: `[`ProjectID`](../-project-i-d.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, priority: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`, layout: `[`Layout`](../../project.layout/-layout/index.md)`, allowManualEscalationToCurator: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, generatedAnnotationResultHandlingPolicy: `[`HandlingPolicy`](../../project.annotationschema.generator/-handling-policy/index.md)`? = null)`

Data class used to store the [AnnotateProject](#) used in the annotation process. For example, the selection is not part
of this, because it can be very big and is generally unnecessary to store.


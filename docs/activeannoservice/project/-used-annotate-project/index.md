[activeannoservice](../../index.md) / [project](../index.md) / [UsedAnnotateProject](./index.md)

# UsedAnnotateProject

`data class UsedAnnotateProject`

Data class used to store the [AnnotateProject](#) used in the annotation process. For example, the selection is not part
of this, because it can be very big and is generally unnecessary to store.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Data class used to store the [AnnotateProject](#) used in the annotation process. For example, the selection is not part of this, because it can be very big and is generally unnecessary to store.`UsedAnnotateProject(id: `[`ProjectID`](../-project-i-d.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, priority: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)`, layout: `[`Layout`](../../project.layout/-layout/index.md)`, allowManualEscalationToCurator: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)`, generatedAnnotationResultHandlingPolicy: `[`HandlingPolicy`](../../project.annotationschema.generator/-handling-policy/index.md)`? = null)` |

### Properties

| Name | Summary |
|---|---|
| [allowManualEscalationToCurator](allow-manual-escalation-to-curator.md) | `val allowManualEscalationToCurator: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [description](description.md) | `val description: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [generatedAnnotationResultHandlingPolicy](generated-annotation-result-handling-policy.md) | `val generatedAnnotationResultHandlingPolicy: `[`HandlingPolicy`](../../project.annotationschema.generator/-handling-policy/index.md)`?` |
| [id](id.md) | `val id: `[`ProjectID`](../-project-i-d.md) |
| [layout](layout.md) | `val layout: `[`Layout`](../../project.layout/-layout/index.md) |
| [name](name.md) | `val name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [priority](priority.md) | `val priority: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html) |

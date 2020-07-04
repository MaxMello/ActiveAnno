[activeannoservice](../../index.md) / [api.manage](../index.md) / [AnalyzeProjectRequest](./index.md)

# AnalyzeProjectRequest

`data class AnalyzeProjectRequest`

Request body for analyze endpoint

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Request body for analyze endpoint`AnalyzeProjectRequest(projectID: `[`ProjectID`](../../project/-project-i-d.md)`, annotators: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`UserIdentifier`](../../project.userroles/-user-identifier.md)`>, curators: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`UserIdentifier`](../../project.userroles/-user-identifier.md)`>, finalizedBefore: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`? = null, finalizedAfter: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`? = null, ignoreDocumentIDs: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`DocumentID`](../../document/-document-i-d.md)`>, ignoreAnnotationResultIDs: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationResultID`](../../document.annotation/-annotation-result-i-d.md)`>, generatedAnnotationResultHandlingPolicyType: `[`HandlingPolicyType`](../../project.annotationschema.generator/-handling-policy-type/index.md)`? = null, onlyGeneratorIncorrect: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, onlyAnnotatorDisagreement: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, onlyAnyAnnotatorIncorrect: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, additionalFilter: `[`FilterCondition`](../../project.filter/-filter-condition/index.md)`? = null)` |

### Properties

| Name | Summary |
|---|---|
| [additionalFilter](additional-filter.md) | `val additionalFilter: `[`FilterCondition`](../../project.filter/-filter-condition/index.md)`?` |
| [annotators](annotators.md) | Only analyze annotation results by these annotators (or all if empty)`val annotators: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`UserIdentifier`](../../project.userroles/-user-identifier.md)`>` |
| [curators](curators.md) | Only analyze annotation results and finalized annotation results by these curators (or all if empty)`val curators: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`UserIdentifier`](../../project.userroles/-user-identifier.md)`>` |
| [finalizedAfter](finalized-after.md) | `val finalizedAfter: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`?` |
| [finalizedBefore](finalized-before.md) | `val finalizedBefore: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`?` |
| [generatedAnnotationResultHandlingPolicyType](generated-annotation-result-handling-policy-type.md) | Only analyze documents where all annotation results by all [annotators](annotators.md) have that [HandlingPolicyType](../../project.annotationschema.generator/-handling-policy-type/index.md)`val generatedAnnotationResultHandlingPolicyType: `[`HandlingPolicyType`](../../project.annotationschema.generator/-handling-policy-type/index.md)`?` |
| [ignoreAnnotationResultIDs](ignore-annotation-result-i-ds.md) | `val ignoreAnnotationResultIDs: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationResultID`](../../document.annotation/-annotation-result-i-d.md)`>` |
| [ignoreDocumentIDs](ignore-document-i-ds.md) | `val ignoreDocumentIDs: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`DocumentID`](../../document/-document-i-d.md)`>` |
| [onlyAnnotatorDisagreement](only-annotator-disagreement.md) | Only analyze documents where the annotators disagree`val onlyAnnotatorDisagreement: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [onlyAnyAnnotatorIncorrect](only-any-annotator-incorrect.md) | Only analyze documents where at least 1 annotator is wrong`val onlyAnyAnnotatorIncorrect: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [onlyGeneratorIncorrect](only-generator-incorrect.md) | Only analyze documents where the generator is wrong. For duration statistics as well as all document-level statistics, this will apply to check if the generator was wrong anywhere on the whole document / all annotations. For the annotation-specific statistics, this will apply to check if the generator was wrong for that specific annotation.`val onlyGeneratorIncorrect: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [projectID](project-i-d.md) | `val projectID: `[`ProjectID`](../../project/-project-i-d.md) |

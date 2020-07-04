[activeannoservice](../index.md) / [document.annotation](index.md) / [Annotation](./-annotation.md)

# Annotation

`sealed class Annotation<T : `[`Target`](../annotationdefinition.target/-target/index.md)`>`

Base class for any annotation. An [Annotation](./-annotation.md) is defined as the actual value associated with an AnnotationDefinition. For example,
a BooleanAnnotationDefinition will produce a single annotation of boolean type. This annotation might be created by a human annotator, or
automatically generated or imported.
Every [Annotation](./-annotation.md) needs to be associated with an annotation ID / key in a map or comparable structure

### Inheritors

| Name | Summary |
|---|---|
| [DocumentTargetAnnotation](-document-target-annotation/index.md) | An annotation which is targeted on the whole document, not a specific part of it. For example, a class label "SPAM" or "NO SPAM" for the whole document.`data class DocumentTargetAnnotation : `[`Annotation`](./-annotation.md)`<`[`DocumentTarget`](../annotationdefinition.target/-document-target/index.md)`>` |
| [SpanTargetAnnotation](-span-target-annotation/index.md) | All annotation values for a single AnnotationDefinition on a span target are represented by a [SpanTargetAnnotation](-span-target-annotation/index.md). For example, a document might have spans of positive and negative sentiment. All annotations regarding sentiment would be stored in a single [SpanTargetAnnotation](-span-target-annotation/index.md), holding a list of [annotations](-span-target-annotation/annotations.md) of which each defines the spans concering the annotation as well as the actual value, in this case POSITIVE or NEGATIVE sentiment.`data class SpanTargetAnnotation : `[`Annotation`](./-annotation.md)`<`[`SpanTarget`](../annotationdefinition.target/-span-target/index.md)`>` |

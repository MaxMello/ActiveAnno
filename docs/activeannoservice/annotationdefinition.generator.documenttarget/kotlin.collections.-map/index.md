[activeannoservice](../../index.md) / [annotationdefinition.generator.documenttarget](../index.md) / [kotlin.collections.Map](./index.md)

### Extensions for kotlin.collections.Map

| Name | Summary |
|---|---|
| [toTrainingData](to-training-data.md) | For every [Document](../../document/-document/index.md), get the training data text value through the [input](to-training-data.md#annotationdefinition.generator.documenttarget$toTrainingData(kotlin.collections.Map((document.Document, kotlin.collections.List((kotlin.collections.MutableMap((kotlin.String, document.annotation.Annotation((annotationdefinition.target.Target)))))))), annotationdefinition.TagSetAnnotationDefinition, project.annotationschema.AnnotationStepKey)/input) for a specific [annotationDefinition](to-training-data.md#annotationdefinition.generator.documenttarget$toTrainingData(kotlin.collections.Map((document.Document, kotlin.collections.List((kotlin.collections.MutableMap((kotlin.String, document.annotation.Annotation((annotationdefinition.target.Target)))))))), annotationdefinition.TagSetAnnotationDefinition, project.annotationschema.AnnotationStepKey)/annotationDefinition). Will go through all labels for the [TagSetAnnotationDefinition](../../annotationdefinition/-tag-set-annotation-definition/index.md), and add all document texts where the [AnnotationMap](../../document.annotation/-annotation-map.md)s for the [Document](../../document/-document/index.md), has a most common value equal to the label in question`fun `[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)`<`[`Document`](../../document/-document/index.md)`, `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationMap`](../../document.annotation/-annotation-map.md)`>>.toTrainingData(annotationDefinition: `[`TagSetAnnotationDefinition`](../../annotationdefinition/-tag-set-annotation-definition/index.md)`, input: `[`AnnotationStepKey`](../../project.annotationschema/-annotation-step-key/index.md)`): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`TrainingSampleWithLabels`](../-training-sample-with-labels/index.md)`>` |
[activeannoservice](../../index.md) / [annotationdefinition.generator](../index.md) / [AnnotationGenerator](index.md) / [input](./input.md)

# input

`var input: `[`AnnotationStepKey`](../../project.annotationschema/-annotation-step-key/index.md)

We need to define the [input](./input.md) to an [AnnotationGenerator](index.md) directly here, because a single [AnnotationGenerator](index.md) can be shared by multiple
projects. For prediction, a generator is always in context of a specific project, but for updating it, it is not.


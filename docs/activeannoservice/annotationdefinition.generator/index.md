[activeannoservice](../index.md) / [annotationdefinition.generator](./index.md)

## Package annotationdefinition.generator

### Types

| Name | Summary |
|---|---|
| [AnnotationGenerator](-annotation-generator/index.md) | Base class for [AnnotationGenerator](-annotation-generator/index.md)s. An annotation generator is responsible for automatically generating an annotation value, optionally with a probability attached, for a specific annotation definition. This can be used for statistical methods, simple if-else annotation (for example: if value in list of values, annotate with X), or for machine learning integration.`abstract class AnnotationGenerator` |
| [AnnotationGeneratorDAO](-annotation-generator-d-a-o/index.md) | DAO for [AnnotationGenerator](-annotation-generator/index.md)s`class AnnotationGeneratorDAO` |
| [FinalizeCondition](-finalize-condition/index.md) | Condition system which decides if a generated annotation can be finalized automatically`sealed class FinalizeCondition` |
| [UpdatableAnnotationGenerator](-updatable-annotation-generator/index.md) | Base class for [AnnotationGenerator](-annotation-generator/index.md)s which are updatable, for example ML models, as compared to static models like a statistics based generator`abstract class UpdatableAnnotationGenerator : `[`AnnotationGenerator`](-annotation-generator/index.md) |
| [UpdatableAnnotationGeneratorVersion](-updatable-annotation-generator-version/index.md) | `data class UpdatableAnnotationGeneratorVersion` |
| [UpdateResponse](-update-response/index.md) | `data class UpdateResponse` |
| [UpdateState](-update-state/index.md) | `enum class UpdateState` |

[activeannoservice](../index.md) / [project.annotationschema](./index.md)

## Package project.annotationschema

### Types

| Name | Summary |
|---|---|
| [And](-and/index.md) | `data class And : `[`EnableCondition`](-enable-condition/index.md) |
| [AnnotationSchema](-annotation-schema/index.md) | Annotation schema as defined in the database (with ID references to [AnnotationDefinition](../annotationdefinition/-annotation-definition/index.md)s and [AnnotationGenerator](../annotationdefinition.generator/-annotation-generator/index.md)s.`data class AnnotationSchema` |
| [AnnotationSchemaElement](-annotation-schema-element/index.md) | Single element of the schema, mapping the ID of an [AnnotationDefinition](../annotationdefinition/-annotation-definition/index.md) to data specific to this project and the [Target](../annotationdefinition.target/-target/index.md) of the annotation. different target definition for the same annotation`data class AnnotationSchemaElement` |
| [AnnotationsKey](-annotations-key/index.md) | Get some data from some annotations`data class AnnotationsKey : `[`AnnotationStepKey`](-annotation-step-key/index.md) |
| [AnnotationStepKey](-annotation-step-key/index.md) | Base class for subclasses that define how some data from a [Document](../document/-document/index.md) or [GeneratedAnnotationData](../document.annotation/-generated-annotation-data/index.md) is extracted and used for EnableCondition or annotation generation.`sealed class AnnotationStepKey` |
| [AtomicEnableCondition](-atomic-enable-condition/index.md) | [AtomicEnableCondition](-atomic-enable-condition/index.md)s are defined in relation to a single [referenceKey](-atomic-enable-condition/reference-key.md) and do not include more complex conditions such as [And](-and/index.md) or [Or](-or/index.md).`abstract class AtomicEnableCondition : `[`EnableCondition`](-enable-condition/index.md) |
| [DenormalizedAnnotationSchema](-denormalized-annotation-schema/index.md) | Annotation schema as sent to the frontend / client, contains the actual models of [AnnotationDefinition](../annotationdefinition/-annotation-definition/index.md), [AnnotationGenerator](../annotationdefinition.generator/-annotation-generator/index.md) etc.`data class DenormalizedAnnotationSchema` |
| [DenormalizedAnnotationSchemaElement](-denormalized-annotation-schema-element/index.md) | Equivalent to [AnnotationSchemaElement](-annotation-schema-element/index.md) but denormalized, meaning all ID references are replaced by the actual objects`data class DenormalizedAnnotationSchemaElement` |
| [EnableCondition](-enable-condition/index.md) | [AnnotationSchemaElement](-annotation-schema-element/index.md)s can be conditional, defined by an [EnableCondition](-enable-condition/index.md). If an [EnableCondition](-enable-condition/index.md) is null, that means it is always required. Else, the enable conditions [execute](-enable-condition/execute.md) method needs to return true for the element to be prompted.`abstract class EnableCondition` |
| [Not](-not/index.md) | `data class Not : `[`EnableCondition`](-enable-condition/index.md) |
| [Or](-or/index.md) | `data class Or : `[`EnableCondition`](-enable-condition/index.md) |
| [OriginalDocumentKey](-original-document-key/index.md) | Get some data from the originalDocument of a [Document](../document/-document/index.md)`data class OriginalDocumentKey : `[`AnnotationStepKey`](-annotation-step-key/index.md) |
| [ValuesEqual](-values-equal/index.md) | `class ValuesEqual : `[`AtomicEnableCondition`](-atomic-enable-condition/index.md) |
| [ValuesExist](-values-exist/index.md) | `class ValuesExist : `[`AtomicEnableCondition`](-atomic-enable-condition/index.md) |
| [ValuesIntersect](-values-intersect/index.md) | `class ValuesIntersect : `[`AtomicEnableCondition`](-atomic-enable-condition/index.md) |

### Functions

| Name | Summary |
|---|---|
| [denormalize](denormalize.md) | `suspend fun `[`AnnotationSchema`](-annotation-schema/index.md)`.denormalize(): `[`DenormalizedAnnotationSchema`](-denormalized-annotation-schema/index.md)<br>`suspend fun `[`AnnotationSchemaElement`](-annotation-schema-element/index.md)`.denormalize(): `[`DenormalizedAnnotationSchemaElement`](-denormalized-annotation-schema-element/index.md) |

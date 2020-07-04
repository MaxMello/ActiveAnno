

### All Types

| Name | Summary |
|---|---|
|

##### [api.manage.AccuracyStatistics](../api.manage/-accuracy-statistics/index.md)

Statistics about the accuracy and IAA


|

##### [project.layout.elements.action.ActionElement](../project.layout.elements.action/-action-element/index.md)

Intermediary interface which marks subtypes as elements altering the state of the application by setting some annotation value


|

##### [api.manage.AnalyzedAnnotationResult](../api.manage/-analyzed-annotation-result/index.md)

Analyzed individual annotation result


|

##### [api.manage.AnalyzedDocument](../api.manage/-analyzed-document/index.md)

A document with additional statistics like agreement and correctness


|

##### [api.manage.AnalyzeProjectRequest](../api.manage/-analyze-project-request/index.md)

Request body for analyze endpoint


|

##### [api.manage.AnalyzeProjectResponse](../api.manage/-analyze-project-response/index.md)

Analyze response with [TopLevelStatistics](../api.manage/-top-level-statistics/index.md) and a list of [AnalyzedDocument](../api.manage/-analyzed-document/index.md)s


|

##### [project.annotationschema.And](../project.annotationschema/-and/index.md)


|

##### [project.filter.And](../project.filter/-and/index.md)


|

##### [api.annotate.dto.AnnotateProject](../api.annotate.dto/-annotate-project/index.md)

View data class - all properties relevant to annotate / curate a project in the frontend


|

##### [document.annotation.Annotation](../document.annotation/-annotation.md)

Base class for any annotation. An [Annotation](../document.annotation/-annotation.md) is defined as the actual value associated with an AnnotationDefinition. For example,
a BooleanAnnotationDefinition will produce a single annotation of boolean type. This annotation might be created by a human annotator, or
automatically generated or imported.
Every [Annotation](../document.annotation/-annotation.md) needs to be associated with an annotation ID / key in a map or comparable structure


|

##### [annotationdefinition.AnnotationDefinition](../annotationdefinition/-annotation-definition/index.md)

Base class for all [AnnotationDefinition](../annotationdefinition/-annotation-definition/index.md)s. An [AnnotationDefinition](../annotationdefinition/-annotation-definition/index.md) defines how an annotation is required to be
created, e.g. on which target it is defined, is it optional, maximum length etc.


|

##### [annotationdefinition.AnnotationDefinitionDAO](../annotationdefinition/-annotation-definition-d-a-o/index.md)


|

##### [annotationdefinition.AnnotationDefinitionList](../annotationdefinition/-annotation-definition-list/index.md)

Wrapper class to prevent type erasure of [AnnotationDefinition](../annotationdefinition/-annotation-definition/index.md). This way, the JsonSubType info is preserved.


|

##### [api.annotate.AnnotationDocument](../api.annotate/-annotation-document/index.md)

Model for annotating a document for the frontend


|

##### [api.annotate.AnnotationEnableConditionResult](../api.annotate/-annotation-enable-condition-result/index.md)

A single EnableCondition applied result, indicating if an annotation is [required](../api.annotate/-annotation-enable-condition-result/required.md) or not.


|

##### [annotationdefinition.generator.AnnotationGenerator](../annotationdefinition.generator/-annotation-generator/index.md)

Base class for [AnnotationGenerator](../annotationdefinition.generator/-annotation-generator/index.md)s. An annotation generator is responsible for automatically generating an annotation value, optionally with
a probability attached, for a specific annotation definition. This can be used for statistical methods, simple if-else annotation
(for example: if value in list of values, annotate with X), or for machine learning integration.


|

##### [annotationdefinition.generator.AnnotationGeneratorDAO](../annotationdefinition.generator/-annotation-generator-d-a-o/index.md)

DAO for [AnnotationGenerator](../annotationdefinition.generator/-annotation-generator/index.md)s


|

##### [annotationdefinition.AnnotationID](../annotationdefinition/-annotation-i-d.md)


|

##### [document.annotation.AnnotationMap](../document.annotation/-annotation-map.md)


|

##### [document.annotation.AnnotationResult](../document.annotation/-annotation-result/index.md)

Data class representing a single annotation result by either an annotator, a curator or a merge of annotator responses
by the policy logic.


|

##### [document.annotation.AnnotationResultCreator](../document.annotation/-annotation-result-creator/index.md)

The [AnnotationResultCreator](../document.annotation/-annotation-result-creator/index.md) represents by whom an [AnnotationResult](../document.annotation/-annotation-result/index.md) was created, which can be by humans ([Annotator](../document.annotation/-annotation-result-creator/-annotator/index.md), [Curator](../document.annotation/-annotation-result-creator/-curator/index.md)),
a machine [Generators](../document.annotation/-annotation-result-creator/-generators/index.md), externally [Import](../document.annotation/-annotation-result-creator/-import/index.md) or through consensus of all the previous [Consensus](../document.annotation/-annotation-result-creator/-consensus/index.md).


|

##### [api.annotate.AnnotationResultCreatorDTO](../api.annotate/-annotation-result-creator-d-t-o/index.md)

Equivalent to [AnnotationResultCreator](../document.annotation/-annotation-result-creator/index.md) but streamlined to a single [displayName](../api.annotate/-annotation-result-creator-d-t-o/display-name.md) for the frontend


|

##### [document.annotation.AnnotationResultID](../document.annotation/-annotation-result-i-d.md)


|

##### [api.annotate.dto.AnnotationResultStoreResponse](../api.annotate.dto/-annotation-result-store-response/index.md)

Return model for storing endpoints, letting the frontend know the data was stored successfully. If not, will return
[validationErrors](../api.annotate.dto/-annotation-result-store-response/validation-errors.md)


|

##### [project.annotationschema.AnnotationSchema](../project.annotationschema/-annotation-schema/index.md)

Annotation schema as defined in the database (with ID references to [AnnotationDefinition](../annotationdefinition/-annotation-definition/index.md)s
and [AnnotationGenerator](../annotationdefinition.generator/-annotation-generator/index.md)s.


|

##### [project.annotationschema.AnnotationSchemaElement](../project.annotationschema/-annotation-schema-element/index.md)

Single element of the schema, mapping the ID of an [AnnotationDefinition](../annotationdefinition/-annotation-definition/index.md) to data specific to this project
and the [Target](../annotationdefinition.target/-target/index.md) of the annotation.
different target definition for the same annotation


|

##### [project.annotationschema.AnnotationsKey](../project.annotationschema/-annotations-key/index.md)

Get some data from some annotations


|

##### [project.annotationschema.AnnotationStepKey](../project.annotationschema/-annotation-step-key/index.md)

Base class for subclasses that define how some data from a [Document](../document/-document/index.md) or [GeneratedAnnotationData](../document.annotation/-generated-annotation-data/index.md) is extracted
and used for EnableCondition or annotation generation.


| (extensions in package common)

##### [kotlin.Any](../common/kotlin.-any/index.md)


| (extensions in package application)

##### [io.ktor.application.Application](../application/io.ktor.application.-application/index.md)


| (extensions in package common)

##### [io.ktor.application.ApplicationCall](../common/io.ktor.application.-application-call/index.md)


|

##### [application.ApplicationConfig](../application/-application-config/index.md)

To have easy access to the configuration properties of the application, this class exists


|

##### [project.annotationschema.AtomicEnableCondition](../project.annotationschema/-atomic-enable-condition/index.md)

[AtomicEnableCondition](../project.annotationschema/-atomic-enable-condition/index.md)s are defined in relation to a single [referenceKey](../project.annotationschema/-atomic-enable-condition/reference-key.md) and do not include more complex conditions
such as [And](../project.annotationschema/-and/index.md) or [Or](../project.annotationschema/-or/index.md).


|

##### [project.layout.elements.display.Base64Image](../project.layout.elements.display/-base64-image/index.md)

Element displaying a constant Base64 encoded image


|

##### [project.layout.elements.display.Base64ImageMetaData](../project.layout.elements.display/-base64-image-meta-data/index.md)

Display a meta data element that is a base64 encoded image


|

##### [project.layout.elements.display.Bold](../project.layout.elements.display/-bold/index.md)

Wrapper element, all children's text elements will be bold. Equivalent to an inline html element with fontWeight bold
which will be applied to the children.


|

##### [annotationdefinition.BooleanAnnotationDefinition](../annotationdefinition/-boolean-annotation-definition/index.md)

Annotation for a boolean input.


|

##### [project.layout.elements.action.BooleanButtonGroup](../project.layout.elements.action/-boolean-button-group/index.md)


|

##### [project.layout.ButtonColor](../project.layout/-button-color/index.md)


|

##### [project.layout.ButtonSize](../project.layout/-button-size/index.md)


|

##### [annotationdefinition.CaseBehavior](../annotationdefinition/-case-behavior/index.md)

How to handle differences in cases between tags?


|

##### [api.annotate.CheckEnableConditionRequestBody](../api.annotate/-check-enable-condition-request-body/index.md)

Data class to receive a check enable condition request


|

##### [api.annotate.CheckEnableConditionResponse](../api.annotate/-check-enable-condition-response/index.md)

Data class for the response body of the check enable condition request


|

##### [annotationdefinition.ClosedNumberAnnotationDefinition](../annotationdefinition/-closed-number-annotation-definition/index.md)

Annotation for a closed number with a min, max and required step. Necessary if you want to display annotation as a slider.


|

##### [project.layout.elements.action.ClosedNumberSlider](../project.layout.elements.action/-closed-number-slider/index.md)


|

##### [project.layout.Column](../project.layout/-column/index.md)

A column is part of a row and has a width dependent of screen size. Every row should have at least one column.


|

##### [project.layout.ColumnSizes](../project.layout/-column-sizes/index.md)

The UI defines 5 different screen size breakpoints, from smallest (xs) to largest (xl). The actual pixel breakpoints
are defined by the UI. Column sizes should be in [1,12](#) range, 12 being the full width of the row, 1 being 1/12 width of the row.
At least xs needs to be defined.


|

##### [project.filter.ContainsAll](../project.filter/-contains-all/index.md)

Equivalent to And connection between Contains conditions, exists as shorthand
Example:
{ tags: { $all: [ssl,security](#) } } =&gt; { $and: [{tags:ssl},{tags:security}](#) }


| (extensions in package common)

##### [org.litote.kmongo.coroutine.CoroutineDatabase](../common/org.litote.kmongo.coroutine.-coroutine-database/index.md)


|

##### [application.Cors](../application/-cors/index.md)

Data class representing the CORS config


|

##### [project.inputmapping.CreateIndex](../project.inputmapping/-create-index/index.md)

Use this to define a non-text index with an order as well as an optional unique constraint


|

##### [api.generators.DataForGeneratorRequest](../api.generators/-data-for-generator-request/index.md)


|

##### [project.filter.DateGreaterThanEquals](../project.filter/-date-greater-than-equals/index.md)

Filter based on a mapping a date string to timestamp and then performing GTE on the [value](../project.filter/-date-greater-than-equals/value.md) provided.


|

##### [project.filter.DateLessThanEquals](../project.filter/-date-less-than-equals/index.md)

Filter based on a mapping a date string to timestamp and then performing LTE on the [value](../project.filter/-date-less-than-equals/value.md) provided. If the value is not existing,
won't return the document


|

##### [project.layout.elements.display.DateMetaData](../project.layout.elements.display/-date-meta-data/index.md)

Convert some input date format (e.g. timestamp) to date format or do nothing if not a timestamp for a given meta data element


|

##### [project.selection.DateRangeFilter](../project.selection/-date-range-filter/index.md)

How should the date range filter work


| (extensions in package common)

##### [com.auth0.jwt.interfaces.DecodedJWT](../common/com.auth0.jwt.interfaces.-decoded-j-w-t/index.md)


|

##### [project.layout.elements.action.DenormalizedActionElement](../project.layout.elements.action/-denormalized-action-element/index.md)


|

##### [project.annotationschema.DenormalizedAnnotationSchema](../project.annotationschema/-denormalized-annotation-schema/index.md)

Annotation schema as sent to the frontend / client, contains the actual models of [AnnotationDefinition](../annotationdefinition/-annotation-definition/index.md),
[AnnotationGenerator](../annotationdefinition.generator/-annotation-generator/index.md) etc.


|

##### [project.annotationschema.DenormalizedAnnotationSchemaElement](../project.annotationschema/-denormalized-annotation-schema-element/index.md)

Equivalent to [AnnotationSchemaElement](../project.annotationschema/-annotation-schema-element/index.md) but denormalized, meaning all ID references are replaced
by the actual objects


|

##### [project.layout.elements.action.DenormalizedBooleanButtonGroup](../project.layout.elements.action/-denormalized-boolean-button-group/index.md)


|

##### [project.layout.elements.action.DenormalizedClosedNumberSlider](../project.layout.elements.action/-denormalized-closed-number-slider/index.md)


|

##### [project.layout.elements.action.DenormalizedNumberRangeSlider](../project.layout.elements.action/-denormalized-number-range-slider/index.md)


|

##### [project.layout.elements.action.DenormalizedOpenNumberInput](../project.layout.elements.action/-denormalized-open-number-input/index.md)


|

##### [project.layout.elements.action.DenormalizedOpenTagChipInput](../project.layout.elements.action/-denormalized-open-tag-chip-input/index.md)


|

##### [project.layout.elements.action.DenormalizedOpenTextInput](../project.layout.elements.action/-denormalized-open-text-input/index.md)


|

##### [project.layout.elements.action.DenormalizedTagSetButtonGroup](../project.layout.elements.action/-denormalized-tag-set-button-group/index.md)


|

##### [project.layout.elements.action.DenormalizedTagSetDropdown](../project.layout.elements.action/-denormalized-tag-set-dropdown/index.md)


|

##### [annotationdefinition.generator.documenttarget.DetectedLanguageGenerator](../annotationdefinition.generator.documenttarget/-detected-language-generator/index.md)

[AnnotationGenerator](../annotationdefinition.generator/-annotation-generator/index.md) which detects the language using the "Lingua" library, storing the annotation under the
defined key as the ISO 639-1 Code (in upper case). The "unknown" key from Lingua is defined as the string "UNKNOWN"


|

##### [project.layout.elements.display.DisplayElement](../project.layout.elements.display/-display-element.md)

Intermediate interface specify that an Element is non-interactive, allows for restrictions of classes to require Elements to be non-interactive


|

##### [document.Document](../document/-document/index.md)

The data class representing a document with some [originalDocument](../document/-document/original-document.md), a unique [id](../document/-document/id.md), optionally a [restrictedProjectID](../document/-document/restricted-project-i-d.md)
(marking the document to belong only to that one project), and the [projectAnnotationData](../document/-document/project-annotation-data.md) holding all the annotations
for every project related to the document.


|

##### [document.DocumentDAO](../document/-document-d-a-o/index.md)

This DAO provides all methods to interact with the document collection. It hides the collection and controls
access to it via the public methods.


|

##### [document.DocumentID](../document/-document-i-d.md)

To make code more readable, define the ID of a document as a typealias on String


|

##### [project.selection.DocumentSelection](../project.selection/-document-selection/index.md)

Given annotators and curators the ability to further specify which documents are shown to them


|

##### [project.selection.DocumentSelectionWithOptions](../project.selection/-document-selection-with-options/index.md)

Equivalent to [DocumentSelection](../project.selection/-document-selection/index.md) but with aggregated options inside


|

##### [api.manage.DocumentStatistics](../api.manage/-document-statistics/index.md)

Individual statistics for a document


|

##### [annotationdefinition.target.DocumentTarget](../annotationdefinition.target/-document-target/index.md)

Use this for annotations that should be created for the whole document.


|

##### [document.annotation.DocumentTargetAnnotation](../document.annotation/-document-target-annotation/index.md)

An annotation which is targeted on the whole document, not a specific part of it. For example, a class label "SPAM"
or "NO SPAM" for the whole document.


|

##### [project.inputmapping.DocumentText](../project.inputmapping/-document-text/index.md)


|

##### [project.layout.elements.display.DocumentTextElement](../project.layout.elements.display/-document-text-element/index.md)

Element displaying the document text.


| (extensions in package common)

##### [kotlin.Double](../common/kotlin.-double/index.md)


|

##### [project.annotationschema.EnableCondition](../project.annotationschema/-enable-condition/index.md)

[AnnotationSchemaElement](../project.annotationschema/-annotation-schema-element/index.md)s can be conditional, defined by an [EnableCondition](../project.annotationschema/-enable-condition/index.md).
If an [EnableCondition](../project.annotationschema/-enable-condition/index.md) is null, that means it is always required. Else, the enable conditions [execute](../project.annotationschema/-enable-condition/execute.md) method needs to return true
for the element to be prompted.


|

##### [project.filter.Equals](../project.filter/-equals/index.md)

Use for direct equals or array contains


|

##### [common.ErrorCode](../common/-error-code/index.md)

Enum representing detailed errors which are more granular than just the http status code


|

##### [project.export.Export](../project.export/-export/index.md)

Export configuration for consuming the results of this service


|

##### [project.export.ExportDocument](../project.export/-export-document/index.md)


|

##### [project.export.ExportFormat](../project.export/-export-format/index.md)

What aspects for the document and results to export


|

##### [document.annotation.ExportStatistics](../document.annotation/-export-statistics/index.md)

Data class holding information about where and how often the annotations were exported.


|

##### [application.FeaturesConfig](../application/-features-config/index.md)


|

##### [project.filter.FilterCondition](../project.filter/-filter-condition/index.md)

Light wrapper classes around MongoDB query elements. To use the [FilterCondition](../project.filter/-filter-condition/index.md) as a parameter for MongoDB find, call [buildQuery](../project.filter/-filter-condition/build-query.md) +on the
[FilterCondition](../project.filter/-filter-condition/index.md) object.
Support for:


|

##### [project.policy.FinalizeAnnotationPolicy](../project.policy/-finalize-annotation-policy/index.md)


|

##### [annotationdefinition.generator.FinalizeCondition](../annotationdefinition.generator/-finalize-condition/index.md)

Condition system which decides if a generated annotation can be finalized automatically


|

##### [document.annotation.FinalizedAnnotationResult](../document.annotation/-finalized-annotation-result/index.md)

Data class representing a finalized annotation, which can be one or multiple annotations (referenced by their IDs).
It also contains meta data about why the document was finalized, which policy was used, when the finalization happened,
and statistics about how the annotations were exported.


|

##### [api.manage.FinalizedAnnotationResultForAnalysis](../api.manage/-finalized-annotation-result-for-analysis/index.md)

Finalized annotation result used for the analze response


|

##### [document.annotation.FinalizedReason](../document.annotation/-finalized-reason/index.md)

Sealed class with two options why a annotation can be finalized


|

##### [common.ForbiddenException](../common/-forbidden-exception/index.md)

Custom exception indicating the user is not authorized properly (missing role), will be used to return appropriate http error code


|

##### [document.annotation.GeneratedAnnotationData](../document.annotation/-generated-annotation-data/index.md)

When a Project has any AnnotationGenerator defined through the AnnotationSchema, they will store their results here.
Every time annotation generation is triggered, every generator will be executed again and a new instance of this class
will be added to the ProjectAnnotationData


|

##### [project.annotationschema.generator.GeneratedAnnotationResultHandling](../project.annotationschema.generator/-generated-annotation-result-handling/index.md)


|

##### [project.annotationschema.generator.GeneratorSortingPolicy](../project.annotationschema.generator/-generator-sorting-policy/index.md)

How to handle sorting of documents for annotators when generated results is available


|

##### [project.annotationschema.generator.GeneratorTiming](../project.annotationschema.generator/-generator-timing/index.md)


|

##### [common.GoneException](../common/-gone-exception/index.md)

Exception indicating that a resource is gone, will be used through StatusPages feature to return the proper status code when this exception is
thrown


|

##### [project.filter.GreaterThan](../project.filter/-greater-than/index.md)


|

##### [project.filter.GreaterThanEquals](../project.filter/-greater-than-equals/index.md)


|

##### [project.annotationschema.generator.HandlingPolicy](../project.annotationschema.generator/-handling-policy/index.md)


|

##### [project.annotationschema.generator.HandlingPolicyType](../project.annotationschema.generator/-handling-policy-type/index.md)


|

##### [annotationdefinition.HierarchicalTagSetAnnotationDefinition](../annotationdefinition/-hierarchical-tag-set-annotation-definition/index.md)

Annotation definition which requests the annotator to chose from a set of predefined [TagSetOption](#)s


|

##### [common.HttpAuthentication](../common/-http-authentication/index.md)

Inspiration: https://www.sparkpost.com/docs/tech-resources/webhook-authentication/


|

##### [common.HttpErrorException](../common/-http-error-exception/index.md)

Base exception for HTTP errors, can optionally include a detailed http error


|

##### [common.HttpErrorResponse](../common/-http-error-response/index.md)

Data class to return on an http error, which can have a more detailed [errorCode](../common/-http-error-response/error-code.md) explaining the reason for the status code


| (extensions in package common)

##### [io.ktor.client.request.HttpRequestBuilder](../common/io.ktor.client.request.-http-request-builder/index.md)


|

##### [project.layout.elements.display.Icon](../project.layout.elements.display/-icon/index.md)

Display a material icon


|

##### [api.import.ImportDocumentResult](../api.import/-import-document-result/index.md)

Return list of generated documentIDs in order of imported jsons from request body


|

##### [api.import.ImportedAnnotationRequest](../api.import/-imported-annotation-request/index.md)

Request body to import annotations


|

##### [project.filter.In](../project.filter/-in/index.md)


|

##### [project.inputmapping.InputMapping](../project.inputmapping/-input-mapping/index.md)

Mapping of originalDocument to documentData used in UI. Will be mapped based on this classes values.
Additionally, provides the ability to define indices for faster queries in DB


|

##### [document.annotation.InteractionLog](../document.annotation/-interaction-log/index.md)

Data class representing log data from the interaction of the user with the document during annotation.


|

##### [project.layout.elements.display.Italic](../project.layout.elements.display/-italic/index.md)

Wrapper element, all children's text elements will be italic. Equivalent to an inline html element with italic font style
which will be applied to the children.


| (extensions in package common)

##### [kotlin.collections.Iterable](../common/kotlin.collections.-iterable/index.md)


| (extensions in package common)

##### [com.fasterxml.jackson.databind.JsonNode](../common/com.fasterxml.jackson.databind.-json-node/index.md)


|

##### [application.JwtConfiguration](../application/-jwt-configuration/index.md)

Data class representing the JTW configuration


|

##### [application.JwtValidation](../application/-jwt-validation/index.md)

Data class representing the JWT validation configuration


|

##### [project.filter.KeyExists](../project.filter/-key-exists/index.md)


|

##### [application.KtorHttpsConfig](../application/-ktor-https-config/index.md)

Data class representing the HTTPS config for ktor


|

##### [project.layout.Layout](../project.layout/-layout/index.md)

Define the layout of how annotation interactions / inputs will be displayed in the UI.


|

##### [project.layout.LayoutArea](../project.layout/-layout-area/index.md)

Mapping of layout areas to list of rows containing UI elements


|

##### [project.layout.LayoutAreaType](../project.layout/-layout-area-type/index.md)

There are 4 different UI areas which are defined by this enum. All four areas can contain read-only/display elements,
but not all are allowed to have all types of interaction elements.


|

##### [project.layout.LayoutElement](../project.layout/-layout-element.md)

Interface for all UI elements, uses json polymorphic deserialization to map into actual UI elements.


|

##### [project.filter.LessThan](../project.filter/-less-than/index.md)


|

##### [project.filter.LessThanEquals](../project.filter/-less-than-equals/index.md)


| (extensions in package api.manage)

##### [kotlin.collections.List](../api.manage/kotlin.collections.-list/index.md)


|

##### [api.annotate.dto.ListProject](../api.annotate.dto/-list-project/index.md)

View data class - all properties necessary to display project in list in the frontend


|

##### [api.manage.dto.ManageListProject](../api.manage.dto/-manage-list-project/index.md)

View data class - all properties necessary to display project in list in the frontend for managers


|

##### [api.manage.dto.ManageProject](../api.manage.dto/-manage-project/index.md)

View data class - all properties necessary to display and edit project from management perspective in frontend


| (extensions in package annotationdefinition.generator.documenttarget)

##### [kotlin.collections.Map](../annotationdefinition.generator.documenttarget/kotlin.collections.-map/index.md)


|

##### [user.message.Message](../user.message/-message/index.md)

A message is a text between two users, optionally relating to an [AnnotationResult](../document.annotation/-annotation-result/index.md)


|

##### [user.message.MessageDAO](../user.message/-message-d-a-o/index.md)

DAO for the [Message](../user.message/-message/index.md) model, controlling access to the message collection.


|

##### [project.inputmapping.MetaData](../project.inputmapping/-meta-data/index.md)


|

##### [project.layout.elements.display.MetaDataMapping](../project.layout.elements.display/-meta-data-mapping/index.md)

For a meta data element, use the value as a key to the [mapping](../project.layout.elements.display/-meta-data-mapping/mapping.md) map and display a list of
[DisplayElement](../project.layout.elements.display/-display-element.md)s or the fallback if no value is found for the key


|

##### [application.MongoConfig](../application/-mongo-config/index.md)

Data class representing the MongoDB config


|

##### [project.layout.elements.display.MonospaceFont](../project.layout.elements.display/-monospace-font/index.md)

Wrapper element, all children's text elements will use a monospace font. Equivalent to an inline html element with a monospace font
which will be applied to the children.


| (extensions in package common)

##### [kotlin.collections.MutableList](../common/kotlin.collections.-mutable-list/index.md)


| (extensions in package api.annotate.dto)

##### [kotlin.collections.MutableMap](../api.annotate.dto/kotlin.collections.-mutable-map/index.md)


| (extensions in package common)

##### [kotlin.collections.MutableMap](../common/kotlin.collections.-mutable-map/index.md)


|

##### [project.filter.Nor](../project.filter/-nor/index.md)


|

##### [project.annotationschema.Not](../project.annotationschema/-not/index.md)


|

##### [project.filter.Not](../project.filter/-not/index.md)


|

##### [project.filter.NotEquals](../project.filter/-not-equals/index.md)


|

##### [project.filter.NotIn](../project.filter/-not-in/index.md)


|

##### [annotationdefinition.NumberRangeAnnotationDefinition](../annotationdefinition/-number-range-annotation-definition/index.md)

A number range between [min](../annotationdefinition/-number-range-annotation-definition/min.md) and [max](../annotationdefinition/-number-range-annotation-definition/max.md) with [step](../annotationdefinition/-number-range-annotation-definition/step.md) steps between. Results in two values, a lower and upper value.


|

##### [project.layout.elements.action.NumberRangeSlider](../project.layout.elements.action/-number-range-slider/index.md)


| (extensions in package common)

##### [com.fasterxml.jackson.databind.node.ObjectNode](../common/com.fasterxml.jackson.databind.node.-object-node/index.md)


|

##### [project.export.OnOverwrittenFinalizedAnnotationBehavior](../project.export/-on-overwritten-finalized-annotation-behavior/index.md)

Define behavior what to do when a finalizedAnnotation was defined, but a new one was set afterwards. This would not
happen normally, but cannot be prevented for cases where an annotation is found via search to correct an earlier
mistake. For this case, we need to define if we want to trigger web hooks again or not.


|

##### [project.export.OnWebHookFailureBehavior](../project.export/-on-web-hook-failure-behavior/index.md)

What to do when calling the WebHook failed


|

##### [annotationdefinition.OpenNumberAnnotationDefinition](../annotationdefinition/-open-number-annotation-definition/index.md)

Annotation for an unrestricted number. Cannot be displayed as a slider, only number input.


|

##### [project.layout.elements.action.OpenNumberInput](../project.layout.elements.action/-open-number-input/index.md)

HTML Number input


|

##### [annotationdefinition.OpenTagAnnotationDefinition](../annotationdefinition/-open-tag-annotation-definition/index.md)

Tags annotation with the ability to add new tags from the user. Here, the tag is just a string / the value is the actual string


|

##### [project.layout.elements.action.OpenTagChipInput](../project.layout.elements.action/-open-tag-chip-input/index.md)

Chips element is a variable list of text inputs (tags) which can be extended, including an auto-complete feature with predefined answers.


|

##### [annotationdefinition.OpenTextAnnotationDefinition](../annotationdefinition/-open-text-annotation-definition/index.md)

Annotation for some open text input


|

##### [project.layout.elements.action.OpenTextInput](../project.layout.elements.action/-open-text-input/index.md)

A multi line text input field


|

##### [project.annotationschema.Or](../project.annotationschema/-or/index.md)


|

##### [project.filter.Or](../project.filter/-or/index.md)


|

##### [project.sort.Order](../project.sort/-order/index.md)

Enum representing the order options, ASC and DESC


|

##### [project.annotationschema.OriginalDocumentKey](../project.annotationschema/-original-document-key/index.md)

Get some data from the originalDocument of a [Document](../document/-document/index.md)


|

##### [api.pagesetup.Page](../api.pagesetup/-page/index.md)

A [Page](../api.pagesetup/-page/index.md) represents a UI page of the frontend, optionally with a [badgeCount](../api.pagesetup/-page/badge-count.md) to indicate how many interactions
are waiting for the user


|

##### [api.pagesetup.PageSetup](../api.pagesetup/-page-setup/index.md)

Model for frontend communication representing the PageSetup, controlling the layout and core data for the page setup
of the frontend


|

##### [api.manage.PercentWrapper](../api.manage/-percent-wrapper/index.md)

Wrap the percent by storing [n](../api.manage/-percent-wrapper/n.md), the [absolute](../api.manage/-percent-wrapper/absolute.md) value as well as the calulcated percent value.


| (extensions in package common)

##### [io.ktor.util.pipeline.PipelineContext](../common/io.ktor.util.pipeline.-pipeline-context/index.md)


|

##### [project.policy.Policy](../project.policy/-policy/index.md)

Data class defining policy of how to handle documents / annotations, especially how and when to finalize an annotation
for a document and project.


|

##### [project.policy.PolicyAction](../project.policy/-policy-action/index.md)

Sealed class for the different actions that can be required to be taken for a document to get the annotation done
properly


|

##### [project.policy.PolicyFailureException](../project.policy/-policy-failure-exception/index.md)


|

##### [project.layout.elements.display.Popover](../project.layout.elements.display/-popover/index.md)

A popover element, providing the ability to hide information (no interactions!) befind a popover


|

##### [project.layout.elements.display.PopoverContent](../project.layout.elements.display/-popover-content/index.md)

The PopoverContent are display elements which will be shown when the popover is visible


|

##### [project.layout.elements.display.PopoverTarget](../project.layout.elements.display/-popover-target/index.md)

The PopoverTarget will be displayed into the parent context directly (for example some text, an icon or a combination)


|

##### [project.layout.elements.display.PopoverTrigger](../project.layout.elements.display/-popover-trigger/index.md)

Two ways a popover can be triggered, by click or hover


|

##### [api.annotate.dto.PostAnnotationResult](../api.annotate.dto/-post-annotation-result/index.md)

Data class for annotation and curation endpoints for receiving annotation results. Will be mapped into
other data structures for storing.


|

##### [project.Project](../project/-project/index.md)

Complete model of a project. This model represents the database structure / is stored in mongoDB


|

##### [document.ProjectAnnotationData](../document/-project-annotation-data/index.md)

Data class representing all annotation data for a specific project.


|

##### [project.ProjectDAO](../project/-project-d-a-o/index.md)

DAO for the [Project](../project/-project/index.md) regulating access to the project collection


|

##### [project.ProjectID](../project/-project-i-d.md)


|

##### [api.manage.ProjectStoreResponse](../api.manage/-project-store-response/index.md)

Response body for storing a [Project](#) with success info and validation errors


|

##### [project.ProjectValidationError](../project/-project-validation-error/index.md)

A single validation error for a specific key of the [ManageProject](#)


|

##### [project.filter.Regex](../project.filter/-regex/index.md)


|

##### [project.export.RestAuthentication](../project.export/-rest-authentication/index.md)


|

##### [document.annotation.RestCall](../document.annotation/-rest-call/index.md)

Information about an export via rest call, mainly the route called, how often, and when.


|

##### [project.export.RestConfig](../project.export/-rest-config/index.md)

What REST endpoints to activate and how to export them


| (extensions in package api.admin)

##### [io.ktor.routing.Route](../api.admin/io.ktor.routing.-route/index.md)


| (extensions in package api.annotate)

##### [io.ktor.routing.Route](../api.annotate/io.ktor.routing.-route/index.md)


| (extensions in package api.export)

##### [io.ktor.routing.Route](../api.export/io.ktor.routing.-route/index.md)


| (extensions in package api.generators)

##### [io.ktor.routing.Route](../api.generators/io.ktor.routing.-route/index.md)


| (extensions in package api.import)

##### [io.ktor.routing.Route](../api.import/io.ktor.routing.-route/index.md)


| (extensions in package api.manage)

##### [io.ktor.routing.Route](../api.manage/io.ktor.routing.-route/index.md)


| (extensions in package api.pagesetup)

##### [io.ktor.routing.Route](../api.pagesetup/io.ktor.routing.-route/index.md)


| (extensions in package api.search)

##### [io.ktor.routing.Route](../api.search/io.ktor.routing.-route/index.md)


| (extensions in package common)

##### [io.ktor.routing.Route](../common/io.ktor.routing.-route/index.md)


|

##### [project.layout.Row](../project.layout/-row/index.md)

Equivalent to a Row of UI layout systems like Bootstrap or Material UI


|

##### [api.search.SearchRequest](../api.search/-search-request/index.md)

Model representing a search request


|

##### [api.search.SearchResultDocument](../api.search/-search-result-document/index.md)

The [SearchResultDocument](../api.search/-search-result-document/index.md) is a view on a document with all useful data for display in the search result area
in the frontend.


|

##### [project.selection.SelectionType](../project.selection/-selection-type/index.md)

How to select a subfilter


|

##### [project.filter.Size](../project.filter/-size/index.md)


|

##### [project.sort.Sort](../project.sort/-sort/index.md)

Data class representing mongo DB sort


|

##### [project.sort.SortElement](../project.sort/-sort-element/index.md)

Single sort element with key and order


|

##### [document.annotation.Span](../document.annotation/-span/index.md)

A span is a single piece of a string, expressed by [begin](../document.annotation/-span/begin.md) and [end](../document.annotation/-span/end.md).


|

##### [annotationdefinition.target.SpanGranularity](../annotationdefinition.target/-span-granularity/index.md)

What is the allowed cutoff point for a span, a single character or only whole tokens?


|

##### [annotationdefinition.target.SpanTarget](../annotationdefinition.target/-span-target/index.md)

Use this for annotations that should be created for a specific span. Define characteristics of how the span should be set.


|

##### [document.annotation.SpanTargetAnnotation](../document.annotation/-span-target-annotation/index.md)

All annotation values for a single AnnotationDefinition on a span target are represented by a [SpanTargetAnnotation](../document.annotation/-span-target-annotation/index.md).
For example, a document might have spans of positive and negative sentiment. All annotations regarding sentiment would be
stored in a single [SpanTargetAnnotation](../document.annotation/-span-target-annotation/index.md), holding a list of [annotations](../document.annotation/-span-target-annotation/annotations.md) of which each defines the spans concering the annotation
as well as the actual value, in this case POSITIVE or NEGATIVE sentiment.


|

##### [document.annotation.SpanTargetSingleAnnotation](../document.annotation/-span-target-single-annotation/index.md)

A [SpanTargetSingleAnnotation](../document.annotation/-span-target-single-annotation/index.md) maps a single annotation value to the [spans](../document.annotation/-span-target-single-annotation/spans.md) (often only a single span) which the annotation value
is associated with.


| (extensions in package common)

##### [kotlin.String](../common/kotlin.-string/index.md)


|

##### [project.filter.StringEquals](../project.filter/-string-equals/index.md)

Class to compare value inside document and [value](../project.filter/-string-equals/value.md) both as strings, using Mongos expr feature


|

##### [project.selection.SubFilter](../project.selection/-sub-filter/index.md)

A [SubFilter](../project.selection/-sub-filter/index.md) is one element by which a user can filter documents shown


|

##### [project.selection.SubFilterOption](../project.selection/-sub-filter-option/index.md)

Option aggregated with count


|

##### [project.selection.SubFilterQueryResult](../project.selection/-sub-filter-query-result/index.md)

For subfilter selection query to map the result


|

##### [project.selection.SubFilterWithOptions](../project.selection/-sub-filter-with-options/index.md)

A subfilter but with options aggregated


|

##### [annotationdefinition.TagSetAnnotationDefinition](../annotationdefinition/-tag-set-annotation-definition/index.md)

Annotation definition which requests the annotator to chose from a set of predefined [TagSetOption](../annotationdefinition/-tag-set-annotation-definition/-tag-set-option/index.md)s


|

##### [project.layout.elements.action.TagSetButtonGroup](../project.layout.elements.action/-tag-set-button-group/index.md)

A ButtonGroup is a collection of buttons which belong together. Based on the referenceAnnotation it can be single select or multi select.


|

##### [annotationdefinition.generator.documenttarget.TagSetDocumentTargetGeneratorModel](../annotationdefinition.generator.documenttarget/-tag-set-document-target-generator-model/index.md)

Use this class for external ML models which are already trained and don't need any training data


|

##### [annotationdefinition.generator.documenttarget.TagSetDocumentTargetUpdatableGeneratorModel](../annotationdefinition.generator.documenttarget/-tag-set-document-target-updatable-generator-model/index.md)

Generic updatable AnnotationGenerator for TagSetAnnotationDefinition and DocumentTarget.


|

##### [project.layout.elements.action.TagSetDropdown](../project.layout.elements.action/-tag-set-dropdown/index.md)


|

##### [annotationdefinition.target.Target](../annotationdefinition.target/-target/index.md)

The target of an annotation can be the whole document or a specific offset of characters, a span.


|

##### [annotationdefinition.target.TargetType](../annotationdefinition.target/-target-type/index.md)

Enum class representing the two Target types, equivalent value to the JsonSubType of Target class


|

##### [project.layout.elements.display.Text](../project.layout.elements.display/-text/index.md)

Just display some static text


|

##### [project.layout.elements.display.TextMetaData](../project.layout.elements.display/-text-meta-data/index.md)

Display the value of a meta data element based on the ID


|

##### [api.manage.TimeWrapper](../api.manage/-time-wrapper/index.md)

Wrap a time [average](../api.manage/-time-wrapper/average.md) with the [n](../api.manage/-time-wrapper/n.md) over which it was calculated


|

##### [api.manage.TopLevelStatistics](../api.manage/-top-level-statistics/index.md)

Statistics calculated over all documents


|

##### [annotationdefinition.generator.documenttarget.TrainingSampleWithLabels](../annotationdefinition.generator.documenttarget/-training-sample-with-labels/index.md)


|

##### [common.UnauthorizedException](../common/-unauthorized-exception/index.md)

Custom exception indicating the user is not authenticated properly (missing / invalid auth token),
will be used to return appropriate http error code


|

##### [annotationdefinition.generator.UpdatableAnnotationGenerator](../annotationdefinition.generator/-updatable-annotation-generator/index.md)

Base class for [AnnotationGenerator](../annotationdefinition.generator/-annotation-generator/index.md)s which are updatable, for example ML models, as compared to static models like a statistics based generator


|

##### [annotationdefinition.generator.UpdatableAnnotationGeneratorVersion](../annotationdefinition.generator/-updatable-annotation-generator-version/index.md)


|

##### [annotationdefinition.generator.UpdateResponse](../annotationdefinition.generator/-update-response/index.md)


|

##### [annotationdefinition.generator.UpdateState](../annotationdefinition.generator/-update-state/index.md)


|

##### [project.layout.elements.display.UrlImage](../project.layout.elements.display/-url-image/index.md)

Element displaying an image provided by an URL


|

##### [project.layout.elements.display.UrlImageMetaData](../project.layout.elements.display/-url-image-meta-data/index.md)

Display a meta data element that is an URL of an image


|

##### [project.UsedAnnotateProject](../project/-used-annotate-project/index.md)

Data class used to store the [AnnotateProject](#) used in the annotation process. For example, the selection is not part
of this, because it can be very big and is generally unnecessary to store.


|

##### [user.User](../user/-user/index.md)

Data class representing a user. This model does not contain login information except the unique [userIdentifier](../user/-user/user-identifier.md),
and contains an optional [userName](../user/-user/user-name.md) and the [lastAccessTimestamp](../user/-user/last-access-timestamp.md)


|

##### [user.UserDAO](../user/-user-d-a-o/index.md)

DAO for accessing the user collection


|

##### [project.userroles.UserIdentifier](../project.userroles/-user-identifier.md)


|

##### [user.UserInfo](../user/-user-info/index.md)

View on the [User](../user/-user/index.md) only containing the unique [userIdentifier](../user/-user-info/user-identifier.md) and the [userName](../user/-user-info/user-name.md)


|

##### [project.userroles.UserRoles](../project.userroles/-user-roles/index.md)


|

##### [api.annotate.dto.ValidationError](../api.annotate.dto/-validation-error/index.md)

Single [ValidationError](../api.annotate.dto/-validation-error/index.md) w.r.t. an annotation definition + target


|

##### [project.annotationschema.ValuesEqual](../project.annotationschema/-values-equal/index.md)


|

##### [project.annotationschema.ValuesExist](../project.annotationschema/-values-exist/index.md)


|

##### [project.annotationschema.ValuesIntersect](../project.annotationschema/-values-intersect/index.md)


|

##### [document.annotation.ValueToProbability](../document.annotation/-value-to-probability/index.md)

In some contexts, a [value](../document.annotation/-value-to-probability/value.md) might have an associated [probability](../document.annotation/-value-to-probability/probability.md). This is the case when annotations are imported or generated with a
probability of how likely this annotation has the value.


|

##### [project.export.WebHookConfig](../project.export/-web-hook-config/index.md)


|

##### [document.annotation.WebHookExport](../document.annotation/-web-hook-export/index.md)

Information about a web hook export, containing the export URL, how often it was tries, if it was successful,
and possible failure logs for debugging purposes (for example when the web hook returns a 401 unauthorized etc.)



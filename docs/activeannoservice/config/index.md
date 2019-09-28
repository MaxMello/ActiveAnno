[activeannoservice](../index.md) / [config](./index.md)

## Package config

### Types

| Name | Summary |
|---|---|
| [ActionElement](-action-element.md) | `interface ActionElement : `[`Element`](-element.md)<br>Intermediary interface which marks subtypes as elements altering the state of the application by setting some annotation value |
| [And](-and/index.md) | `class And : `[`FilterCondition`](-filter-condition/index.md) |
| [AnnotateConfig](-annotate-config/index.md) | `data class AnnotateConfig`<br>View data class - all properties relevant to annotate / curate a config in the frontend |
| [Annotations](-annotations/index.md) | `data class Annotations` |
| [Base64Image](-base64-image/index.md) | `data class Base64Image : `[`DisplayElement`](-display-element.md)<br>Element displaying a constant Base64 encoded image |
| [Base64ImageMetaData](-base64-image-meta-data/index.md) | `data class Base64ImageMetaData : `[`DisplayElement`](-display-element.md)<br>Display a meta data element that is a base64 encoded image |
| [BaseAnnotation](-base-annotation/index.md) | `abstract class BaseAnnotation`<br>Base class for all annotations. |
| [Bold](-bold/index.md) | `class Bold : `[`DisplayElement`](-display-element.md)<br>Wrapper element, all children's text elements will be bold. Equivalent to an inline html element with fontWeight bold which will be applied to the children. |
| [BooleanAnnotation](-boolean-annotation/index.md) | `class BooleanAnnotation : `[`BaseAnnotation`](-base-annotation/index.md)<br>Annotation for a boolean input. |
| [ButtonGroup](-button-group/index.md) | `data class ButtonGroup : `[`ActionElement`](-action-element.md)<br>A ButtonGroup is a collection of buttons which belong together. Based on the referenceAnnotation it can be single select or multi select. |
| [CaseBehavior](-case-behavior/index.md) | `enum class CaseBehavior`<br>How to handle differences in cases between tags? |
| [Chips](-chips/index.md) | `data class Chips : `[`ActionElement`](-action-element.md)<br>Chips element is a variable list of text inputs (tags) which can be extended, including an auto-complete feature with predefined answers. |
| [ClosedNumberAnnotation](-closed-number-annotation/index.md) | `class ClosedNumberAnnotation : `[`BaseAnnotation`](-base-annotation/index.md)<br>Annotation for a closed number with a min, max and required step. Necessary if you want to display annotation as a slider. |
| [Column](-column/index.md) | `data class Column`<br>A column is part of a row and has a width dependent of screen size. Every row should have at least one column. |
| [ColumnSizes](-column-sizes/index.md) | `data class ColumnSizes`<br>The UI defines 5 different screen size breakpoints, from smallest (xs) to largest (xl). The actual pixel breakpoints are defined by the UI. Column sizes should be in [1,12](#) range, 12 being the full width of the row, 1 being 1/12 width of the row. At least xs needs to be defined. |
| [ConfigValidationError](-config-validation-error/index.md) | `data class ConfigValidationError`<br>A single validation error for a specific key of the [ManageConfig](-manage-config/index.md) |
| [ConfigValidationResult](-config-validation-result/index.md) | `data class ConfigValidationResult`<br>Data class wrapping the map of [ConfigValidationError](-config-validation-error/index.md)s |
| [ContainsAll](-contains-all/index.md) | `class ContainsAll : `[`FilterCondition`](-filter-condition/index.md)<br>Equivalent to And connection between Contains conditions, exists as shorthand Example: { tags: { $all: [ssl,security](#) } } =&gt; { $and: [{tagsssl},{tagssecurity}](#) } |
| [CreateIndex](-create-index/index.md) | `data class CreateIndex : `[`Index`](-index.md)<br>Use this to define a non-text index with an order as well as an optional unique constraint |
| [CreateTextIndex](-create-text-index/index.md) | `class CreateTextIndex : `[`Index`](-index.md)<br>Use this to apply a text index for a field |
| [DateMetaData](-date-meta-data/index.md) | `data class DateMetaData : `[`DisplayElement`](-display-element.md)<br>Convert some input date format (e.g. timestamp) to date format or do nothing if not a timestamp for a given meta data element |
| [DisplayElement](-display-element.md) | `interface DisplayElement : `[`Element`](-element.md)<br>Intermediate interface specify that an Element is non-interactive, allows for restrictions of classes to require Elements to be non-interactive |
| [DocumentTarget](-document-target/index.md) | `class DocumentTarget : `[`Target`](-target.md)<br>Use this for annotations that should be created for the whole document. |
| [DocumentText](-document-text/index.md) | `data class DocumentText` |
| [DocumentTextElement](-document-text-element/index.md) | `data class DocumentTextElement : `[`DisplayElement`](-display-element.md)<br>Element displaying the document text. |
| [Dropdown](-dropdown/index.md) | `data class Dropdown : `[`ActionElement`](-action-element.md) |
| [Element](-element.md) | `interface Element`<br>Interface for all UI elements, uses json polymorphic deserialization to map into actual UI elements. |
| [Equals](-equals/index.md) | `class Equals : `[`FilterCondition`](-filter-condition/index.md)<br>Use for direct equals or array contains |
| [Export](-export/index.md) | `data class Export`<br>Export configuration for consuming the results of this service |
| [ExportDocument](-export-document/index.md) | `data class ExportDocument` |
| [ExportFormat](-export-format/index.md) | `data class ExportFormat`<br>What aspects for the document and results to export |
| [FilterCondition](-filter-condition/index.md) | `sealed class FilterCondition`<br>Light wrapper classes around MongoDB query elements. To use the [FilterCondition](-filter-condition/index.md) as a parameter for MongoDB find, call [buildQuery](-filter-condition/build-query.md) on the [FilterCondition](-filter-condition/index.md) object. Support for: |
| [FinalizeAnnotationPolicy](-finalize-annotation-policy/index.md) | `enum class FinalizeAnnotationPolicy` |
| [GreaterThan](-greater-than/index.md) | `class GreaterThan : `[`FilterCondition`](-filter-condition/index.md) |
| [GreaterThanEquals](-greater-than-equals/index.md) | `class GreaterThanEquals : `[`FilterCondition`](-filter-condition/index.md) |
| [HierarchicalTagSetAnnotation](-hierarchical-tag-set-annotation/index.md) | `class HierarchicalTagSetAnnotation : `[`BaseAnnotation`](-base-annotation/index.md)<br>A set of predefined options nested in a hierarchical fashion, for example     name = Location     options = Germany(children = Berlin, Hamburg, Lower Saxony(children = Hannover, Oldenburg, Wolfsburg))) |
| [HierarchicalTagSetOption](-hierarchical-tag-set-option/index.md) | `data class HierarchicalTagSetOption` |
| [Icon](-icon/index.md) | `data class Icon : `[`DisplayElement`](-display-element.md)<br>Display a material icon |
| [In](-in/index.md) | `class In : `[`FilterCondition`](-filter-condition/index.md) |
| [Index](-index.md) | `interface Index`<br>Representing index options from MongoDB. |
| [InputMapping](-input-mapping/index.md) | `data class InputMapping`<br>Mapping of originalDocument to documentData used in UI. Will be mapped based on this classes values. Additionally, provides the ability to define indices for faster queries in DB |
| [Italic](-italic/index.md) | `class Italic : `[`DisplayElement`](-display-element.md)<br>Wrapper element, all children's text elements will be italic. Equivalent to an inline html element with italic font style which will be applied to the children. |
| [KeyExists](-key-exists/index.md) | `class KeyExists : `[`FilterCondition`](-filter-condition/index.md) |
| [Layout](-layout/index.md) | `data class Layout`<br>Define the layout of how annotation interactions / inputs will be displayed in the UI. |
| [LayoutArea](-layout-area/index.md) | `data class LayoutArea`<br>Mapping of layout areas to list of rows containing UI elements |
| [LayoutAreaType](-layout-area-type/index.md) | `enum class LayoutAreaType`<br>There are 4 different UI areas which are defined by this enum. All four areas can contain read-only/display elements, but not all are allowed to have all types of interaction elements. |
| [LessThan](-less-than/index.md) | `class LessThan : `[`FilterCondition`](-filter-condition/index.md) |
| [LessThanEquals](-less-than-equals/index.md) | `class LessThanEquals : `[`FilterCondition`](-filter-condition/index.md) |
| [ListConfig](-list-config/index.md) | `data class ListConfig`<br>View data class - all properties necessary to display config in list in the frontend |
| [ManageConfig](-manage-config/index.md) | `data class ManageConfig`<br>View data class - all properties necessary to display and edit config from management perspective in frontend |
| [MetaData](-meta-data/index.md) | `data class MetaData` |
| [MonospaceFont](-monospace-font/index.md) | `class MonospaceFont : `[`DisplayElement`](-display-element.md)<br>Wrapper element, all children's text elements will use a monospace font. Equivalent to an inline html element with a monospace font which will be applied to the children. |
| [Nor](-nor/index.md) | `class Nor : `[`FilterCondition`](-filter-condition/index.md) |
| [Not](-not/index.md) | `class Not : `[`FilterCondition`](-filter-condition/index.md) |
| [NotEquals](-not-equals/index.md) | `class NotEquals : `[`FilterCondition`](-filter-condition/index.md) |
| [NotIn](-not-in/index.md) | `class NotIn : `[`FilterCondition`](-filter-condition/index.md) |
| [NumberField](-number-field/index.md) | `data class NumberField : `[`ActionElement`](-action-element.md)<br>HTML Number input |
| [NumberRangeAnnotation](-number-range-annotation/index.md) | `class NumberRangeAnnotation : `[`BaseAnnotation`](-base-annotation/index.md)<br>A number range between [min](-number-range-annotation/min.md) and [max](-number-range-annotation/max.md) with [step](-number-range-annotation/step.md) steps between. Results in two values, a lower and upper value. |
| [OnOverwrittenFinalizedAnnotationBehavior](-on-overwritten-finalized-annotation-behavior/index.md) | `enum class OnOverwrittenFinalizedAnnotationBehavior`<br>Define behavior what to do when a finalizedAnnotation was defined, but a new one was set afterwards. This would not happen normally, but cannot be prevented for cases where an annotation is found via search to correct an earlier mistake. For this case, we need to define if we want to trigger web hooks again or not. |
| [OnWebHookFailureBehavior](-on-web-hook-failure-behavior/index.md) | `enum class OnWebHookFailureBehavior`<br>What to do when calling the WebHook failed |
| [OpenNumberAnnotation](-open-number-annotation/index.md) | `class OpenNumberAnnotation : `[`BaseAnnotation`](-base-annotation/index.md)<br>Annotation for an unrestricted number. Cannot be displayed as a slider, only number input. |
| [OpenTagAnnotation](-open-tag-annotation/index.md) | `class OpenTagAnnotation : `[`BaseAnnotation`](-base-annotation/index.md)<br>Tags annotation with the ability to add new tags from the user. Here, the tag is just a string / the value is the actual string |
| [OpenTextAnnotation](-open-text-annotation/index.md) | `class OpenTextAnnotation : `[`BaseAnnotation`](-base-annotation/index.md)<br>Annotation for some open text input |
| [Or](-or/index.md) | `class Or : `[`FilterCondition`](-filter-condition/index.md) |
| [Order](-order/index.md) | `enum class Order`<br>Enum representing the order options, ASC and DESC |
| [Policy](-policy/index.md) | `data class Policy`<br>Data class defining policy of how to handle documents / annotations, especially how and when to finalize an annotation for a document and configuration. |
| [PolicyAction](-policy-action/index.md) | `sealed class PolicyAction`<br>Sealed class for the different actions that can be required to be taken for a document to get the annotation done properly |
| [Popover](-popover/index.md) | `data class Popover : `[`DisplayElement`](-display-element.md)<br>A popover element, providing the ability to hide information (no interactions!) befind a popover |
| [PopoverContent](-popover-content/index.md) | `class PopoverContent`<br>The PopoverContent are display elements which will be shown when the popover is visible |
| [PopoverTarget](-popover-target/index.md) | `class PopoverTarget`<br>The PopoverTarget will be displayed into the parent context directly (for example some text, an icon or a combination) |
| [PopoverTrigger](-popover-trigger/index.md) | `enum class PopoverTrigger`<br>Two ways a popover can be triggered, by click or hover |
| [PredefinedTagSetAnnotation](-predefined-tag-set-annotation/index.md) | `class PredefinedTagSetAnnotation : `[`BaseAnnotation`](-base-annotation/index.md) |
| [ProjectConfig](-project-config/index.md) | `data class ProjectConfig`<br>Complete model of a project configuration. This model represents the database structure / is stored in mongoDB |
| [ProjectConfigDAO](-project-config-d-a-o/index.md) | `class ProjectConfigDAO`<br>DAO for the [ProjectConfig](-project-config/index.md) regulating access to the config collection |
| [Regex](-regex/index.md) | `class Regex : `[`FilterCondition`](-filter-condition/index.md) |
| [RestAuthentication](-rest-authentication/index.md) | `sealed class RestAuthentication` |
| [RestConfig](-rest-config/index.md) | `data class RestConfig`<br>What REST endpoints to activate and how to export them |
| [Row](-row/index.md) | `data class Row`<br>Equivalent to a Row of UI layout systems like Bootstrap or Material UI |
| [Size](-size/index.md) | `class Size : `[`FilterCondition`](-filter-condition/index.md) |
| [Slider](-slider/index.md) | `data class Slider : `[`ActionElement`](-action-element.md)<br>A number slider with n steps and possible one or two markers to either set a number of a number range. |
| [Sort](-sort/index.md) | `data class Sort`<br>Data class representing mongo DB sort |
| [SortElement](-sort-element/index.md) | `data class SortElement`<br>Single sort element with key and order |
| [SpanGranularity](-span-granularity/index.md) | `enum class SpanGranularity`<br>What is the allowed cutoff point for a span, a single character or only whole tokens? |
| [SpanTarget](-span-target/index.md) | `data class SpanTarget : `[`Target`](-target.md)<br>Use this for annotations that should be created for a specific span. Define characteristics of how the span should be set. |
| [TagSetOption](-tag-set-option/index.md) | `data class TagSetOption`<br>Option for a tag set. |
| [Target](-target.md) | `interface Target`<br>The target of an annotation can be the whole document or a specific offset of characters, a span. |
| [Text](-text/index.md) | `data class Text : `[`DisplayElement`](-display-element.md)<br>Just display some static text |
| [TextField](-text-field/index.md) | `data class TextField : `[`ActionElement`](-action-element.md)<br>A multi line text input field |
| [TextMetaData](-text-meta-data/index.md) | `data class TextMetaData : `[`DisplayElement`](-display-element.md)<br>Display the value of a meta data element based on the ID |
| [UrlImage](-url-image/index.md) | `data class UrlImage : `[`DisplayElement`](-display-element.md)<br>Element displaying an image provided by an URL |
| [UrlImageMetaData](-url-image-meta-data/index.md) | `data class UrlImageMetaData`<br>Display a meta data element that is an URL of an image |
| [UserRoles](-user-roles/index.md) | `data class UserRoles` |
| [WebHookAuthentication](-web-hook-authentication/index.md) | `sealed class WebHookAuthentication`<br>Inspiration: https://www.sparkpost.com/docs/tech-resources/webhook-authentication/ |
| [WebHookConfig](-web-hook-config/index.md) | `data class WebHookConfig` |

### Type Aliases

| Name | Summary |
|---|---|
| [AnnotationID](-annotation-i-d.md) | `typealias AnnotationID = `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [UserIdentifier](-user-identifier.md) | `typealias UserIdentifier = `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |

### Functions

| Name | Summary |
|---|---|
| [applyPolicy](apply-policy.md) | `fun `[`Policy`](-policy/index.md)`.applyPolicy(configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, document: `[`Document`](../document/-document/index.md)`, overwriteFinalizedAnnotations: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, curationRequest: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null): `[`PolicyAction`](-policy-action/index.md) |
| [callWebHook](call-web-hook.md) | `suspend fun `[`WebHookConfig`](-web-hook-config/index.md)`.callWebHook(configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, document: `[`Document`](../document/-document/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [checkWebHooks](check-web-hooks.md) | `suspend fun `[`Export`](-export/index.md)`.checkWebHooks(configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, document: `[`Document`](../document/-document/index.md)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html) |
| [convertDocument](convert-document.md) | `fun `[`ExportFormat`](-export-format/index.md)`.convertDocument(configurationID: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, document: `[`Document`](../document/-document/index.md)`): `[`ExportDocument`](-export-document/index.md) |
| [getFilterConditions](get-filter-conditions.md) | `fun `[`ProjectConfig`](-project-config/index.md)`.getFilterConditions(): `[`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/index.html)`<`[`FilterCondition`](-filter-condition/index.md)`>`<br>Get the filterCondition to use for a [ProjectConfig](-project-config/index.md). If the config is null, it is treated as a restricted config and the ID will be used to filter for restrictedConfig from documents. Else, the method will make sure that no restricted document for another config will be accidentally included for this config. |
| [toAnnotateConfig](to-annotate-config.md) | `suspend fun `[`ProjectConfig`](-project-config/index.md)`.toAnnotateConfig(): `[`AnnotateConfig`](-annotate-config/index.md)<br>Convert a [ProjectConfig](-project-config/index.md) to an [AnnotateConfig](-annotate-config/index.md), doing some operations to enrich the config data to be able to use it for annotation. For example, if an [OpenTagAnnotation](-open-tag-annotation/index.md) is present, this method might aggregate the existing values from all documents of the config and add it to the annotation config. |
| [toListConfig](to-list-config.md) | `fun `[`ProjectConfig`](-project-config/index.md)`.toListConfig(): `[`ListConfig`](-list-config/index.md) |
| [toManageConfig](to-manage-config.md) | `fun `[`ProjectConfig`](-project-config/index.md)`.toManageConfig(): `[`ManageConfig`](-manage-config/index.md) |
| [toProjectConfig](to-project-config.md) | `fun `[`ManageConfig`](-manage-config/index.md)`.toProjectConfig(creator: `[`UserIdentifier`](-user-identifier.md)`, creationTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis(), updateTimestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis()): `[`ProjectConfig`](-project-config/index.md) |
| [validateManageConfig](validate-manage-config.md) | `fun validateManageConfig(config: ObjectNode): `[`ConfigValidationResult`](-config-validation-result/index.md)<br>Validate a config, using a [ObjectNode](#) format to be able to check every necessary field even when a automatic mapping to [ManageConfig](-manage-config/index.md) would fail. |

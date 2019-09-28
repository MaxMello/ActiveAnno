

### All Types

| Name | Summary |
|---|---|
| [config.ActionElement](../config/-action-element.md) | Intermediary interface which marks subtypes as elements altering the state of the application by setting some annotation value |
| [config.And](../config/-and/index.md) |  |
| [config.AnnotateConfig](../config/-annotate-config/index.md) | View data class - all properties relevant to annotate / curate a config in the frontend |
| [api.AnnotationDocument](../api/-annotation-document/index.md) | Model for annotating a document for the frontend |
| [config.AnnotationID](../config/-annotation-i-d.md) |  |
| [document.AnnotationResult](../document/-annotation-result/index.md) | Data class representing a single annotation result by either an annotator, a curator or a merge of annotator responses by the policy logic. |
| [document.AnnotationResultCreator](../document/-annotation-result-creator/index.md) | Data class mapping a user identifier to the role it had for the annotation |
| [document.AnnotationResultCreatorType](../document/-annotation-result-creator-type/index.md) | Enum class representing the two user types able to create annotations. |
| [config.Annotations](../config/-annotations/index.md) |  |
| [api.AnnotationStored](../api/-annotation-stored/index.md) | Return model for storing endpoints, letting the frontend know the data was stored successfully. |
| [io.ktor.application.Application](../application/io.ktor.application.-application/index.md) (extensions in package application) |  |
| [application.ApplicationConfig](../application/-application-config/index.md) | To have easy access to the configuration properties of the application, this class exists |
| [common.AuthenticationException](../common/-authentication-exception/index.md) | Custom exception indicating the user is not authenticated properly (missing / invalid auth token), will be used to return appropriate http error code |
| [common.AuthorizationException](../common/-authorization-exception/index.md) | Custom exception indicating the user is not authorized properly (missing role), will be used to return appropriate http error code |
| [config.Base64Image](../config/-base64-image/index.md) | Element displaying a constant Base64 encoded image |
| [config.Base64ImageMetaData](../config/-base64-image-meta-data/index.md) | Display a meta data element that is a base64 encoded image |
| [config.BaseAnnotation](../config/-base-annotation/index.md) | Base class for all annotations. |
| [config.Bold](../config/-bold/index.md) | Wrapper element, all children's text elements will be bold. Equivalent to an inline html element with fontWeight bold which will be applied to the children. |
| [config.BooleanAnnotation](../config/-boolean-annotation/index.md) | Annotation for a boolean input. |
| [config.ButtonGroup](../config/-button-group/index.md) | A ButtonGroup is a collection of buttons which belong together. Based on the referenceAnnotation it can be single select or multi select. |
| [config.CaseBehavior](../config/-case-behavior/index.md) | How to handle differences in cases between tags? |
| [config.Chips](../config/-chips/index.md) | Chips element is a variable list of text inputs (tags) which can be extended, including an auto-complete feature with predefined answers. |
| [config.ClosedNumberAnnotation](../config/-closed-number-annotation/index.md) | Annotation for a closed number with a min, max and required step. Necessary if you want to display annotation as a slider. |
| [config.Column](../config/-column/index.md) | A column is part of a row and has a width dependent of screen size. Every row should have at least one column. |
| [config.ColumnSizes](../config/-column-sizes/index.md) | The UI defines 5 different screen size breakpoints, from smallest (xs) to largest (xl). The actual pixel breakpoints are defined by the UI. Column sizes should be in [1,12](#) range, 12 being the full width of the row, 1 being 1/12 width of the row. At least xs needs to be defined. |
| [document.ConfigAnnotationData](../document/-config-annotation-data/index.md) | Data class representing all annotation data for a specific configuration. |
| [config.ConfigValidationError](../config/-config-validation-error/index.md) | A single validation error for a specific key of the [ManageConfig](../config/-manage-config/index.md) |
| [config.ConfigValidationResult](../config/-config-validation-result/index.md) | Data class wrapping the map of [ConfigValidationError](../config/-config-validation-error/index.md)s |
| [config.ContainsAll](../config/-contains-all/index.md) | Equivalent to And connection between Contains conditions, exists as shorthand Example: { tags: { $all: [ssl,security](#) } } =&gt; { $and: [{tagsssl},{tagssecurity}](#) } |
| [org.litote.kmongo.coroutine.CoroutineDatabase](../common/org.litote.kmongo.coroutine.-coroutine-database/index.md) (extensions in package common) |  |
| [application.Cors](../application/-cors/index.md) | Data class representing the CORS config |
| [config.CreateIndex](../config/-create-index/index.md) | Use this to define a non-text index with an order as well as an optional unique constraint |
| [config.CreateTextIndex](../config/-create-text-index/index.md) | Use this to apply a text index for a field |
| [config.DateMetaData](../config/-date-meta-data/index.md) | Convert some input date format (e.g. timestamp) to date format or do nothing if not a timestamp for a given meta data element |
| [com.auth0.jwt.interfaces.DecodedJWT](../common/com.auth0.jwt.interfaces.-decoded-j-w-t/index.md) (extensions in package common) |  |
| [config.DisplayElement](../config/-display-element.md) | Intermediate interface specify that an Element is non-interactive, allows for restrictions of classes to require Elements to be non-interactive |
| [document.Document](../document/-document/index.md) | The data class representing a document with some [originalDocument](../document/-document/original-document.md), a unique [_id](../document/-document/_id.md), optionally a [restrictedConfig](../document/-document/restricted-config.md) (marking the document to belong only to that one config), and the [configAnnotationData](../document/-document/config-annotation-data.md) holding all the annotations for every config related to the document. |
| [document.DocumentAnnotation](../document/-document-annotation/index.md) | A document annotation is a single object only containing the value of the annotation, which can be [Any](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html) type (but actually only primitives, String, and collection of those types) |
| [document.DocumentDAO](../document/-document-d-a-o/index.md) | This DAO provides all methods to interact with the document collection. It hides the collection and controls access to it via the public methods. |
| [config.DocumentTarget](../config/-document-target/index.md) | Use this for annotations that should be created for the whole document. |
| [config.DocumentText](../config/-document-text/index.md) |  |
| [config.DocumentTextElement](../config/-document-text-element/index.md) | Element displaying the document text. |
| [config.Dropdown](../config/-dropdown/index.md) |  |
| [config.Element](../config/-element.md) | Interface for all UI elements, uses json polymorphic deserialization to map into actual UI elements. |
| [config.Equals](../config/-equals/index.md) | Use for direct equals or array contains |
| [config.Export](../config/-export/index.md) | Export configuration for consuming the results of this service |
| [config.ExportDocument](../config/-export-document/index.md) |  |
| [config.ExportFormat](../config/-export-format/index.md) | What aspects for the document and results to export |
| [document.ExportStatistics](../document/-export-statistics/index.md) | Data class holding information about where and how often the annotations were exported. |
| [config.FilterCondition](../config/-filter-condition/index.md) | Light wrapper classes around MongoDB query elements. To use the [FilterCondition](../config/-filter-condition/index.md) as a parameter for MongoDB find, call [buildQuery](../config/-filter-condition/build-query.md) on the [FilterCondition](../config/-filter-condition/index.md) object. Support for: |
| [config.FinalizeAnnotationPolicy](../config/-finalize-annotation-policy/index.md) |  |
| [document.FinalizedAnnotation](../document/-finalized-annotation/index.md) | Data class representing a finalized annotation, which can be one or multiple annotations (referenced by their IDs). It also contains meta data about why the document was finalized, which policy was used, when the finalization happened, and statistics about how the annotations were exported. |
| [document.FinalizedReason](../document/-finalized-reason/index.md) | Sealed class with two options why a annotation can be finalized |
| [config.GreaterThan](../config/-greater-than/index.md) |  |
| [config.GreaterThanEquals](../config/-greater-than-equals/index.md) |  |
| [config.HierarchicalTagSetAnnotation](../config/-hierarchical-tag-set-annotation/index.md) | A set of predefined options nested in a hierarchical fashion, for example     name = Location     options = Germany(children = Berlin, Hamburg, Lower Saxony(children = Hannover, Oldenburg, Wolfsburg))) |
| [config.HierarchicalTagSetOption](../config/-hierarchical-tag-set-option/index.md) |  |
| [config.Icon](../config/-icon/index.md) | Display a material icon |
| [config.In](../config/-in/index.md) |  |
| [config.Index](../config/-index.md) | Representing index options from MongoDB. |
| [config.InputMapping](../config/-input-mapping/index.md) | Mapping of originalDocument to documentData used in UI. Will be mapped based on this classes values. Additionally, provides the ability to define indices for faster queries in DB |
| [document.InteractionLog](../document/-interaction-log/index.md) | Data class representing log data from the interaction of the user with the document during annotation. |
| [config.Italic](../config/-italic/index.md) | Wrapper element, all children's text elements will be italic. Equivalent to an inline html element with italic font style which will be applied to the children. |
| [application.JwtConfiguration](../application/-jwt-configuration/index.md) | Data class representing the JTW configuration |
| [application.JwtValidation](../application/-jwt-validation/index.md) | Data class representing the JWT validation configuration |
| [config.KeyExists](../config/-key-exists/index.md) |  |
| [application.KtorHttpsConfig](../application/-ktor-https-config/index.md) | Data class representing the HTTPS config for ktor |
| [config.Layout](../config/-layout/index.md) | Define the layout of how annotation interactions / inputs will be displayed in the UI. |
| [config.LayoutArea](../config/-layout-area/index.md) | Mapping of layout areas to list of rows containing UI elements |
| [config.LayoutAreaType](../config/-layout-area-type/index.md) | There are 4 different UI areas which are defined by this enum. All four areas can contain read-only/display elements, but not all are allowed to have all types of interaction elements. |
| [config.LessThan](../config/-less-than/index.md) |  |
| [config.LessThanEquals](../config/-less-than-equals/index.md) |  |
| [config.ListConfig](../config/-list-config/index.md) | View data class - all properties necessary to display config in list in the frontend |
| [application.LoggingConfig](../application/-logging-config/index.md) | Data class representing the logging config |
| [config.ManageConfig](../config/-manage-config/index.md) | View data class - all properties necessary to display and edit config from management perspective in frontend |
| [user.Message](../user/-message/index.md) | A message is a text between two users, relating to an [AnnotationResult](../document/-annotation-result/index.md) |
| [user.MessageDAO](../user/-message-d-a-o/index.md) | DAO for the [Message](../user/-message/index.md) model, controlling access to the message collection. |
| [config.MetaData](../config/-meta-data/index.md) |  |
| [application.MongoConfig](../application/-mongo-config/index.md) | Data class representing the MongoDB config |
| [config.MonospaceFont](../config/-monospace-font/index.md) | Wrapper element, all children's text elements will use a monospace font. Equivalent to an inline html element with a monospace font which will be applied to the children. |
| [kotlin.collections.MutableList](../common/kotlin.collections.-mutable-list/index.md) (extensions in package common) |  |
| [config.Nor](../config/-nor/index.md) |  |
| [config.Not](../config/-not/index.md) |  |
| [config.NotEquals](../config/-not-equals/index.md) |  |
| [config.NotIn](../config/-not-in/index.md) |  |
| [config.NumberField](../config/-number-field/index.md) | HTML Number input |
| [config.NumberRangeAnnotation](../config/-number-range-annotation/index.md) | A number range between [min](../config/-number-range-annotation/min.md) and [max](../config/-number-range-annotation/max.md) with [step](../config/-number-range-annotation/step.md) steps between. Results in two values, a lower and upper value. |
| [com.fasterxml.jackson.databind.node.ObjectNode](../common/com.fasterxml.jackson.databind.node.-object-node/index.md) (extensions in package common) |  |
| [config.OnOverwrittenFinalizedAnnotationBehavior](../config/-on-overwritten-finalized-annotation-behavior/index.md) | Define behavior what to do when a finalizedAnnotation was defined, but a new one was set afterwards. This would not happen normally, but cannot be prevented for cases where an annotation is found via search to correct an earlier mistake. For this case, we need to define if we want to trigger web hooks again or not. |
| [config.OnWebHookFailureBehavior](../config/-on-web-hook-failure-behavior/index.md) | What to do when calling the WebHook failed |
| [config.OpenNumberAnnotation](../config/-open-number-annotation/index.md) | Annotation for an unrestricted number. Cannot be displayed as a slider, only number input. |
| [config.OpenTagAnnotation](../config/-open-tag-annotation/index.md) | Tags annotation with the ability to add new tags from the user. Here, the tag is just a string / the value is the actual string |
| [config.OpenTextAnnotation](../config/-open-text-annotation/index.md) | Annotation for some open text input |
| [config.Or](../config/-or/index.md) |  |
| [config.Order](../config/-order/index.md) | Enum representing the order options, ASC and DESC |
| [api.Page](../api/-page/index.md) | A [Page](../api/-page/index.md) represents a UI page of the frontend, optionally with a [badgeCount](../api/-page/badge-count.md) to indicate how many interactions are waiting for the user |
| [api.PageSetup](../api/-page-setup/index.md) | Model for frontend communication representing the PageSetup, controlling the layout and core data for the page setup of the frontend |
| [io.ktor.util.pipeline.PipelineContext](../common/io.ktor.util.pipeline.-pipeline-context/index.md) (extensions in package common) |  |
| [config.Policy](../config/-policy/index.md) | Data class defining policy of how to handle documents / annotations, especially how and when to finalize an annotation for a document and configuration. |
| [config.PolicyAction](../config/-policy-action/index.md) | Sealed class for the different actions that can be required to be taken for a document to get the annotation done properly |
| [config.Popover](../config/-popover/index.md) | A popover element, providing the ability to hide information (no interactions!) befind a popover |
| [config.PopoverContent](../config/-popover-content/index.md) | The PopoverContent are display elements which will be shown when the popover is visible |
| [config.PopoverTarget](../config/-popover-target/index.md) | The PopoverTarget will be displayed into the parent context directly (for example some text, an icon or a combination) |
| [config.PopoverTrigger](../config/-popover-trigger/index.md) | Two ways a popover can be triggered, by click or hover |
| [api.PostAnnotationResult](../api/-post-annotation-result/index.md) | Data class for annotation and curation endpoints for receiving annotation results. Will be mapped into other data structures for storing. |
| [api.PostAnnotationResults](../api/-post-annotation-results/index.md) | Wrapper data class for reciving annotations |
| [config.PredefinedTagSetAnnotation](../config/-predefined-tag-set-annotation/index.md) |  |
| [config.ProjectConfig](../config/-project-config/index.md) | Complete model of a project configuration. This model represents the database structure / is stored in mongoDB |
| [config.ProjectConfigDAO](../config/-project-config-d-a-o/index.md) | DAO for the [ProjectConfig](../config/-project-config/index.md) regulating access to the config collection |
| [config.Regex](../config/-regex/index.md) |  |
| [config.RestAuthentication](../config/-rest-authentication/index.md) |  |
| [document.RestCall](../document/-rest-call/index.md) | Information about an export via rest call, mainly the route called, how often, and when. |
| [config.RestConfig](../config/-rest-config/index.md) | What REST endpoints to activate and how to export them |
| [io.ktor.routing.Route](../api/io.ktor.routing.-route/index.md) (extensions in package api) |  |
| [io.ktor.routing.Route](../common/io.ktor.routing.-route/index.md) (extensions in package common) |  |
| [config.Row](../config/-row/index.md) | Equivalent to a Row of UI layout systems like Bootstrap or Material UI |
| [api.SearchRequest](../api/-search-request/index.md) | Model representing a search request |
| [api.SearchResultDocument](../api/-search-result-document/index.md) | The [SearchResultDocument](../api/-search-result-document/index.md) is a view on a document with all useful data for display in the search result area in the frontend. |
| [config.Size](../config/-size/index.md) |  |
| [config.Slider](../config/-slider/index.md) | A number slider with n steps and possible one or two markers to either set a number of a number range. |
| [config.Sort](../config/-sort/index.md) | Data class representing mongo DB sort |
| [config.SortElement](../config/-sort-element/index.md) | Single sort element with key and order |
| [document.Span](../document/-span/index.md) | When reading annotations, you can either extract the referenced substring by using the [begin](../document/-span/begin.md) and [end](../document/-span/end.md) values, or use the copy of the substring [text](../document/-span/text.md) directly. |
| [document.SpanAnnotation](../document/-span-annotation/index.md) | A span annotation maps a list of spans to the annotation value, which can be [Any](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html) type (but actually only primitives, String, and collection of those types) |
| [config.SpanGranularity](../config/-span-granularity/index.md) | What is the allowed cutoff point for a span, a single character or only whole tokens? |
| [config.SpanTarget](../config/-span-target/index.md) | Use this for annotations that should be created for a specific span. Define characteristics of how the span should be set. |
| [config.TagSetOption](../config/-tag-set-option/index.md) | Option for a tag set. |
| [config.Target](../config/-target.md) | The target of an annotation can be the whole document or a specific offset of characters, a span. |
| [config.Text](../config/-text/index.md) | Just display some static text |
| [config.TextField](../config/-text-field/index.md) | A multi line text input field |
| [config.TextMetaData](../config/-text-meta-data/index.md) | Display the value of a meta data element based on the ID |
| [config.UrlImage](../config/-url-image/index.md) | Element displaying an image provided by an URL |
| [config.UrlImageMetaData](../config/-url-image-meta-data/index.md) | Display a meta data element that is an URL of an image |
| [user.User](../user/-user/index.md) | Data class representing a user. This model does not contain login information except the unique [userIdentifier](../user/-user/user-identifier.md), and contains an optional [userName](../user/-user/user-name.md) and the [lastAccessTimestamp](../user/-user/last-access-timestamp.md) |
| [user.UserDAO](../user/-user-d-a-o/index.md) |  |
| [config.UserIdentifier](../config/-user-identifier.md) |  |
| [user.UserInfo](../user/-user-info/index.md) | View on the [User](../user/-user/index.md) only containing the unique [userIdentifier](../user/-user-info/user-identifier.md) and the [userName](../user/-user-info/user-name.md) |
| [config.UserRoles](../config/-user-roles/index.md) |  |
| [config.WebHookAuthentication](../config/-web-hook-authentication/index.md) | Inspiration: https://www.sparkpost.com/docs/tech-resources/webhook-authentication/ |
| [config.WebHookConfig](../config/-web-hook-config/index.md) |  |
| [document.WebHookExport](../document/-web-hook-export/index.md) | Information about a web hook export, containing the export URL, how often it was tries, if it was successful, and possible failure logs for debugging purposes (for example when the web hook returns a 401 unauthorized etc.) |

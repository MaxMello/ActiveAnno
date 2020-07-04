package application

import annotationdefinition.*
import annotationdefinition.generator.FinalizeCondition
import annotationdefinition.generator.documenttarget.TagSetDocumentTargetUpdatableGeneratorModel
import annotationdefinition.target.DocumentTarget
import common.HttpAuthentication
import document.Document
import document.addAnnotationResultForProject
import document.addGeneratedAnnotationDataForProject
import document.annotation.DocumentTargetAnnotation
import document.annotation.GeneratedAnnotationData
import document.annotation.ValueToProbability
import document.annotation.buildAnnotationResult
import io.ktor.util.KtorExperimentalAPI
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import project.Project
import project.annotationschema.*
import project.annotationschema.generator.GeneratedAnnotationResultHandling
import project.annotationschema.generator.GeneratorSortingPolicy
import project.annotationschema.generator.GeneratorTiming
import project.annotationschema.generator.HandlingPolicy
import project.export.*
import project.filter.Equals
import project.inputmapping.CreateIndex
import project.inputmapping.DocumentText
import project.inputmapping.InputMapping
import project.inputmapping.MetaData
import project.layout.*
import project.layout.elements.action.*
import project.layout.elements.display.*
import project.policy.FinalizeAnnotationPolicy
import project.policy.Policy
import project.selection.DateRangeFilter
import project.selection.DocumentSelection
import project.selection.SelectionType
import project.selection.SubFilter
import project.sort.Order
import project.sort.Sort
import project.sort.SortElement
import project.userroles.UserRoles

private val logger = LoggerFactory.getLogger("ExampleProject")

/**
 * Generate an example project to show off the capabilities of ActiveAnno
 */
@KtorExperimentalAPI
fun generateExampleProject(applicationConfig: ApplicationConfig) {
    if (applicationConfig.featuresConfig.generateExampleProject) {
        runBlocking {
            // Create annotation definitions
            val isSpamAnnotationDefinition = BooleanAnnotationDefinition(
                "EXAMPLE_PROJECT_SPAM", "Is spam", "Spam", System.currentTimeMillis(), false
            )
            annotationDefinitionDAO.save(isSpamAnnotationDefinition)
            val sentimentAnnotationDefinition = TagSetAnnotationDefinition(
                "EXAMPLE_PROJECT_SENTIMENT", "Sentiment", "Sentiment", System.currentTimeMillis(), 1, 1,
                listOf(
                    TagSetAnnotationDefinition.TagSetOption("VERY_NEGATIVE", "Very negative", "-2"),
                    TagSetAnnotationDefinition.TagSetOption("NEGATIVE", "Negative", "-1"),
                    TagSetAnnotationDefinition.TagSetOption("NEUTRAL", "Neutral", "0"),
                    TagSetAnnotationDefinition.TagSetOption("POSITIVE", "Positive", "+1"),
                    TagSetAnnotationDefinition.TagSetOption("VERY_POSITIVE", "Very positive", "+2")
                )
            )
            annotationDefinitionDAO.save(sentimentAnnotationDefinition)
            val reviewContainsAnnotation = TagSetAnnotationDefinition(
                "EXAMPLE_PROJECT_REVIEW_CONTAINS",
                "This review contains a",
                "Contains",
                System.currentTimeMillis(),
                0,
                3,
                listOf(
                    TagSetAnnotationDefinition.TagSetOption(
                        "FEATURE_FEEDBACK",
                        "Feedback about a feature",
                        "Feedback"
                    ),
                    TagSetAnnotationDefinition.TagSetOption("BUG_REPORT", "Bug report", "Bug"),
                    TagSetAnnotationDefinition.TagSetOption("FEATURE_REQUEST", "Feature request", "Request")
                )
            )
            annotationDefinitionDAO.save(reviewContainsAnnotation)
            val reviewContainsOtherAnnotation = OpenTextAnnotationDefinition(
                "EXAMPLE_PROJECT_REVIEW_CONTAINS_OTHER",
                "Other things this review contains",
                "Other",
                System.currentTimeMillis(),
                1,
                100,
                null,
                true
            )
            annotationDefinitionDAO.save(reviewContainsOtherAnnotation)
            val featuresAnnotation = OpenTagAnnotationDefinition(
                "EXAMPLE_PROJECT_FEATURES",
                "Mentioned features",
                "Features",
                System.currentTimeMillis(),
                0,
                10,
                true,
                CaseBehavior.CAPITALIZE,
                false,
                mutableListOf("Usability", "Performance", "Security", "Design")
            )
            annotationDefinitionDAO.save(featuresAnnotation)
            val usefulnessAnnotation = ClosedNumberAnnotationDefinition(
                "EXAMPLE_PROJECT_USEFULNESS",
                "How useful is this review for software engineers?",
                "Usefulness",
                System.currentTimeMillis(),
                1.0,
                5.0,
                1.0,
                false
            )
            annotationDefinitionDAO.save(usefulnessAnnotation)

            // Create prediction models
            val sentimentModel = TagSetDocumentTargetUpdatableGeneratorModel(
                "EXAMPLE_PROJECT_SENTIMENT_MODEL",
                sentimentAnnotationDefinition.id,
                "Sentiment model",
                "Model corresponding to the SENTIMENT annotation definition, having 5 exclusive classes.",
                "http://localhost:5000/api/v1/predict",
                "http://localhost:5000/api/v1/train",
                "http://localhost:5000/api/v1/optimize",
                HttpAuthentication.None,
                testSize = 0.33,
                startThreshold = 3,
                updateThreshold = 3,
                dataFilter = Equals(Document::restrictedProjectID.name, "EXAMPLE_PROJECT_APP_REVIEWS"),
                versions = mutableListOf(),
                input = OriginalDocumentKey("review"),
                finalizeCondition = FinalizeCondition.Always)
            annotationGeneratorDAO.save(sentimentModel)

            logger.info("Create example project")
            val exampleProject = Project(
                "EXAMPLE_PROJECT_APP_REVIEWS",
                "Example project: App reviews",
                "This is an automatically generated example project. It shows the different capabilities of ActiveAnno. " +
                        "The setup is based on the Paper 'How Do Users Like this Feature? A Fine Grained Sentiment Analysis of App Reviews' " +
                        "by Guzman and Maalej. The difference to the paper setup is that sentiment is assigned here on a document level, " +
                        "not on a per-feature level. Also, we additionally ask to label the review as spam / no spam and to define a " +
                        "usefulness scale for software engineers.",
                "admin",
                System.currentTimeMillis(), System.currentTimeMillis(), 0, true,
                UserRoles(
                    listOf("admin", "testmanager"),
                    listOf("admin", "testcurator"),
                    listOf("admin", "testannotator1", "testannotator2", "testannotator3")
                ),
                InputMapping(
                    DocumentText("review"), listOf(
                        MetaData("timestamp", "timestamp"),
                        MetaData("appName", "appName", CreateIndex(Order.ASC)),
                        MetaData("reviewer", "reviewer"),
                        MetaData("stars", "stars")
                    )
                ), null, Sort(listOf(SortElement("originalDocument.timestamp", Order.DESC))),
                DocumentSelection(
                    listOf(
                        SubFilter("appName", "App name", SelectionType.AGGREGATE_ALL_VALUES),
                        SubFilter("reviewer", "Reviewer", SelectionType.INPUT_FIELD),
                        SubFilter("stars", "Stars", SelectionType.AGGREGATE_ALL_VALUES)
                    ),
                    DateRangeFilter("originalDocument.timestamp")
                ),
                AnnotationSchema(
                    listOf(
                        AnnotationSchemaElement(isSpamAnnotationDefinition.id, DocumentTarget()),
                        AnnotationSchemaElement(sentimentAnnotationDefinition.id, DocumentTarget(),
                            ValuesEqual(AnnotationsKey(isSpamAnnotationDefinition.id), setOf("false")), sentimentModel.id),
                        AnnotationSchemaElement(usefulnessAnnotation.id, DocumentTarget(),
                            ValuesEqual(AnnotationsKey(isSpamAnnotationDefinition.id), setOf("false")), sentimentModel.id),
                        AnnotationSchemaElement(featuresAnnotation.id, DocumentTarget(),
                            ValuesEqual(AnnotationsKey(isSpamAnnotationDefinition.id), setOf("false"))
                        ),
                        AnnotationSchemaElement(reviewContainsAnnotation.id, DocumentTarget(),
                            ValuesEqual(AnnotationsKey(isSpamAnnotationDefinition.id), setOf("false"))
                        ),
                        AnnotationSchemaElement(reviewContainsOtherAnnotation.id, DocumentTarget(),
                            ValuesEqual(AnnotationsKey(isSpamAnnotationDefinition.id), setOf("false"))
                        )
                    ),
                    GeneratedAnnotationResultHandling(
                        handlingPolicy = HandlingPolicy.Preselection(false),
                        sortingPolicy = GeneratorSortingPolicy.DOCUMENTS_WITH_GENERATED_DATA_FIRST,
                        generatorTiming = GeneratorTiming.OnGenerateMissingAnnotationsRequest,
                        updateGeneratedAnnotationDataOnNewVersion = false
                    )
                ), Layout(
                    mapOf(
                        LayoutAreaType.Common to LayoutArea(
                            LayoutAreaType.Common, listOf(
                                Row(
                                    listOf(
                                        Column(
                                            ColumnSizes(
                                                12, 12, 6, 6, 6
                                            ), listOf(
                                                Text("Review for the App "),
                                                Bold(
                                                    TextMetaData(
                                                        "appName"
                                                    )
                                                )
                                            )
                                        ),
                                        Column(
                                            ColumnSizes(
                                                12, 12, 6, 6, 6
                                            ), listOf(
                                                Text("Reviewer: "),
                                                Italic(TextMetaData("reviewer"))
                                            )
                                        ),
                                        Column(
                                            ColumnSizes(
                                                12, 12, 6, 6, 6
                                            ), listOf(
                                                Text("Stars: "),
                                                MetaDataMapping(
                                                    "stars",
                                                    mapOf(
                                                        "1" to listOf(Icon("star")),
                                                        "2" to listOf(Icon("star"), Icon("star")),
                                                        "3" to listOf(Icon("star"), Icon("star"), Icon("star")),
                                                        "4" to listOf(Icon("star"), Icon("star"), Icon("star"), Icon("star")),
                                                        "5" to listOf(
                                                            Icon("star"), Icon("star"), Icon("star"), Icon("star"),
                                                            Icon("star")
                                                        )
                                                    ),
                                                    listOf(TextMetaData("stars"))
                                                )
                                            )
                                        ),
                                        Column(
                                            ColumnSizes(
                                                12, 12, 6, 6, 6
                                            ), listOf(
                                                Text("Date: "),
                                                MonospaceFont(
                                                    DateMetaData("YYYY-MM-DD", "timestamp")
                                                )
                                            )
                                        )
                                    )
                                ),
                                Row(
                                    listOf(
                                        Column(
                                            ColumnSizes(
                                                12
                                            ), listOf(
                                                DocumentTextElement("Review text")
                                            )
                                        )
                                    )
                                )
                            )
                        ),
                        LayoutAreaType.DocumentTarget to LayoutArea(
                            LayoutAreaType.DocumentTarget, listOf(
                                Row(
                                    listOf(
                                        Column(
                                            ColumnSizes(
                                                12, 12, 6, 6, 6
                                            ), listOf(
                                                BooleanButtonGroup("EXAMPLE_PROJECT_SPAM")
                                            )
                                        ),
                                        Column(
                                            ColumnSizes(
                                                12, 12, 6, 6, 6
                                            ), listOf(
                                                TagSetButtonGroup("EXAMPLE_PROJECT_SENTIMENT", buttonColors=mapOf(
                                                    "VERY_NEGATIVE" to ButtonColor.RED_TONE,
                                                    "NEGATIVE" to ButtonColor.LOW_SATURATION_RED_TONE,
                                                    "NEUTRAL" to ButtonColor.DEFAULT,
                                                    "POSITIVE" to ButtonColor.LOW_SATURATION_GREEN_TONE,
                                                    "VERY_POSITIVE" to ButtonColor.GREEN_TONE
                                                ))
                                            )
                                        ),
                                        Column(
                                            ColumnSizes(
                                                12, 12, 6, 6, 6
                                            ), listOf(
                                                ClosedNumberSlider("EXAMPLE_PROJECT_USEFULNESS")
                                            )
                                        ),
                                        Column(
                                            ColumnSizes(
                                                12, 12, 6, 6, 6
                                            ), listOf(
                                                OpenTagChipInput("EXAMPLE_PROJECT_FEATURES")
                                            )
                                        ),
                                        Column(
                                            ColumnSizes(
                                                12, 12, 6, 6, 6
                                            ), listOf(
                                                TagSetDropdown("EXAMPLE_PROJECT_REVIEW_CONTAINS")
                                            )
                                        ),
                                        Column(
                                            ColumnSizes(
                                                12, 12, 6, 6, 6
                                            ), listOf(
                                                OpenTextInput("EXAMPLE_PROJECT_REVIEW_CONTAINS_OTHER")
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                ), Policy(
                    numberOfAnnotatorsPerDocument = 2,
                    allowManualEscalationToCurator = false,
                    finalizeAnnotationPolicy = FinalizeAnnotationPolicy.ALWAYS_REQUIRE_CURATION
                ), Export(
                    listOf(),
                    RestConfig(
                        ExportFormat(), RestAuthentication.None
                    ),
                    onOverwrittenFinalizedAnnotationBehavior = OnOverwrittenFinalizedAnnotationBehavior.TRIGGER_EXPORT_AGAIN
                ),
                true
            )
            projectDAO.save(exampleProject)
            logger.info("Inserted $exampleProject")
            logger.info("Generate example data")
            if (documentDAO.countAll() == 0L) {
                // These reviews are made up, not actual app reviews
                val ids = documentDAO.insertMany(jsonMapper.createArrayNode().apply {
                    this.addAll(
                        listOf(
                            jsonMapper.createObjectNode().apply {
                                put("review", "Great app, I like the fast upload speed and pdf viewer!")
                                put("timestamp", 1506594690000)
                                put("appName", "Dropbox")
                                put("reviewer", "Anonymous")
                                put("stars", 5)
                            },
                            jsonMapper.createObjectNode().apply {
                                put("review", "Good game, but the ads are annoying.")
                                put("timestamp", 1509532290000)
                                put("appName", "Angry Birds")
                                put("reviewer", "Karl W.")
                                put("stars", 3)
                            },
                            jsonMapper.createObjectNode().apply {
                                put("review", "The app is just so ugly, I don't like the colors and the layout at all.")
                                put("timestamp", 1514889090000)
                                put("appName", "Telegram")
                                put("reviewer", "Peter S.")
                                put("stars", 1)
                            },
                            jsonMapper.createObjectNode().apply {
                                put("review", "Bad sfhjs 3fnfs 34r")
                                put("timestamp", 1519295490000)
                                put("appName", "Dropbox")
                                put("reviewer", "Anna B.")
                                put("stars", 1)
                            },
                            jsonMapper.createObjectNode().apply {
                                put("review", "The game is too easy for me, not challenging at all. Also the graphics are lame.")
                                put("timestamp", 1523529090000)
                                put("appName", "Angry Birds")
                                put("reviewer", "Gamemaster01")
                                put("stars", 2)
                            },
                            jsonMapper.createObjectNode().apply {
                                put("review", "I would like there to be a way to mute individual people in a group.")
                                put("timestamp", 1525343490000)
                                put("appName", "Telegram")
                                put("reviewer", "Andrew")
                                put("stars", 3)
                            },
                            jsonMapper.createObjectNode().apply {
                                put("review", "Instantly closes when I try to open it....so bad")
                                put("timestamp", 1527940800000)
                                put("appName", "Dropbox")
                                put("reviewer", "Amy K.")
                                put("stars", 1)
                            },
                            jsonMapper.createObjectNode().apply {
                                put("review", "I like it but I tried to send a video and it was too big so it wouldn't let me send it.")
                                put("timestamp", 1530964800000)
                                put("appName", "Telegram")
                                put("reviewer", "Natalie")
                                put("stars", 4)
                            },
                            jsonMapper.createObjectNode().apply {
                                put("review", "I love it!")
                                put("timestamp", 1538308800000)
                                put("appName", "Angry Birds")
                                put("reviewer", "Tom F.")
                                put("stars", 5)
                            },
                            jsonMapper.createObjectNode().apply {
                                put("review", "I like the stickers and that I can also use it on my computer. Better than WhatsApp!")
                                put("timestamp", 1546257600000)
                                put("appName", "Telegram")
                                put("reviewer", "User#23265")
                                put("stars", 5)
                            },
                            jsonMapper.createObjectNode().apply {
                                put("review", "...")
                                put("timestamp", 1546164000000)
                                put("appName", "Telegram")
                                put("reviewer", "Peter F.")
                                put("stars", 5)
                            },
                            jsonMapper.createObjectNode().apply {
                                put("review", "More storage please")
                                put("timestamp", 1546078200000)
                                put("appName", "Dropbox")
                                put("reviewer", "Reviewer123")
                                put("stars", 2)
                            },
                            jsonMapper.createObjectNode().apply {
                                put("review", "trash xD")
                                put("timestamp", 1545732600000)
                                put("appName", "Telegram")
                                put("reviewer", "User#23265")
                                put("stars", 1)
                            },
                            jsonMapper.createObjectNode().apply {
                                put("review", "didnt't start for me")
                                put("timestamp", 1545387000000)
                                put("appName", "Dropbox")
                                put("reviewer", "Frank")
                                put("stars", 1)
                            }
                        )
                    )
                }, "EXAMPLE_PROJECT_APP_REVIEWS")
                val denormalizedAnnotationSchema = exampleProject.annotationSchema.denormalize()
                ids.forEachIndexed { index, id ->
                    documentDAO.byId(id).let { doc ->
                        val generatedAnnotationData = GeneratedAnnotationData(
                            System.currentTimeMillis(),
                            mutableMapOf(
                                isSpamAnnotationDefinition.id to DocumentTargetAnnotation(
                                    listOf(ValueToProbability(index in listOf(3, 10, 12)))
                                )
                            )
                        )
                        doc.addGeneratedAnnotationDataForProject(
                            exampleProject, generatedAnnotationData
                        )
                        doc.addAnnotationResultForProject(
                            exampleProject, generatedAnnotationData.buildAnnotationResult(doc, exampleProject.id, denormalizedAnnotationSchema),
                            checkWebHooks = false, applyPolicy = true,
                            overwriteFinalizedAnnotations = false, curationRequest = null, annotationSchema = denormalizedAnnotationSchema
                        )
                        documentDAO.update(id, doc)
                    }
                }
            }
        }
    }
}
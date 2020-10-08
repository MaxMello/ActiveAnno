package annotationdefinition.generator.documenttarget

import annotationdefinition.TagSetAnnotationDefinition
import annotationdefinition.generator.*
import annotationdefinition.target.TargetType
import application.annotationDefinitionDAO
import application.httpClient
import common.HttpAuthentication
import common.applyHttpAuthentication
import document.Document
import document.annotation.*
import io.ktor.client.features.timeout
import io.ktor.client.request.post
import io.ktor.client.request.url
import io.ktor.http.ContentType
import io.ktor.http.contentType
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.slf4j.LoggerFactory
import project.annotationschema.AnnotationStepKey
import project.filter.FilterCondition
import java.util.concurrent.TimeUnit

private val logger = LoggerFactory.getLogger(TagSetDocumentTargetUpdatableGeneratorModel::class.java)

const val NOT_SELECTED_VALUE = "not_selected_NULL"

/**
 * Generic updatable AnnotationGenerator for TagSetAnnotationDefinition and DocumentTarget.
 */
class TagSetDocumentTargetUpdatableGeneratorModel(
    id: String,
    annotationDefinitionID: String,
    name: String,
    description: String,
    /**
     * Url to get predictions from
     */
    var predictUrl: String,
    /**
     * Url to call for updating the model
     */
    var updateUrl: String,
    /**
     * Url to call for optimizing a model, e.g. hyperparameter tuning
     */
    var optimizeUrl: String? = null,
    var httpAuthentication: HttpAuthentication = HttpAuthentication.None,
    var testSize: Double = 0.0,
    /**
     * How many samples are required minimum to start training / updating / predicting.
     */
    startThreshold: Int,
    /**
     * How many new samples are required compared to the previous version to update
     */
    updateThreshold: Int,
    /**
     * How to select the data for training of this generator. Will be combined with a filter of existing finalized annotation results
     * for the related annotation of this generator
     */
    dataFilter: FilterCondition,
    versions: MutableList<UpdatableAnnotationGeneratorVersion> = mutableListOf(),
    input: AnnotationStepKey,
    finalizeCondition: FinalizeCondition = FinalizeCondition.Always,
    createdTimestamp: Long = System.currentTimeMillis()
) : UpdatableAnnotationGenerator(
    id, annotationDefinitionID, TargetType.DOCUMENT_TARGET, name,
    description, input, finalizeCondition, startThreshold, updateThreshold, dataFilter, versions, createdTimestamp
) {

    private data class PredictionRequest(
        val modelName: String,
        val modelVersion: String?,
        val documents: List<SingleDocument>
    )

    private data class SingleDocument(val text: String, val id: String)

    private data class PredictionResponse(
        val text: String,
        val id: String?,
        val predictions: List<ValueToProbability>
    )

    private data class TrainRequest(
        /**
         * Name of the model, equivalent to generatorID.
         */
        val modelName: String,
        /**
         * All data used for training process. Might be split into train and test externally.
         */
        val data: List<TrainingSampleWithLabels>,
        val multiClass: Boolean,
        val testSize: Double = 0.0
    )

    private data class TrainResponse(
        val trainNumberOfExamples: Int,
        val testScore: Double? = null,
        val testNumberOfExamples: Int? = null,
        val version: Int
    )

    private data class OptimizeRequest(
        /**
         * Name of the model, equivalent to generatorID.
         */
        val modelName: String,
        /**
         * All data used for training process. Might be split into train and test externally.
         */
        val data: List<TrainingSampleWithLabels>,
        val multiClass: Boolean,
        val testSize: Double = 0.3
    )

    override suspend fun generateAnnotation(
        document: Document,
        generatedAnnotationData: GeneratedAnnotationData
    ): DocumentTargetAnnotation {
        val response = httpClient.post<List<PredictionResponse>> {
            url(predictUrl)
            applyHttpAuthentication(httpAuthentication)
            contentType(ContentType.Application.Json)
            timeout {
                requestTimeoutMillis = TimeUnit.MINUTES.toMillis(1)
            }
            body = PredictionRequest(
                id,
                versions.filter { it.updateState == UpdateState.UPDATED }.maxBy { it.createdTimestamp }?.updateResponse?.version?.toString(),
                listOf(
                    SingleDocument(
                        input.getValue(document, generatedAnnotationData.annotations)?.toString()
                            ?: throw IllegalArgumentException("Document has no documentText, cannot be predicted"),
                        document.id
                    )
                )
            )
        }.getOrNull(0) ?: throw IllegalStateException("Response from predictionModel is empty")
        return DocumentTargetAnnotation(
            response.predictions.filter { it.value != NOT_SELECTED_VALUE } // We remove NOT_SELECTED_VALUE from the predictions
        )
    }

    override suspend fun generateAnnotationBulk(
        documentsWithGeneratedAnnotationData: List<Pair<Document, GeneratedAnnotationData>>
    ): Map<Document, DocumentTargetAnnotation> {
        if(versions.any { it.updateState == UpdateState.UPDATED }) {
            val annotationDefinition = annotationDefinitionDAO.byIdOrNull(annotationDefinitionID)
            requireNotNull(annotationDefinition)
            require(annotationDefinition is TagSetAnnotationDefinition)
            val responseList = httpClient.post<List<PredictionResponse>> {
                url(predictUrl)
                applyHttpAuthentication(httpAuthentication)
                contentType(ContentType.Application.Json)
                timeout {
                    requestTimeoutMillis = TimeUnit.MINUTES.toMillis(10)
                }
                body = PredictionRequest(
                    id,
                    versions.filter { it.updateState == UpdateState.UPDATED }.maxBy { it.createdTimestamp }?.updateResponse?.version?.toString(),
                    documentsWithGeneratedAnnotationData.mapNotNull { (document, generatedAnnotationData) ->
                        try {
                            SingleDocument(
                                input.getValue(document, generatedAnnotationData.annotations)?.toString()
                                    ?: throw IllegalArgumentException("Could not get text to predict"),
                                document.id
                            )
                        } catch (e: IllegalArgumentException) {
                            logger.error("Skipped document ${document.id} for generating annotation ${annotationDefinition.id}, because ${e.message}")
                            null
                        }
                    }
                )
            }
            return responseList.map { response ->
                (documentsWithGeneratedAnnotationData.find { it.first.id == response.id }?.first ?:
                throw IllegalStateException("Bulk generation only works when externals service returns document IDs")) to DocumentTargetAnnotation(
                    response.predictions.filter { it.value != NOT_SELECTED_VALUE }
                )
            }.toMap()
        } else {
            throw IllegalStateException("Model cannot be used for generating data, no updated version exists")
        }
    }

    override suspend fun update(version: UpdatableAnnotationGeneratorVersion, data: Map<Document, List<AnnotationResult>>): Unit =
        withContext(Dispatchers.IO) {
            val annotationDefinition = annotationDefinitionDAO.byIdOrNull(annotationDefinitionID)
            requireNotNull(annotationDefinition)
            require(annotationDefinition is TagSetAnnotationDefinition)
            val trainingData = data.map { it.key to it.value.map { it.annotations } }
                .toMap().toTrainingData(annotationDefinition, input)
            val isMultiClass = annotationDefinition.minNumberOfTags == 0 || annotationDefinition.maxNumberOfTags == null ||
                    (annotationDefinition.maxNumberOfTags ?: 0) > 1
            val trainRequest = TrainRequest(
                id, trainingData, isMultiClass, testSize
            )
            val trainResponse = httpClient.post<TrainResponse> {
                url(updateUrl)
                applyHttpAuthentication(httpAuthentication)
                contentType(ContentType.Application.Json)
                timeout {
                    requestTimeoutMillis = TimeUnit.MINUTES.toMillis(30)
                }
                body = trainRequest
            }
            with(version) {
                updateState = UpdateState.UPDATED
                updateResponse = UpdateResponse(
                    trainResponse.testScore,
                    (trainResponse.testNumberOfExamples ?: 0) + trainResponse.trainNumberOfExamples,
                    trainResponse.version
                )
            }
        }

    override suspend fun optimize(data: Map<Document, List<AnnotationResult>>): Unit = withContext(Dispatchers.IO) {
        val optimizeUrl = this@TagSetDocumentTargetUpdatableGeneratorModel.optimizeUrl
        if (optimizeUrl != null) {
            val annotationDefinition = annotationDefinitionDAO.byIdOrNull(annotationDefinitionID)
            requireNotNull(annotationDefinition)
            require(annotationDefinition is TagSetAnnotationDefinition)
            val trainingData = data.map { it.key to it.value.map { it.annotations } }
                .toMap().toTrainingData(annotationDefinition, input)
            val isMultiClass = annotationDefinition.minNumberOfTags == 0 || annotationDefinition.maxNumberOfTags == null ||
                    (annotationDefinition.maxNumberOfTags ?: 0) > 1
            if (annotationDefinition.options.map { it.id }.all { optionID -> trainingData.filter { it.labels.contains(optionID) }.size > 2 }) {
                val optimizeRequest = OptimizeRequest(
                    id, trainingData, isMultiClass, if(testSize > 0.3) testSize else 0.3
                )
                launch {
                    val response = httpClient.post<String> {
                        url(optimizeUrl)
                        applyHttpAuthentication(httpAuthentication)
                        contentType(ContentType.Application.Json)
                        timeout {
                            requestTimeoutMillis = TimeUnit.MINUTES.toMillis(60)
                        }
                        body = optimizeRequest
                    }
                    logger.info("Finished optimization for generator $id: $response")
                }
            } else {
                throw IllegalStateException("Not enough training data for each annotation option yet")
            }
        } else {
            logger.warn("Cannot optimize $id, no optimizeUrl")
        }
        Unit
    }

    override fun updateModel(newAnnotationGenerator: AnnotationGenerator) {
        super.updateModel(newAnnotationGenerator)
        newAnnotationGenerator as TagSetDocumentTargetUpdatableGeneratorModel
        this.predictUrl = newAnnotationGenerator.predictUrl
        this.updateUrl = newAnnotationGenerator.updateUrl
        this.optimizeUrl = newAnnotationGenerator.optimizeUrl
        this.httpAuthentication = newAnnotationGenerator.httpAuthentication
        this.testSize = newAnnotationGenerator.testSize
    }
}

/**
 * For every [Document], get the training data text value through the [input] for a specific [annotationDefinition]. Will go through all labels
 * for the [TagSetAnnotationDefinition], and add all document texts where the [AnnotationMap]s for the [Document], has a most common value equal
 * to the label in question
 */
fun Map<Document, List<AnnotationMap>>.toTrainingData(
    annotationDefinition: TagSetAnnotationDefinition,
    input: AnnotationStepKey
): List<TrainingSampleWithLabels> {
    val labels = annotationDefinition.options.map { it.id }.toMutableSet()
    val includeMissing = annotationDefinition.minNumberOfTags == 0
    if (includeMissing) {
        labels.add(NOT_SELECTED_VALUE)
    }
    return this.mapNotNull { (document, annotationMap) ->
        annotationMap             // all annotations for this document (we will only get valid ones)
            .map { it[annotationDefinition.id] } // we want all annotations for the related annotationDefinition
            .filterIsInstance<DocumentTargetAnnotation?>()   // make sure it is document target
            .mapNotNull {
                it?.values?.map { value -> value.value.toString() }?.toSet() ?:  // Get set of values (=labels)
                if (includeMissing) setOf(NOT_SELECTED_VALUE) else null
            } // Only if includeMissing we add the not Selected Placeholder
            .groupingBy { it }  // Get the most common answer over all annotationResults (might be different in data)
            .eachCount() // by grouping by it = same value, counting each
            .maxBy { it.value } // and taking the one with the highest count
            ?.key                  // now we discard the count and keep the set of labels
            ?.ifEmpty {
                logger.warn("Set of values was empty for annotationDefinition ${annotationDefinition.id}")
                setOf(NOT_SELECTED_VALUE)   // if at this point we don't actually have anything in this document, we take null
            }?.let { valueSet ->
                // Get an annotationMap with the same data as the chosen valueSet
                val chosenAnnotationMap = annotationMap.firstOrNull {
                    ((it[annotationDefinition.id] as DocumentTargetAnnotation?)
                        ?.values
                        ?.map { value -> value.value.toString() }
                        ?.toSet()
                        ?: (if (includeMissing) setOf(NOT_SELECTED_VALUE) else null)) == valueSet
                }
                if (chosenAnnotationMap != null) {
                    // only if not null and annotation exists
                    TrainingSampleWithLabels(input.getValue(document, chosenAnnotationMap).toString(), valueSet.toList())
                } else {
                    null
                }
            }
    }
}

data class TrainingSampleWithLabels(
    val text: String,
    /**
     * Using a list of label strings allows for multi class predictions
     */
    val labels: List<String>
)
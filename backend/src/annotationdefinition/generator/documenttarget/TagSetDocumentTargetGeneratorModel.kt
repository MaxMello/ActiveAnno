package annotationdefinition.generator.documenttarget

import annotationdefinition.generator.AnnotationGenerator
import annotationdefinition.generator.FinalizeCondition
import annotationdefinition.target.TargetType
import application.httpClient
import common.HttpAuthentication
import common.applyHttpAuthentication
import document.Document
import document.annotation.DocumentTargetAnnotation
import document.annotation.GeneratedAnnotationData
import document.annotation.ValueToProbability
import io.ktor.client.features.timeout
import io.ktor.client.request.post
import io.ktor.client.request.url
import io.ktor.http.ContentType
import io.ktor.http.contentType
import project.annotationschema.AnnotationStepKey
import java.util.concurrent.TimeUnit

/**
 * Use this class for external ML models which are already trained and don't need any training data
 */
class TagSetDocumentTargetGeneratorModel(
    id: String,
    annotationDefinitionID: String,
    name: String,
    description: String,
    input: AnnotationStepKey,
    var predictUrl: String,
    var httpAuthentication: HttpAuthentication = HttpAuthentication.None,
    finalizeCondition: FinalizeCondition = FinalizeCondition.Always,
    createdTimestamp: Long = System.currentTimeMillis()
) : AnnotationGenerator(id, annotationDefinitionID, TargetType.DOCUMENT_TARGET, name, description, input, finalizeCondition, createdTimestamp) {

    private data class PredictionRequest(
        val modelName: String,
        val documents: List<SingleDocument>
    )

    private data class SingleDocument(val text: String, val id: String)

    private data class PredictionResponse(
        val text: String,
        val id: String,
        val predictions: List<ValueToProbability>
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
                id, listOf(SingleDocument(input.getValue(document, generatedAnnotationData.annotations)?.toString()
                    ?: throw IllegalArgumentException("Document has no documentText, cannot be predicted"),
                document.id))
            )
        }.getOrNull(0) ?: throw IllegalStateException("Response from predictionModel is empty")
        return DocumentTargetAnnotation(
            response.predictions
        )
    }

    override fun updateModel(newAnnotationGenerator: AnnotationGenerator) {
        super.updateModel(newAnnotationGenerator)
        newAnnotationGenerator as TagSetDocumentTargetGeneratorModel
        this.predictUrl = newAnnotationGenerator.predictUrl
        this.httpAuthentication = newAnnotationGenerator.httpAuthentication
    }
}
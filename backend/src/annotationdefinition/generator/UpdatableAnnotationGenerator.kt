package annotationdefinition.generator

import annotationdefinition.target.TargetType
import document.Document
import document.annotation.AnnotationResult
import project.annotationschema.AnnotationStepKey
import project.filter.FilterCondition


/**
 * Base class for [AnnotationGenerator]s which are updatable, for example ML models, as compared to static models like a statistics based generator
 */
abstract class UpdatableAnnotationGenerator(
    id: String,
    annotationDefinitionID: String,
    targetType: TargetType,
    name: String,
    description: String,
    input: AnnotationStepKey,
    finalizeCondition: FinalizeCondition,
    /**
     * How many samples are required minimum to start training / updating / predicting.
     */
    var startThreshold: Int,
    /**
     * How many new samples are required compared to the previous version to update
     */
    var updateThreshold: Int,
    /**
     * How to select the data for updating of this generator. Will be combined with a filter of existing finalized annotation results
     * for the related annotation of this generator
     */
    var dataFilter: FilterCondition,
    var versions: MutableList<UpdatableAnnotationGeneratorVersion> = mutableListOf(),
    createdTimestamp: Long = System.currentTimeMillis()
) : AnnotationGenerator(id, annotationDefinitionID, targetType, name, description, input, finalizeCondition, createdTimestamp) {

    /**
     * Implement this for updating the annotation generator given the [version]
     */
    abstract suspend fun update(version: UpdatableAnnotationGeneratorVersion, data: Map<Document, List<AnnotationResult>>)

    /**
     * Optionally, subclasses can implement [optimize] to optimize e.g. hyperparameters of a ML model
     */
    open suspend fun optimize(data: Map<Document, List<AnnotationResult>>) {

    }

    override fun updateModel(newAnnotationGenerator: AnnotationGenerator) {
        super.updateModel(newAnnotationGenerator)
        newAnnotationGenerator as UpdatableAnnotationGenerator
        this.startThreshold = newAnnotationGenerator.startThreshold
        this.updateThreshold = newAnnotationGenerator.updateThreshold
        this.dataFilter = newAnnotationGenerator.dataFilter
        this.versions = newAnnotationGenerator.versions
    }

}

data class UpdatableAnnotationGeneratorVersion(
    val createdTimestamp: Long = System.currentTimeMillis(),
    var updateState: UpdateState = UpdateState.NOT_UPDATED,
    var updateResponse: UpdateResponse? = null
)

enum class UpdateState {
    NOT_UPDATED, UPDATING, UPDATED
}

data class UpdateResponse(
    /**
     * Some quality score where higher means better. Can be F1 score, accuracy score, MEA, MSE, etc. depending on the implementation
     */
    val score: Double?,
    /**
     * How many samples were used to train the model (if online learning, the sum of all previous samples as well)
     */
    val numberOfExamples: Int,
    /**
     * What version number was assigned to this generator version
     */
    val version: Int,
    /**
     * Creation timestamp of the UpdateResponse (when was the update finished)
     */
    val timestamp: Long = System.currentTimeMillis()
)
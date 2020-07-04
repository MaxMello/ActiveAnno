package document

import application.documentDAO
import application.projectDAO
import document.annotation.*
import org.bson.BsonDocument
import org.bson.BsonElement
import org.bson.BsonInt32
import org.slf4j.LoggerFactory

private val logger = LoggerFactory.getLogger("DocumentIndexes")

/**
 * Create all indexes in mongoDB. If they already exist, nothing will happen. Every index is sparse, because they are dynamic and depend on user
 * input. Normally, this would not be recommended when designing a database, but because of the highly configurable nature of ActiveAnno, it is
 * done that way.
 */
suspend fun updateIndexes() {
    val activeProjects = projectDAO.getAllActive()
    // First, all originalDocument indexes
    val metaDataIndexes = activeProjects.flatMap { it.inputMapping.metaData.filter { metaData -> metaData.index != null } }.mapNotNull {
        if(it.index != null) {
            BsonDocument("${Document::originalDocument.name}.${it.key}", BsonInt32(it.index.order.convert()))
        } else {
            null
        }
    }
    val projectDependentIndexes = activeProjects.filter { it.createProjectSpecificIndexes }.map { it.id }.flatMap { projectID ->
        @Suppress("LongLine")
        listOf(
            "${Document::projectAnnotationData.name}.$projectID",
            "${Document::projectAnnotationData.name}.$projectID.${ProjectAnnotationData::policyAction.name}.type",
            "${Document::projectAnnotationData.name}.$projectID.${ProjectAnnotationData::generatedAnnotationData.name}.${GeneratedAnnotationData::timestamp.name}",
            "${Document::projectAnnotationData.name}.$projectID.${ProjectAnnotationData::annotationResults.name}.${AnnotationResult::timestamp.name}",
            "${Document::projectAnnotationData.name}.$projectID.${ProjectAnnotationData::annotationResults.name}.${AnnotationResult::id.name}",
            "${Document::projectAnnotationData.name}.$projectID.${ProjectAnnotationData::annotationResults.name}.${AnnotationResult::creator.name}.${AnnotationResultCreator.Annotator::identifier.name}",
            "${Document::projectAnnotationData.name}.$projectID.${ProjectAnnotationData::finalizedAnnotationResults.name}.${FinalizedAnnotationResult::annotationResultIDs.name}",
            "${Document::projectAnnotationData.name}.$projectID.${ProjectAnnotationData::finalizedAnnotationResults.name}.${FinalizedAnnotationResult::timestamp.name}",
            "${Document::projectAnnotationData.name}.$projectID.${ProjectAnnotationData::finalizedAnnotationResults.name}.${FinalizedAnnotationResult::exportStatistics.name}.${ExportStatistics::webHookStatistics.name}.${WebHookExport::success.name}"
        )
    }.map {
        BsonDocument(it, BsonInt32(1))
    }
    val sortIndexes = activeProjects.filter { it.createProjectSpecificIndexes && it.sort.sorts.isNotEmpty() }.map {
        it.sort.sorts.let { sorts ->
            BsonDocument(sorts.map { sort ->
                BsonElement(sort.key, BsonInt32(sort.order.convert()))
            })
        }
    }

    // Join indexes with hardcoded index on restrictedProjectConfig
    val newIndexes = (metaDataIndexes + projectDependentIndexes + sortIndexes +
            listOf(BsonDocument(Document::restrictedProjectID.name, BsonInt32(1))))

    val existingIndexes = documentDAO.getAllIndexes().mapNotNull { it["key"]?.asDocument() }
    val indexesToCreate = newIndexes.filter { it !in existingIndexes }.toSet().toList()

    // Cannot drop id index
    val indexesToRemove = existingIndexes.filter { it !in newIndexes && !it.containsKey("_id") }.toSet().toList()

    try {
        if(indexesToRemove.isNotEmpty()) {
            logger.info("Indexes to remove $indexesToRemove")
            documentDAO.dropIndexes(indexesToRemove)
        }
    } catch (e: Exception) {
        logger.error("Could not drop indexes", e)
    }
    try {
        if(indexesToCreate.isNotEmpty()) {
            logger.info("Indexes to create $indexesToCreate")
            documentDAO.createSparseIndexes(indexesToCreate)
        }
    } catch (e: Exception) {
        logger.error("Could not create indexes", e)
    }
}

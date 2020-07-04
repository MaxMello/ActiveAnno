package annotationdefinition

import com.mongodb.client.result.UpdateResult
import common.getOrCreateCollection
import io.ktor.features.NotFoundException
import io.ktor.util.KtorExperimentalAPI
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.Id
import org.litote.kmongo.coroutine.CoroutineCollection
import org.litote.kmongo.coroutine.CoroutineDatabase
import org.slf4j.LoggerFactory


private val logger = LoggerFactory.getLogger("AnnotationDefinitionDAO")

private const val ANNOTATION_DEFINITION_COLLECTION = "annotationDefinition"

/**
 * Wrapper class to prevent type erasure of [AnnotationDefinition]. This way, the JsonSubType info is preserved.
 */
class AnnotationDefinitionList : ArrayList<AnnotationDefinition>()

class AnnotationDefinitionDAO(database: CoroutineDatabase) {

    private val collection: CoroutineCollection<AnnotationDefinition> = runBlocking {
        database.getOrCreateCollection<AnnotationDefinition>(ANNOTATION_DEFINITION_COLLECTION)
    }

    suspend fun getAll(): AnnotationDefinitionList {
        return AnnotationDefinitionList().apply {
            addAll(collection.find().batchSize(10).toList())
        }
    }

    @KtorExperimentalAPI
    suspend fun byId(id: String): AnnotationDefinition {
        return collection.findOneById(id) ?: throw NotFoundException("AnnotationDefinition with id $id not found")
    }

    suspend fun byIdOrNull(id: String): AnnotationDefinition? {
        return collection.findOneById(id)
    }

    suspend fun byIdOrNull(id: Id<AnnotationDefinition>): AnnotationDefinition? {
        return collection.findOneById(id)
    }

    suspend fun save(annotationDefinition: AnnotationDefinition): UpdateResult? {
        return collection.save(annotationDefinition)
    }
}
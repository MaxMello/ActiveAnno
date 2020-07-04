package annotationdefinition.generator

import com.mongodb.client.result.UpdateResult
import common.getOrCreateCollection
import io.ktor.features.NotFoundException
import io.ktor.util.KtorExperimentalAPI
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.coroutine.CoroutineCollection
import org.litote.kmongo.coroutine.CoroutineDatabase
import org.slf4j.LoggerFactory

private val logger = LoggerFactory.getLogger("AnnotationGeneratorDAO")

private const val ANNOTATION_GENERATOR_COLLECTION = "annotationGenerator"

/**
 * DAO for [AnnotationGenerator]s
 */
class AnnotationGeneratorDAO(database: CoroutineDatabase) {

    private val collection: CoroutineCollection<AnnotationGenerator> = runBlocking {
        database.getOrCreateCollection<AnnotationGenerator>(ANNOTATION_GENERATOR_COLLECTION)
    }

    suspend fun getAll(): List<AnnotationGenerator> {
        return collection.find().batchSize(10).toList()
    }

    @KtorExperimentalAPI
    suspend fun byId(id: String): AnnotationGenerator {
        return collection.findOneById(id) ?: throw NotFoundException("AnnotationGenerator with id $id not found")
    }

    suspend fun byIdOrNull(id: String): AnnotationGenerator? {
        return collection.findOneById(id)
    }

    suspend fun save(annotationGenerator: AnnotationGenerator): UpdateResult? {
        return collection.save(annotationGenerator)
    }
}
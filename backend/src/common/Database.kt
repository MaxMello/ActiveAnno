package common

import com.mongodb.MongoCommandException
import org.litote.kmongo.coroutine.CoroutineCollection
import org.litote.kmongo.coroutine.CoroutineDatabase
import org.slf4j.LoggerFactory

/**
 * Create a mongo collection if not exist and return it
 */
suspend inline fun <reified T : Any> CoroutineDatabase.getOrCreateCollection(collectionName: String): CoroutineCollection<T> {
    try {
        if(this.listCollectionNames().none { it == collectionName }) {
            createCollection(collectionName)
        }
    } catch (e: MongoCommandException) {
        val dbLogger = LoggerFactory.getLogger("${collectionName}Collection")
        if (e.message?.contains("already exists") != true) {
            dbLogger.error("Could not create collection '$collectionName'", e)
        }
    }
    return getCollection(collectionName)
}
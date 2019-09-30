package common

import com.mongodb.MongoCommandException
import org.litote.kmongo.coroutine.CoroutineCollection
import org.litote.kmongo.coroutine.CoroutineDatabase
import org.slf4j.LoggerFactory

suspend inline fun <reified T : Any> CoroutineDatabase.getOrCreateCollection(collectionName: String): CoroutineCollection<T> {
        try {
            createCollection(collectionName)
        } catch (e: MongoCommandException) {
            val dbLogger = LoggerFactory.getLogger("${collectionName}Collection")
            if(e.message?.contains("already exists") != true) {
                dbLogger.error("Could not create collection '$collectionName'", e)
            } else {
                dbLogger.debug("Collection '$collectionName' already exists")
            }
        }
        return getCollection(collectionName)
}
package user

import com.mongodb.client.model.IndexOptions
import common.getOrCreateCollection
import config.filter.Equals
import config.userroles.UserIdentifier
import kotlinx.coroutines.runBlocking
import org.bson.BsonDocument
import org.bson.BsonInt32
import org.litote.kmongo.coroutine.CoroutineCollection
import org.litote.kmongo.coroutine.CoroutineDatabase
import org.slf4j.LoggerFactory


private val logger = LoggerFactory.getLogger("UserDAO")

private const val USER_COLLECTION = "user"

class UserDAO(database: CoroutineDatabase) {

    private val userCollection: CoroutineCollection<User> = runBlocking {
        database.getOrCreateCollection<User>(USER_COLLECTION).also {
            try {
                it.collection.createIndex(BsonDocument("userIdentifier", BsonInt32(1)), IndexOptions().unique(true))
            } catch (e: Exception) {
                logger.error("Could not create index $USER_COLLECTION.userIdentifier")
            }
        }
    }

    suspend fun getAll(): List<User> {
        return userCollection.find().batchSize(10).toList()
    }

    private suspend fun byUserIdentifier(userIdentifier: UserIdentifier): User? {
        return userCollection.findOne(Equals("userIdentifier", userIdentifier).buildQuery().toString())
    }

    suspend fun createOrUpdate(userIdentifier: UserIdentifier, userName: String? = null): User {
        val existingUser: User? = byUserIdentifier(userIdentifier)
        return existingUser?.copy(lastAccessTimestamp = System.currentTimeMillis())?.also {
            userCollection.replaceOneById(existingUser._id!!, it)
        } ?: User(userIdentifier, userName, lastAccessTimestamp = System.currentTimeMillis()).let {
            userCollection.insertOne(it)
            byUserIdentifier(userIdentifier) ?: it.also { logger.error("Could not store user, will return new User object anyway") }
        }
    }
}
package user.message

import common.getOrCreateCollection
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.coroutine.CoroutineCollection
import org.litote.kmongo.coroutine.CoroutineDatabase
import project.filter.And
import project.filter.Equals
import project.userroles.UserIdentifier

private const val MESSAGE_COLLECTION = "messages"

/**
 * DAO for the [Message] model, controlling access to the message collection.
 */
class MessageDAO(database: CoroutineDatabase) {

    private val messageCollection: CoroutineCollection<Message> = runBlocking {
        database.getOrCreateCollection<Message>(MESSAGE_COLLECTION)
    }

    private suspend fun save(message: Message) {
        messageCollection.save(message)
    }

    private suspend fun markAsRead(id: String) {
        messageCollection.findOneById(id)?.let {
            it.read = true
            messageCollection.save(it)
        }
    }

    suspend fun getAll(): List<Message> {
        return messageCollection.find().toList()
    }

    suspend fun getAllForRecipient(userIdentifier: UserIdentifier): List<Message> {
        return messageCollection.find(Equals("recipient", userIdentifier).buildQuery().toString()).toList()
    }

    suspend fun getUnreadForRecipient(userIdentifier: UserIdentifier): List<Message> {
        return messageCollection.find(
            And(
                Equals("recipient", userIdentifier),
                Equals("read", false)
            ).buildQuery().toString()
        ).toList()
    }

    suspend fun getAllForSender(userIdentifier: UserIdentifier): List<Message> {
        return messageCollection.find(Equals("sender", userIdentifier).buildQuery().toString()).toList()
    }

    suspend fun countUnreadForRecipient(userIdentifier: UserIdentifier): Long {
        return messageCollection.countDocuments(
            And(
                Equals("recipient", userIdentifier),
                Equals("read", false)
            ).buildQuery().toString()
        )
    }

    suspend fun clear() {
        messageCollection.deleteMany("{}")
    }
}
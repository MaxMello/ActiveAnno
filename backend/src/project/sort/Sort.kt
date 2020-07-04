package project.sort

import org.bson.BsonDocument
import org.bson.BsonInt32


/**
 * Enum representing the order options, ASC and DESC
 */
enum class Order {
    ASC, DESC;

    fun convert(): Int {
        return when (this) {
            ASC -> 1
            DESC -> -1
        }
    }
}

/**
 * Single sort element with key and order
 *
 * Example of sorting by information gain for an active learning model
 * key = configAnnotationData.CONFIG_ID.generatedAnnotationData.annotations.ANNOTATION_ID.probability
 * order = asc
 */
data class SortElement(
    val key: String,
    val order: Order
)

/**
 * Data class representing mongo DB sort
 */
data class Sort(
    /**
     * List of sorts, first element has highest priority
     */
    val sorts: List<SortElement>
) {

    /**
     * Convert model to BsonDocument to pass to mongo query
     */
    fun buildSort(): BsonDocument {
        val bsonDocument = BsonDocument()
        sorts.forEach {
            bsonDocument.append(it.key, BsonInt32(it.order.convert()))
        }
        return bsonDocument
    }
}
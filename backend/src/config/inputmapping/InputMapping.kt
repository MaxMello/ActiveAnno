package config.inputmapping

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import config.sort.Order


/**
 * Representing index options from MongoDB.
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type")
@JsonSubTypes(value = [
    JsonSubTypes.Type(value = CreateTextIndex::class, name = "CreateTextIndex"),
    JsonSubTypes.Type(value = CreateIndex::class, name = "CreateIndex")
])
interface Index

/**
 * Use this to apply a text index for a field
 */
class CreateTextIndex : Index {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false
        return true
    }

    override fun hashCode(): Int {
        return javaClass.hashCode()
    }

    override fun toString(): String {
        return "CreateTextIndex()"
    }
}

/**
 * Use this to define a non-text index with an order as well as an optional unique constraint
 */
data class CreateIndex(val order: Order, val unique: Boolean = false) : Index

data class DocumentText(
    /**
     * Key of the input document where the document text is found
     * Syntax separated with dots for inner objects ("document.comment.text")
     */
    val key: String,
    val createTextIndex: Boolean = false
)

data class MetaData(
    /**
     * ID to reference this metadata in the layout etc.
     */
    val id: String,
    /**
     * key inside the originalDocument
     * Syntax separated with dots for inner objects ("document.metadata.key")
     */
    val key: String,
    val index: Index? = null
)

/**
 * Mapping of originalDocument to documentData used in UI. Will be mapped based on this classes values.
 * Additionally, provides the ability to define indices for faster queries in DB
 */
data class InputMapping(
    val documentText: DocumentText,
    val metaData: List<MetaData>
)
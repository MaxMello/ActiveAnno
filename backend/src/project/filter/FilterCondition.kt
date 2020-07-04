package project.filter

import application.jsonMapper
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.databind.node.ObjectNode
import org.bson.*
import org.slf4j.LoggerFactory

private val logger = LoggerFactory.getLogger("FilterCondition")


/**
 * Light wrapper classes around MongoDB query elements. To use the [FilterCondition] as a parameter for MongoDB find, call [buildQuery] +on the
 * [FilterCondition] object.
 * Support for:
 * - all Comparison Query Operators (https://docs.mongodb.com/manual/reference/operator/query-comparison/)
 * - all Logical Query Operators (https://docs.mongodb.com/manual/reference/operator/query-logical/)
 *      - You cannot wrap AND, OR and NOR inside a NOT as NOT cannot be a top-level operator (as in MongoDB)
 * - The Exists Element Query Operator (https://docs.mongodb.com/manual/reference/operator/query-element/)
 *      - Type check not supported
 * - The Regex Evaluation Query Operators is supported (https://docs.mongodb.com/manual/reference/operator/query-evaluation/)
 *      - Every other Evaluation Query Operator is not supported
 * - Geospatial operators are currently not supported (https://docs.mongodb.com/manual/reference/operator/query-geospatial/)
 * - The All and Size Array Query operators are supported (https://docs.mongodb.com/manual/reference/operator/query-array/)
 *      - ElemMatch is currently not supported
 * - Bitwise Query Operators are not supported (https://docs.mongodb.com/manual/reference/operator/query-bitwise/)
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "operator"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = Equals::class, name = "eq"),
        JsonSubTypes.Type(value = StringEquals::class, name = "streq"),
        JsonSubTypes.Type(value = DateLessThanEquals::class, name = "datelte"),
        JsonSubTypes.Type(value = DateGreaterThanEquals::class, name = "dategte"),
        JsonSubTypes.Type(value = NotEquals::class, name = "neq"),
        JsonSubTypes.Type(value = KeyExists::class, name = "exists"),
        JsonSubTypes.Type(value = Regex::class, name = "regex"),
        JsonSubTypes.Type(value = GreaterThan::class, name = "gt"),
        JsonSubTypes.Type(value = GreaterThanEquals::class, name = "gte"),
        JsonSubTypes.Type(value = LessThan::class, name = "lt"),
        JsonSubTypes.Type(value = LessThanEquals::class, name = "lte"),
        JsonSubTypes.Type(value = In::class, name = "in"),
        JsonSubTypes.Type(value = NotIn::class, name = "nin"),
        JsonSubTypes.Type(value = ContainsAll::class, name = "all"),
        JsonSubTypes.Type(value = Size::class, name = "size"),
        JsonSubTypes.Type(value = Not::class, name = "not"),
        JsonSubTypes.Type(value = And::class, name = "and"),
        JsonSubTypes.Type(value = Or::class, name = "or"),
        JsonSubTypes.Type(value = Nor::class, name = "nor")
    ]
)
sealed class FilterCondition(val key: String) {

    internal abstract fun toQuery(): JsonNode

    internal abstract fun toBson(): BsonValue

    fun buildQuery(): ObjectNode {
        return jsonMapper.createObjectNode().apply {
            set<JsonNode>(key, toQuery())
        }
    }

    fun buildBson(): BsonDocument {
        val bsonDocument = BsonDocument()
        bsonDocument.append(key, toBson())
        return bsonDocument
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is FilterCondition) return false

        if (key != other.key) return false

        return true
    }

    override fun hashCode(): Int {
        return key.hashCode()
    }

    override fun toString(): String {
        return buildQuery().toString()
    }

}

/*
 * Value comparison operators
 */

/**
 * Use for direct equals or array contains
 */
class Equals(key: String, val value: Any?) : FilterCondition(key) {

    override fun toBson(): BsonDocument {
        return BsonDocument("\$eq", toBsonValue(value))
    }

    override fun toQuery(): ObjectNode {
        return jsonMapper.createObjectNode().putAny("\$eq", value)
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Equals) return false
        if (!super.equals(other)) return false

        if (value != other.value) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + (value?.hashCode() ?: 0)
        return result
    }
}

/**
 * Class to compare value inside document and [value] both as strings, using Mongos expr feature
 */
class StringEquals(val objectKey: String, val value: Any?) : FilterCondition("\$expr") {

    override fun toBson(): BsonDocument {
        return BsonDocument(
            "\$eq",
            BsonArray(
                listOf(
                    BsonDocument("\$toString", BsonString("\$$objectKey")),
                    toBsonValue(value)
                )
            )
        )
    }

    override fun toQuery(): ObjectNode {
        val toString = jsonMapper.createObjectNode()
        toString.put("\$toString", "\$$objectKey")
        val equalsArray = jsonMapper.createArrayNode()
        equalsArray.add(toString)
        equalsArray.add(value.toString())
        val eq = jsonMapper.createObjectNode()
        eq.set<ObjectNode>("\$eq", equalsArray)
        return eq
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Equals) return false
        if (!super.equals(other)) return false

        if (value != other.value) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + (value?.hashCode() ?: 0)
        return result
    }
}

/**
 * Filter based on a mapping a date string to timestamp and then performing LTE on the [value] provided. If the value is not existing,
 * won't return the document
 */
class DateLessThanEquals(val objectKey: String, val mongoDateFormat: String, val value: Long) : FilterCondition("\$expr") {

    override fun toBson(): BsonDocument {
        return BsonDocument(
            "\$lte",
            BsonArray(
                listOf(
                    BsonDocument(
                        "\$toLong", BsonDocument(
                            "\$dateFromString", BsonDocument(
                                listOf(
                                    BsonElement("dateString", BsonString("\$$objectKey")),
                                    BsonElement("format", BsonString(mongoDateFormat)),
                                    BsonElement("onNull", BsonInt64(Long.MAX_VALUE))
                                )
                            )
                        )
                    ),
                    BsonInt64(value)
                )
            )
        )
    }

    override fun toQuery(): ObjectNode {
        val dateFromStringObject = jsonMapper.createObjectNode()
        dateFromStringObject.put("dateString", "\$$objectKey")
        dateFromStringObject.put("format", mongoDateFormat)
        // On null, we use the maximum size value so LTE is always false
        val onNull = jsonMapper.createObjectNode()
        onNull.put("\$numberLong", Long.MAX_VALUE.toString())
        dateFromStringObject.set<ObjectNode>("onNull", onNull)

        val dateFromString = jsonMapper.createObjectNode()
        dateFromString.set<ArrayNode>("\$dateFromString", dateFromStringObject)

        val toLong = jsonMapper.createObjectNode()
        toLong.set<ObjectNode>("\$toLong", dateFromString)

        val lteArray = jsonMapper.createArrayNode()
        lteArray.add(toLong)
        val valueLong = jsonMapper.createObjectNode()
        valueLong.put("\$numberLong", value.toString())
        lteArray.add(valueLong)

        val lte = jsonMapper.createObjectNode()
        lte.set<ObjectNode>("\$lte", lteArray)
        println(lte.toPrettyString())
        return lte
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false
        if (!super.equals(other)) return false

        other as DateLessThanEquals

        if (objectKey != other.objectKey) return false
        if (mongoDateFormat != other.mongoDateFormat) return false
        if (value != other.value) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + objectKey.hashCode()
        result = 31 * result + mongoDateFormat.hashCode()
        result = 31 * result + value.hashCode()
        return result
    }

}

/**
 * Filter based on a mapping a date string to timestamp and then performing GTE on the [value] provided.
 */
class DateGreaterThanEquals(val objectKey: String, val mongoDateFormat: String, val value: Long) : FilterCondition("\$expr") {

    override fun toBson(): BsonDocument {
        return BsonDocument(
            "\$gte",
            BsonArray(
                listOf(
                    BsonDocument(
                        "\$toLong", BsonDocument(
                            "\$dateFromString", BsonDocument(
                                listOf(
                                    BsonElement("dateString", BsonString("\$$objectKey")),
                                    BsonElement("format", BsonString(mongoDateFormat)),
                                    BsonElement("onNull", BsonInt64(-1L))
                                )
                            )
                        )
                    ),
                    BsonInt64(value)
                )
            )
        )
    }

    override fun toQuery(): ObjectNode {
        val dateFromStringObject = jsonMapper.createObjectNode()
        dateFromStringObject.put("dateString", "\$$objectKey")
        dateFromStringObject.put("format", mongoDateFormat)
        // On null, we use the -1L as the value so GTE is always false
        val onNull = jsonMapper.createObjectNode()
        onNull.put("\$numberLong", (-1L).toString())
        dateFromStringObject.set<ObjectNode>("onNull", onNull)

        val dateFromString = jsonMapper.createObjectNode()
        dateFromString.set<ObjectNode>("\$dateFromString", dateFromStringObject)

        val toLong = jsonMapper.createObjectNode()
        toLong.set<ObjectNode>("\$toLong", dateFromString)

        val gteArray = jsonMapper.createArrayNode()
        gteArray.add(toLong)
        val valueLong = jsonMapper.createObjectNode()
        valueLong.put("\$numberLong", value.toString())
        gteArray.add(valueLong)

        val gte = jsonMapper.createObjectNode()
        gte.set<ObjectNode>("\$gte", gteArray)
        return gte
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false
        if (!super.equals(other)) return false

        other as DateGreaterThanEquals

        if (objectKey != other.objectKey) return false
        if (mongoDateFormat != other.mongoDateFormat) return false
        if (value != other.value) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + objectKey.hashCode()
        result = 31 * result + mongoDateFormat.hashCode()
        result = 31 * result + value.hashCode()
        return result
    }
}

class NotEquals(key: String, val value: Any?) : FilterCondition(key) {

    override fun toBson(): BsonDocument {
        return BsonDocument("\$ne", toBsonValue(value))
    }

    override fun toQuery(): ObjectNode {
        return jsonMapper.createObjectNode().putAny("\$ne", value)
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is NotEquals) return false
        if (!super.equals(other)) return false

        if (value != other.value) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + (value?.hashCode() ?: 0)
        return result
    }
}

class KeyExists(key: String, val value: Boolean) : FilterCondition(key) {

    override fun toBson(): BsonDocument {
        return BsonDocument("\$exists", BsonBoolean(value))
    }

    override fun toQuery(): ObjectNode {
        return jsonMapper.createObjectNode().putAny("\$exists", value)
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is KeyExists) return false
        if (!super.equals(other)) return false

        if (value != other.value) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + value.hashCode()
        return result
    }
}

class Regex(key: String, val value: String, val options: String? = null) : FilterCondition(key) {

    override fun toBson(): BsonDocument {
        return BsonDocument(
            listOfNotNull(
                BsonElement("\$regex", BsonString(value)),
                if(options != null) BsonElement("\$options", BsonString(options)) else null
            )
        )
    }

    override fun toQuery(): ObjectNode {
        return jsonMapper.createObjectNode().put("\$regex", value).apply {
            if (options != null) {
                put("\$options", options)
            }
        }
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Regex) return false
        if (!super.equals(other)) return false

        if (value != other.value) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + value.hashCode()
        return result
    }
}

class GreaterThan(key: String, val value: Any) : FilterCondition(key) {

    override fun toBson(): BsonDocument {
        return BsonDocument("\$gt", toBsonValue(value))
    }

    override fun toQuery(): ObjectNode {
        return jsonMapper.createObjectNode().putAny("\$gt", value)
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is GreaterThan) return false
        if (!super.equals(other)) return false

        if (value != other.value) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + value.hashCode()
        return result
    }
}

class GreaterThanEquals(key: String, val value: Any) : FilterCondition(key) {

    override fun toBson(): BsonDocument {
        return BsonDocument("\$gte", toBsonValue(value))
    }

    override fun toQuery(): ObjectNode {
        return jsonMapper.createObjectNode().putAny("\$gte", value)
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is GreaterThanEquals) return false
        if (!super.equals(other)) return false

        if (value != other.value) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + value.hashCode()
        return result
    }
}

class LessThan(key: String, val value: Any) : FilterCondition(key) {

    override fun toBson(): BsonDocument {
        return BsonDocument("\$lt", toBsonValue(value))
    }


    override fun toQuery(): ObjectNode {
        return jsonMapper.createObjectNode().putAny("\$lt", value)
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is LessThan) return false
        if (!super.equals(other)) return false

        if (value != other.value) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + value.hashCode()
        return result
    }
}

class LessThanEquals(key: String, val value: Any) : FilterCondition(key) {

    override fun toBson(): BsonDocument {
        return BsonDocument("\$lte", toBsonValue(value))
    }


    override fun toQuery(): ObjectNode {
        return jsonMapper.createObjectNode().putAny("\$lte", value)
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is LessThanEquals) return false
        if (!super.equals(other)) return false

        if (value != other.value) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + value.hashCode()
        return result
    }
}

class In(key: String, val value: List<Any?>) : FilterCondition(key) {

    override fun toBson(): BsonDocument {
        return BsonDocument("\$in", toBsonValue(value))
    }

    override fun toQuery(): ObjectNode {
        return jsonMapper.createObjectNode()
            .set("\$in", jsonMapper.createArrayNode().apply { value.forEach { addAny(it) } }) as ObjectNode
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is In) return false
        if (!super.equals(other)) return false

        if (value != other.value) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + value.hashCode()
        return result
    }
}

class NotIn(key: String, val value: List<Any?>) : FilterCondition(key) {

    override fun toBson(): BsonDocument {
        return BsonDocument("\$nin", toBsonValue(value))
    }

    override fun toQuery(): ObjectNode {
        return jsonMapper.createObjectNode()
            .set("\$nin", jsonMapper.createArrayNode().apply { value.forEach { addAny(it) } }) as ObjectNode
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is NotIn) return false
        if (!super.equals(other)) return false

        if (value != other.value) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + value.hashCode()
        return result
    }
}

/*
 Array operators
 */


/**
 * Equivalent to And connection between Contains conditions, exists as shorthand
 * Example:
 * { tags: { $all: [ "ssl" , "security" ] } } => { $and: [ { tags: "ssl" }, { tags: "security" } ] }
 */
class ContainsAll(key: String, val value: List<Any?>) : FilterCondition(key) {

    override fun toBson(): BsonDocument {
        return BsonDocument("\$all", toBsonValue(value))
    }

    override fun toQuery(): ObjectNode {
        return jsonMapper.createObjectNode().set("\$all", jsonMapper.createArrayNode().apply { value.forEach { addAny(it) } }) as ObjectNode
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is ContainsAll) return false
        if (!super.equals(other)) return false

        if (value != other.value) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + value.hashCode()
        return result
    }
}

class Size(key: String, val value: Int) : FilterCondition(key) {

    override fun toBson(): BsonDocument {
        return BsonDocument("\$size", BsonInt32(value))
    }

    override fun toQuery(): ObjectNode {
        return jsonMapper.createObjectNode().putAny("\$size", value)
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Size) return false
        if (!super.equals(other)) return false

        if (value != other.value) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + value
        return result
    }
}

/*
Logical operators
 */

class Not(val filterCondition: FilterCondition) : FilterCondition(filterCondition.key) {

    override fun toBson(): BsonDocument {
        return when (filterCondition) {
            is Or, is And, is Nor -> throw IllegalArgumentException("Not not allowed around AND, OR and NOR")
            else -> BsonDocument("\$not", filterCondition.toBson())
        }
    }

    override fun toQuery(): ObjectNode {
        return when (filterCondition) {
            is Or, is And, is Nor -> throw IllegalArgumentException("Not not allowed around AND, OR and NOR")
            else -> jsonMapper.createObjectNode().set("\$not", filterCondition.toQuery()) as ObjectNode
        }
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Not) return false
        if (!super.equals(other)) return false

        if (filterCondition != other.filterCondition) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + filterCondition.hashCode()
        return result
    }
}

class And(vararg val filterConditions: FilterCondition) : FilterCondition("\$and") {

    override fun toBson(): BsonArray {
        return BsonArray(filterConditions.map { BsonDocument(it.key, it.toBson()) })
    }

    override fun toQuery(): ArrayNode {
        return jsonMapper.createArrayNode()
            .apply { filterConditions.forEach { add(jsonMapper.createObjectNode().set<ObjectNode>(it.key, it.toQuery())) } }
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is And) return false
        if (!super.equals(other)) return false

        if (!filterConditions.contentEquals(other.filterConditions)) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + filterConditions.contentHashCode()
        return result
    }
}

class Or(vararg val filterConditions: FilterCondition) : FilterCondition("\$or") {

    override fun toBson(): BsonArray {
        return BsonArray(filterConditions.map { BsonDocument(it.key, it.toBson()) })
    }

    override fun toQuery(): ArrayNode {
        return jsonMapper.createArrayNode()
            .apply { filterConditions.forEach { add(jsonMapper.createObjectNode().set<ObjectNode>(it.key, it.toQuery())) } }
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Or) return false
        if (!super.equals(other)) return false

        if (!filterConditions.contentEquals(other.filterConditions)) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + filterConditions.contentHashCode()
        return result
    }
}

class Nor(vararg val filterConditions: FilterCondition) : FilterCondition("\$nor") {

    override fun toBson(): BsonArray {
        return BsonArray(filterConditions.map { BsonDocument(it.key, it.toBson()) })
    }

    override fun toQuery(): ArrayNode {
        return jsonMapper.createArrayNode()
            .apply { filterConditions.forEach { add(jsonMapper.createObjectNode().set<ObjectNode>(it.key, it.toQuery())) } }
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Nor) return false
        if (!super.equals(other)) return false

        if (!filterConditions.contentEquals(other.filterConditions)) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + filterConditions.contentHashCode()
        return result
    }
}

private fun ObjectNode.putAny(key: String, value: Any?, unknownToString: Boolean = true): ObjectNode {
    when (value) {
        is Int -> this.put(key, value)
        is Long -> this.put(key, value)
        is Boolean -> this.put(key, value)
        is String -> this.put(key, value)
        is Collection<*> -> this.putArray(key).apply { value.forEach { addAny(it) } }
        null -> this.put(key, null as String?)
        else -> if (unknownToString) {
            this.put(key, value.toString())
        } else {
            throw IllegalArgumentException("Value $value cannot be cast to supported type")
        }
    }
    return this
}

private fun ArrayNode.addAny(value: Any?, unknownToString: Boolean = true): ArrayNode {
    when (value) {
        is Int -> this.add(value)
        is Long -> this.add(value)
        is Boolean -> this.add(value)
        is String -> this.add(value)
        is Collection<*> -> this.addArray().apply { value.forEach { addAny(it) } }
        null -> this.add(null as String?)
        else -> if (unknownToString) {
            this.add(value.toString())
        } else {
            throw IllegalArgumentException("Value $value cannot be cast to supported type")
        }
    }
    return this
}


fun toBsonValue(value: Any?): BsonValue {
    return when (value) {
        null -> BsonNull()
        is String -> BsonString(value)
        is Int -> BsonInt32(value)
        is Long -> BsonInt64(value)
        is Double -> BsonDouble(value)
        is Boolean -> BsonBoolean(value)
        is List<*> -> BsonArray(value.map { toBsonValue(it) })
        else -> {
            logger.warn("Unknown type conversion to BSON, using string")
            BsonString(value.toString())
        }
    }
}
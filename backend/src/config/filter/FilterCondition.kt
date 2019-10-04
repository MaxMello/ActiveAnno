package config.filter

import application.jsonMapper
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.databind.node.ObjectNode

/**
 * Light wrapper classes around MongoDB query elements. To use the [FilterCondition] as a parameter for MongoDB find, call [buildQuery] on the [FilterCondition] object.
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
    property = "operator")
@JsonSubTypes(value = [
    JsonSubTypes.Type(value = Equals::class, name = "eq"),
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
])
sealed class FilterCondition(val key: String) {

    internal abstract fun toQuery(): JsonNode

    fun buildQuery(): ObjectNode {
        return jsonMapper.createObjectNode().apply {
            set(key, toQuery())
        }
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

class NotEquals(key: String, val value: Any?) : FilterCondition(key) {
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

class Regex(key: String, val value: String) : FilterCondition(key) {
    override fun toQuery(): ObjectNode {
        return jsonMapper.createObjectNode().putAny("\$regex", value)
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
    override fun toQuery(): ArrayNode {
        return jsonMapper.createArrayNode()
            .apply { filterConditions.forEach { add(jsonMapper.createObjectNode().set(it.key, it.toQuery())) } }
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
    override fun toQuery(): ArrayNode {
        return jsonMapper.createArrayNode()
            .apply { filterConditions.forEach { add(jsonMapper.createObjectNode().set(it.key, it.toQuery())) } }
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
    override fun toQuery(): ArrayNode {
        return jsonMapper.createArrayNode()
            .apply { filterConditions.forEach { add(jsonMapper.createObjectNode().set(it.key, it.toQuery())) } }
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

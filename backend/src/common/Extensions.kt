package common

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ObjectNode
import org.slf4j.LoggerFactory
import java.io.File
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.util.*
import kotlin.math.max
import kotlin.math.pow

private val logger = LoggerFactory.getLogger("Extensions")

/**
 * Extension function to map a mutable list in place by using an iterator
 */
inline fun <T> MutableList<T>.mapInPlace(mutator: (T) -> T): MutableList<T> {
    val iterate = this.listIterator()
    while (iterate.hasNext()) {
        val oldValue = iterate.next()
        val newValue = mutator(oldValue)
        if (newValue !== oldValue) {
            iterate.set(newValue)
        }
    }
    return this
}

/**
 * Based on a nested key string like "a.b.c", get value for key b in a and key c in b. Null if not found.
 */
fun ObjectNode.getNestedKey(key: String, separator: String = "."): JsonNode? {
    var currentRef: JsonNode? = this
    key.split(separator).forEach { keyPart ->
        currentRef = currentRef?.get(keyPart)
    }
    return currentRef
}

/**
 * Convert a [JsonNode] to the value it represents, e.g. int, long or text. Text is default
 */
fun JsonNode?.asAny(): Any? {
    return try {
        when {
            this == null -> null
            isNull -> null
            canConvertToInt() -> asInt()
            canConvertToLong() -> asLong()
            isDouble -> asDouble()
            isBoolean -> asBoolean()
            isTextual -> asText()
            else -> asText()
        }
    } catch (e: Exception) {
        logger.error("Cannot convert json node value, return null", e)
        null
    }
}

/**
 * Is this string is a pathname, read the context of the file. If not, return [this]
 */
fun String.tryReadAsFileOrReturnValue() = try {
    File(this).readText()
} catch (e: Exception) {
    this
}

private val decimalFormat = DecimalFormat("0", DecimalFormatSymbols.getInstance(Locale.ENGLISH)).apply {
    maximumFractionDigits = 340
    maximumIntegerDigits = 340
}

/**
 * Check if the remainder of a division is zero, using BigDecimal and BigInteger to get proper behavior
 */
fun Double.isRemainderZero(divisor: Double): Boolean {
    val decimalPlaces = max(decimalFormat.format(this).substringAfter(".").length,
        decimalFormat.format(divisor).substringAfter(".").length)
    val factor = 10.0.pow(decimalPlaces).toBigDecimal()
    val dividendBigInt = (this.toBigDecimal() * factor).toBigInteger()
    val divisorBigInt = (divisor.toBigDecimal() * factor).toBigInteger()
    println("$dividendBigInt % $divisorBigInt == 0?")
    return dividendBigInt % divisorBigInt == 0.toBigInteger()
}

/**
 * Return the NEW value if absent, or get the existing value
 */
fun <K: Any?, V: Any> MutableMap<K, V>.putIfAbsentAndGet(key: K, value: V): V {
    if(this[key] == null) {
        this[key] = value
    }
    return this[key] ?: throw IllegalStateException("Value missing from map, even though it should have been added")
}

/**
 * Equivalent to computeIfAbsent, but also return the created or existing value
 */
fun <K: Any?, V: Any> MutableMap<K, V>.computeIfAbsentAndGet(key: K, valueCreator: () -> V): V {
    if(this[key] == null) {
        this[key] = valueCreator()
    }
    return this[key] ?: throw IllegalStateException("Value missing from map, even though it should have been added")
}

/**
 * If [this] is a number, return it as double, else null
 */
fun Any.toDoubleOrNull(): Double? {
    return (this as? Number)?.toDouble()
}

/**
 * Equivalent to kotlins all(), but return false if the iterable is empty where all() would return true.
 */
inline fun <T> Iterable<T>.allAndNotEmpty(predicate: (T) -> Boolean): Boolean {
    if(this !is Collection) return false
    if (isEmpty()) return false
    for (element in this) if (!predicate(element)) return false
    return true
}

/**
 * Equivalent to kotlins maxBy, but allow for the selector to return null, in which case null will be returned.
 */
inline fun <T, R : Comparable<R>> Iterable<T>.maxByOrNullIfNull(selector: (T) -> R?): T? {
    val iterator = iterator()
    if (!iterator.hasNext()) return null
    var maxElem: T? = iterator.next()
    var maxValue: R? = selector(maxElem!!) // Here, we know maxElem is not null, but might be later
    if(maxValue == null) {
        maxElem = null
    }
    if (!iterator.hasNext()) return maxElem // Can be null here
    do {
        val e: T = iterator.next()  // At least 1 more element in first loop
        val v: R? = selector(e)
        if(v != null) {
            if(maxValue == null) {
                // If we don't have any non-null element yet, set the current element / value
                maxElem = e
                maxValue = v
            } else if (maxValue < v) {
                // Here, we know both values are not null, so we do the usual comparison
                maxElem = e
                maxValue = v
            }
        }
    } while (iterator.hasNext())
    return maxElem
}
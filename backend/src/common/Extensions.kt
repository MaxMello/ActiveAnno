package common

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ObjectNode

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

package annotationdefinition.target

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonValue

/**
 * Enum class representing the two Target types, equivalent value to the JsonSubType of Target class
 */
enum class TargetType(@JsonValue val value: String) {
    DOCUMENT_TARGET(DOCUMENT_TARGET_STR),
    SPAN_TARGET(SPAN_TARGET_STR);

    companion object {
        @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
        @JvmStatic
        fun forTargetTypeString(@JsonProperty("targetType") targetType: String?): TargetType? {
           return TargetType.values().find { it.value == targetType }
        }
    }
}
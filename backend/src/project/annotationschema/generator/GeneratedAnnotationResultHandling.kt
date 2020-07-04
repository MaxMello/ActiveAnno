package project.annotationschema.generator

import com.fasterxml.jackson.annotation.*


enum class HandlingPolicyType(@JsonValue val value: String) {
    IGNORE("Ignore"), PRESELECTION("Preselection"), GENERATOR_AS_ANNOTATOR("GeneratorAsAnnotator");

    companion object {
        @JsonCreator
        @JvmStatic
        fun forValue(@JsonProperty("type") theValue: String?): HandlingPolicyType? {
            return values().find { it.value == theValue }
        }
    }
}

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = HandlingPolicy.Ignore::class, name = "Ignore"),
        JsonSubTypes.Type(value = HandlingPolicy.Preselection::class, name = "Preselection"),
        JsonSubTypes.Type(value = HandlingPolicy.GeneratorAsAnnotator::class, name = "GeneratorAsAnnotator")
    ]
)
sealed class HandlingPolicy {

    /**
     * Default. Ignore any kind of generated annotation data / generated annotation results
     */
    object Ignore: HandlingPolicy() {
        override fun equals(other: Any?): Boolean {
            return this.javaClass == other?.javaClass
        }

        override fun hashCode(): Int {
            return this.javaClass.hashCode()
        }

        override fun toString(): String {
            return "HandlingPolicy.Ignore"
        }
    }

    data class Preselection(
        /**
         * Should probabilities of generated annotations be shown in the UI if available?
         */
        val showProbabilities: Boolean
    ) : HandlingPolicy()

    object GeneratorAsAnnotator: HandlingPolicy() {
        override fun equals(other: Any?): Boolean {
            return this.javaClass == other?.javaClass
        }

        override fun hashCode(): Int {
            return this.javaClass.hashCode()
        }

        override fun toString(): String {
            return "HandlingPolicy.GeneratorAsAnnotator"
        }
    }
}

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = GeneratorTiming.Never::class, name = "Never"),
        JsonSubTypes.Type(value = GeneratorTiming.Always::class, name = "Always"),
        JsonSubTypes.Type(value = GeneratorTiming.OnGetDocumentRequest::class, name = "OnGetDocumentRequest"),
        JsonSubTypes.Type(value = GeneratorTiming.OnGenerateMissingAnnotationsRequest::class, name = "OnGenerateMissingAnnotationsRequest")
    ]
)
sealed class GeneratorTiming {
    /**
     * Never generate any annotations for this project
     */
    object Never: GeneratorTiming() {
        override fun equals(other: Any?): Boolean {
            return this.javaClass == other?.javaClass
        }

        override fun hashCode(): Int {
            return this.javaClass.hashCode()
        }

        override fun toString(): String {
            return "GeneratorTiming.Never"
        }
    }
    /**
     * Generate missing annotations in every possibility (fresh + fast if already fresh, but more often)
     */
    object Always: GeneratorTiming() {
        override fun equals(other: Any?): Boolean {
            return this.javaClass == other?.javaClass
        }

        override fun hashCode(): Int {
            return this.javaClass.hashCode()
        }

        override fun toString(): String {
            return "GeneratorTiming.Always"
        }
    }

    /**
     * Generate missing annotations only when requesting documents (freshest, possibly very slow)
     */
    object OnGetDocumentRequest: GeneratorTiming() {
        override fun equals(other: Any?): Boolean {
            return this.javaClass == other?.javaClass
        }

        override fun hashCode(): Int {
            return this.javaClass.hashCode()
        }

        override fun toString(): String {
            return "GeneratorTiming.OnGetDocumentRequest"
        }
    }
    /**
     * Generate missing annotations only on specific endpoint (fast at use time, might have older or missing generated annotation data)
     */
    object OnGenerateMissingAnnotationsRequest: GeneratorTiming() {
        override fun equals(other: Any?): Boolean {
            return this.javaClass == other?.javaClass
        }

        override fun hashCode(): Int {
            return this.javaClass.hashCode()
        }

        override fun toString(): String {
            return "GeneratorTiming.OnGenerateMissingAnnotationsRequest"
        }
    }
}

/**
 * How to handle sorting of documents for annotators when generated results is available
 */
enum class GeneratorSortingPolicy {
    /**
     * Use the normal sort ordering defined in Sort
     */
    NORMAL_SORT,
    /**
     * Use the normal sort ordering, but prefer documents with generated data available first
     */
    DOCUMENTS_WITH_GENERATED_DATA_FIRST,
    /**
     * If possible, sort documents by maximum information gain for updatable annotation generator if they exist. If not, documents with generated
     * data will still be preferred, sorted by normal sort.
     */
    ACTIVE_LEARNING_SORT
}

data class GeneratedAnnotationResultHandling(
    val handlingPolicy: HandlingPolicy = HandlingPolicy.Ignore,
    val sortingPolicy: GeneratorSortingPolicy = GeneratorSortingPolicy.NORMAL_SORT,
    val updateGeneratedAnnotationDataOnNewVersion: Boolean = false,
    val generatorTiming: GeneratorTiming = GeneratorTiming.OnGenerateMissingAnnotationsRequest
)
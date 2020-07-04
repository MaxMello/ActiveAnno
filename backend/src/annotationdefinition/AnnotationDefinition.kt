package annotationdefinition

import annotationdefinition.target.Target
import api.annotate.dto.ValidationError
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import document.annotation.Annotation
import document.annotation.AnnotationMap
import org.bson.codecs.pojo.annotations.BsonId
import java.util.*

typealias AnnotationID = String

/**
 * Base class for all [AnnotationDefinition]s. An [AnnotationDefinition] defines how an annotation is required to be
 * created, e.g. on which target it is defined, is it optional, maximum length etc.
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = TagSetAnnotationDefinition::class, name = "TagSetAnnotationDefinition"),
        JsonSubTypes.Type(value = HierarchicalTagSetAnnotationDefinition::class, name = "HierarchicalTagSetAnnotationDefinition"),
        JsonSubTypes.Type(value = OpenTagAnnotationDefinition::class, name = "OpenTagAnnotationDefinition"),
        JsonSubTypes.Type(value = OpenTextAnnotationDefinition::class, name = "OpenTextAnnotationDefinition"),
        JsonSubTypes.Type(value = BooleanAnnotationDefinition::class, name = "BooleanAnnotationDefinition"),
        JsonSubTypes.Type(value = ClosedNumberAnnotationDefinition::class, name = "ClosedNumberAnnotationDefinition"),
        JsonSubTypes.Type(value = OpenNumberAnnotationDefinition::class, name = "OpenNumberAnnotationDefinition"),
        JsonSubTypes.Type(value = NumberRangeAnnotationDefinition::class, name = "NumberRangeAnnotationDefinition")
    ]
)
abstract class AnnotationDefinition(
    /**
     * Explicit ID identifying an annotation definition.
     */
    @BsonId val id: AnnotationID,
    /**
     * The primary, human readable name of the annotation. Should be clear, but not too long. Additional explanations might be given
     * via Layout elements, but in the best case, that would not be necessary. For example "Sentiment score" for sentiment, or
     * "Contains personal data" for a boolean annotation.
     */
    var name: String,
    /**
     * Shorter version of name, optional. If present, will be used for UI elements with limited space, i.e.
     * for inline span labels
     */
    var shortName: String?,
    val createdTimestamp: Long
) {

    /**
     * Validate an annotation based on the defined constraints, needs to be implemented by every subclass.
     */
    abstract fun validateAnnotation(
        annotations: AnnotationMap,
        target: Target,
        locale: Locale? = null
    ): ValidationError?

    /**
     * Update the database model of an instance from a new instance. This should be used to control which fields
     * are updatable through the API and which are not.
     */
    open fun updateModel(newAnnotationDefinition: AnnotationDefinition) {
        this.name = newAnnotationDefinition.name
        this.shortName = newAnnotationDefinition.shortName
    }

    /**
     * Can transform a generated annotation into a annotation result annotation. For example,
     * apply minimum probabilities or max. number of answers given the annotationDefinition
     */
    open fun transformGeneratedAnnotation(annotation: Annotation<*>): Annotation<*> {
        return annotation
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is AnnotationDefinition) return false

        if (id != other.id) return false

        return true
    }

    override fun hashCode(): Int {
        return id.hashCode()
    }

    override fun toString(): String {
        return "${this::class.java.simpleName}(id='$id', name='$name')"
    }
}
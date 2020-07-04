package document.annotation

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import document.annotation.AnnotationResultCreator.*
import project.userroles.UserIdentifier

/**
 * The [AnnotationResultCreator] represents by whom an [AnnotationResult] was created, which can be by humans ([Annotator], [Curator]),
 * a machine [Generators], externally [Import] or through consensus of all the previous [Consensus].
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = AnnotationResultCreator.Annotator::class, name = "Annotator"),
        JsonSubTypes.Type(value = AnnotationResultCreator.Curator::class, name = "Curator"),
        JsonSubTypes.Type(value = AnnotationResultCreator.Generators::class, name = "Generators"),
        JsonSubTypes.Type(value = AnnotationResultCreator.Import::class, name = "Import"),
        JsonSubTypes.Type(value = AnnotationResultCreator.Consensus::class, name = "Consensus")
    ]
)
sealed class AnnotationResultCreator {
    data class Annotator(val identifier: UserIdentifier) : AnnotationResultCreator()
    data class Curator(val identifier: UserIdentifier) : AnnotationResultCreator()
    data class Generators(val ids: List<String>): AnnotationResultCreator()
    data class Import(val identifier: UserIdentifier): AnnotationResultCreator()
    data class Consensus(val creators: Set<AnnotationResultCreator>) : AnnotationResultCreator()
}
package document.annotation

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import config.policy.Policy
import config.userroles.UserIdentifier
import java.net.URL

/**
 * Data class representing a finalized annotation, which can be one or multiple annotations (referenced by their IDs).
 * It also contains meta data about why the document was finalized, which policy was used, when the finalization happened,
 * and statistics about how the annotations were exported.
 */
data class FinalizedAnnotation(
    val annotationResultIDs: List<String>,
    val finalizedReason: FinalizedReason,
    val usedPolicy: Policy,
    val timestamp: Long,
    val exportStatistics: ExportStatistics = ExportStatistics()
)

/**
 * Sealed class with two options why a annotation can be finalized
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type")
@JsonSubTypes(value = [
    JsonSubTypes.Type(value = FinalizedReason.Policy::class, name = "Policy"),
    JsonSubTypes.Type(value = FinalizedReason.Curator::class, name = "Curator")
])
sealed class FinalizedReason {
    /**
     * FinalizedReason that the Policy logic decided that the annotations are finished.
     */
    object Policy : FinalizedReason()

    /**
     * FinalizedReason that a curator annotated the document.
     */
    data class Curator(val curator: UserIdentifier): FinalizedReason()
}

/**
 * Data class holding information about where and how often the annotations were exported.
 */
data class ExportStatistics(
    val webHookStatistics: MutableList<WebHookExport> = mutableListOf(),
    val restStatistics: MutableList<RestCall> = mutableListOf()
)

/**
 * Information about a web hook export, containing the export URL, how often it was tries, if it was successful,
 * and possible failure logs for debugging purposes (for example when the web hook returns a 401 unauthorized etc.)
 */
data class WebHookExport(
    val url: URL,
    var tries: Int = 0,
    var success: Boolean = false,
    val createdTimestamp: Long,
    var updatedTimestamp: Long,
    val failureLogs: MutableList<String> = mutableListOf()
)

/**
 * Information about an export via rest call, mainly the route called, how often, and when.
 */
data class RestCall(
    val route: String,
    var calls: Int = 0,
    val createdTimestamp: Long,
    var updatedTimestamp: Long
)



package document.annotation

/**
 * Data class representing log data from the interaction of the user with the document during annotation.
 */
data class InteractionLog(
    val firstShownTimestamp: Long,
    val firstInteractionTimestamp: Long,
    val lastInteractionTimestamp: Long
)
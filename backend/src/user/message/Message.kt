package user.message

import document.annotation.AnnotationResult
import project.userroles.UserIdentifier

/**
 * A message is a text between two users, optionally relating to an [AnnotationResult]
 */
data class Message(
    val recipient: UserIdentifier,
    val sender: UserIdentifier,
    val message: String,
    val annotatedDocument: AnnotationResult?,
    val timestamp: Long = System.currentTimeMillis(),
    var read: Boolean = false,
    val _id: String? = null
)
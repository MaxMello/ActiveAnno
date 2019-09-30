package user.message

import config.userroles.UserIdentifier
import document.annotation.AnnotationResult

/**
 * A message is a text between two users, relating to an [AnnotationResult]
 */
data class Message(
    val recipient: UserIdentifier,
    val sender: UserIdentifier,
    val message: String,
    val annotatedDocument: AnnotationResult?,
    val timestamp: Long = System.currentTimeMillis(),
    var read: Boolean = false,
    val _id: String? = null)
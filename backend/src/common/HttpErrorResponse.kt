package common

import com.fasterxml.jackson.annotation.JsonInclude

/** Data class to return on an http error, which can have a more detailed [errorCode] explaining the reason for the status code
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
data class HttpErrorResponse(
    val message: String,
    val errorCode: ErrorCode? = null
)

/**
 * Enum representing detailed errors which are more granular than just the http status code
 */
enum class ErrorCode {
    UNAUTHORIZED_JWT_INVALID,
    UNAUTHORIZED_JWT_EXPIRED
}
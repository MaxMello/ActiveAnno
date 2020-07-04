package common

/**
 * Custom exception indicating the user is not authenticated properly (missing / invalid auth token),
 * will be used to return appropriate http error code
 */
class UnauthorizedException(message: String = "", errorCode: ErrorCode? = null) : HttpErrorException(message, errorCode)


/**
 * Custom exception indicating the user is not authorized properly (missing role), will be used to return appropriate http error code
 */
class ForbiddenException(message: String = "", errorCode: ErrorCode? = null) : HttpErrorException(message, errorCode)

/**
 * Exception indicating that a resource is gone, will be used through StatusPages feature to return the proper status code when this exception is
 * thrown
 */
class GoneException(message: String = "", errorCode: ErrorCode? = null) : HttpErrorException(message, errorCode)

/**
 * Base exception for HTTP errors, can optionally include a detailed http error
 */
open class HttpErrorException(message: String = "", val errorCode: ErrorCode? = null) : RuntimeException(message)

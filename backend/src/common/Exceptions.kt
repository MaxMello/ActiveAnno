package common

/**
 * Custom exception indicating the user is not authenticated properly (missing / invalid auth token), will be used to return appropriate http error code
 */
class AuthenticationException : RuntimeException {
    constructor(message: String) : super(message)
    constructor() : super()
}

/**
 * Custom exception indicating the user is not authorized properly (missing role), will be used to return appropriate http error code
 */
class AuthorizationException : RuntimeException {
    constructor(message: String) : super(message)
    constructor() : super()
}
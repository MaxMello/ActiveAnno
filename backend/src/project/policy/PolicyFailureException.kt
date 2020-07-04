package project.policy

class PolicyFailureException(message: String, cause: Throwable? = null): RuntimeException(message, cause)
package config.userroles

typealias UserIdentifier = String

data class UserRoles(
    /**
     * The creator of a configuration should be the manager by default, but it is possible to add
     * additional managers or remove the initial manager
     * Minimum required length = 1
     */
    val managers: List<UserIdentifier>,
    /**
     * Users that are allowed to the curation view
     */
    val curators: List<UserIdentifier>,
    /**
     * Users that are allowed to the annotation view
     */
    val annotators: List<UserIdentifier>
)

[activeannoservice](../../index.md) / [application](../index.md) / [JwtConfiguration](./index.md)

# JwtConfiguration

`data class JwtConfiguration`

Data class representing the JTW configuration

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Data class representing the JTW configuration`JwtConfiguration(useRoleProtection: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = true, rolesKey: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "roles", roleAdmin: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "activeanno_admin", roleManager: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "activeanno_manager", roleUser: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "activeanno_user", roleProducer: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "activeanno_producer", roleConsumer: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "activeanno_consumer", roleGlobalSearch: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "activeanno_global_search", userIdentifierKey: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "sub", userNameKey: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = "name", validation: `[`JwtValidation`](../-jwt-validation/index.md)`)` |

### Properties

| Name | Summary |
|---|---|
| [roleAdmin](role-admin.md) | `val roleAdmin: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [roleConsumer](role-consumer.md) | `val roleConsumer: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [roleGlobalSearch](role-global-search.md) | `val roleGlobalSearch: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [roleManager](role-manager.md) | `val roleManager: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [roleProducer](role-producer.md) | `val roleProducer: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [rolesKey](roles-key.md) | `val rolesKey: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [roleUser](role-user.md) | `val roleUser: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [userIdentifierKey](user-identifier-key.md) | `val userIdentifierKey: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [userNameKey](user-name-key.md) | `val userNameKey: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [useRoleProtection](use-role-protection.md) | `val useRoleProtection: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [validation](validation.md) | `val validation: `[`JwtValidation`](../-jwt-validation/index.md) |

[activeannoservice](../../index.md) / [common](../index.md) / [io.ktor.util.pipeline.PipelineContext](index.md) / [protectedByRole](./protected-by-role.md)

# protectedByRole

`suspend fun PipelineContext<`[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)`, ApplicationCall>.protectedByRole(requiredRoles: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>, onlyOneMustMatch: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, block: suspend () -> `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)`): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)

Higher order function that will check for authorization by checking the JWT roles against a list of required roles. If
only one role must match, use the [onlyOneMustMatch](protected-by-role.md#common$protectedByRole(io.ktor.util.pipeline.PipelineContext((kotlin.Unit, io.ktor.application.ApplicationCall)), kotlin.collections.List((kotlin.String)), kotlin.Boolean, kotlin.coroutines.SuspendFunction0((kotlin.Unit)))/onlyOneMustMatch) parameter to true


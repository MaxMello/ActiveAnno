[activeannoservice](../../index.md) / [common](../index.md) / [io.ktor.util.pipeline.PipelineContext](index.md) / [validateRole](./validate-role.md)

# validateRole

`fun PipelineContext<`[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)`, ApplicationCall>.validateRole(requiredRoles: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>, onlyOneMustMatch: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)

Extension function on a [PipelineContext](#) to validate a role and return true if the user is authorized, false otherwise


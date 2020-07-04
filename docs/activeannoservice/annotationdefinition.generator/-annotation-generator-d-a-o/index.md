[activeannoservice](../../index.md) / [annotationdefinition.generator](../index.md) / [AnnotationGeneratorDAO](./index.md)

# AnnotationGeneratorDAO

`class AnnotationGeneratorDAO`

DAO for [AnnotationGenerator](../-annotation-generator/index.md)s

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | DAO for [AnnotationGenerator](../-annotation-generator/index.md)s`AnnotationGeneratorDAO(database: CoroutineDatabase)` |

### Functions

| Name | Summary |
|---|---|
| [byId](by-id.md) | `suspend fun byId(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`): `[`AnnotationGenerator`](../-annotation-generator/index.md) |
| [byIdOrNull](by-id-or-null.md) | `suspend fun byIdOrNull(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`): `[`AnnotationGenerator`](../-annotation-generator/index.md)`?` |
| [getAll](get-all.md) | `suspend fun getAll(): `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`AnnotationGenerator`](../-annotation-generator/index.md)`>` |
| [save](save.md) | `suspend fun save(annotationGenerator: `[`AnnotationGenerator`](../-annotation-generator/index.md)`): UpdateResult?` |

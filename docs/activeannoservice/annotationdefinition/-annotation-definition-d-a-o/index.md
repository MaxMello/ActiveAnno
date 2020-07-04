[activeannoservice](../../index.md) / [annotationdefinition](../index.md) / [AnnotationDefinitionDAO](./index.md)

# AnnotationDefinitionDAO

`class AnnotationDefinitionDAO`

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `AnnotationDefinitionDAO(database: CoroutineDatabase)` |

### Functions

| Name | Summary |
|---|---|
| [byId](by-id.md) | `suspend fun byId(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`): `[`AnnotationDefinition`](../-annotation-definition/index.md) |
| [byIdOrNull](by-id-or-null.md) | `suspend fun byIdOrNull(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`): `[`AnnotationDefinition`](../-annotation-definition/index.md)`?`<br>`suspend fun byIdOrNull(id: Id<`[`AnnotationDefinition`](../-annotation-definition/index.md)`>): `[`AnnotationDefinition`](../-annotation-definition/index.md)`?` |
| [getAll](get-all.md) | `suspend fun getAll(): `[`AnnotationDefinitionList`](../-annotation-definition-list/index.md) |
| [save](save.md) | `suspend fun save(annotationDefinition: `[`AnnotationDefinition`](../-annotation-definition/index.md)`): UpdateResult?` |

[activeannoservice](../../../index.md) / [annotationdefinition](../../index.md) / [TagSetAnnotationDefinition](../index.md) / [TagSetOption](./index.md)

# TagSetOption

`data class TagSetOption`

Option for a tag set.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | Option for a tag set.`TagSetOption(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?)` |

### Properties

| Name | Summary |
|---|---|
| [id](id.md) | Unique ID for the tag set option, needs to be unique for the annotation. If you want comparability across annotations, you might want to re-use them if it makes sense.`val id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [name](name.md) | Short, clear name describing the option. Will be displayed in a button or dropdown.`val name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [shortName](short-name.md) | Shorter version of name, optional. If present, will be used for UI elements with limited space, i.e. for inline span labels`val shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |

[activeannoservice](../../index.md) / [config.annotations](../index.md) / [TagSetOption](./index.md)

# TagSetOption

`data class TagSetOption`

Option for a tag set.

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | `TagSetOption(id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?)`<br>Option for a tag set. |

### Properties

| Name | Summary |
|---|---|
| [id](id.md) | `val id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)<br>Unique ID for the tag set option, needs to be unique for the annotation. If you want comparability across annotations, you might want to re-use them if it makes sense. |
| [name](name.md) | `val name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)<br>Short, clear name describing the option. Will be displayed in a button or dropdown. |
| [shortName](short-name.md) | `val shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?`<br>Shorter version of name, optional. If present, will be used for UI elements with limited space, i.e. for inline span labels |

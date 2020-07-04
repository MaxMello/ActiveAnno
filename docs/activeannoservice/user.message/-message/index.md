[activeannoservice](../../index.md) / [user.message](../index.md) / [Message](./index.md)

# Message

`data class Message`

A message is a text between two users, optionally relating to an [AnnotationResult](../../document.annotation/-annotation-result/index.md)

### Constructors

| Name | Summary |
|---|---|
| [&lt;init&gt;](-init-.md) | A message is a text between two users, optionally relating to an [AnnotationResult](../../document.annotation/-annotation-result/index.md)`Message(recipient: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, sender: `[`UserIdentifier`](../../project.userroles/-user-identifier.md)`, message: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, annotatedDocument: `[`AnnotationResult`](../../document.annotation/-annotation-result/index.md)`?, timestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)` = System.currentTimeMillis(), read: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html)` = false, _id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`? = null)` |

### Properties

| Name | Summary |
|---|---|
| [_id](_id.md) | `val _id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?` |
| [annotatedDocument](annotated-document.md) | `val annotatedDocument: `[`AnnotationResult`](../../document.annotation/-annotation-result/index.md)`?` |
| [message](message.md) | `val message: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [read](read.md) | `var read: `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
| [recipient](recipient.md) | `val recipient: `[`UserIdentifier`](../../project.userroles/-user-identifier.md) |
| [sender](sender.md) | `val sender: `[`UserIdentifier`](../../project.userroles/-user-identifier.md) |
| [timestamp](timestamp.md) | `val timestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html) |

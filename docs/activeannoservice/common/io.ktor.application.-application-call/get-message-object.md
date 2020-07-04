[activeannoservice](../../index.md) / [common](../index.md) / [io.ktor.application.ApplicationCall](index.md) / [getMessageObject](./get-message-object.md)

# getMessageObject

`fun ApplicationCall.getMessageObject(key: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, locale: `[`Locale`](https://docs.oracle.com/javase/6/docs/api/java/util/Locale.html)`? = null): `[`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/index.html)

Given a message [key](get-message-object.md#common$getMessageObject(io.ktor.application.ApplicationCall, kotlin.String, java.util.Locale)/key) and optionally a [locale](get-message-object.md#common$getMessageObject(io.ktor.application.ApplicationCall, kotlin.String, java.util.Locale)/locale), return a message object. If the locale is missing, use the application call to try to get the
preferred locale


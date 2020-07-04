[activeannoservice](../../index.md) / [common](../index.md) / [io.ktor.application.ApplicationCall](index.md) / [getMessageString](./get-message-string.md)

# getMessageString

`fun ApplicationCall.getMessageString(key: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, locale: `[`Locale`](https://docs.oracle.com/javase/6/docs/api/java/util/Locale.html)`? = null): `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)

Given a message [key](get-message-string.md#common$getMessageString(io.ktor.application.ApplicationCall, kotlin.String, java.util.Locale)/key) and optionally a [locale](get-message-string.md#common$getMessageString(io.ktor.application.ApplicationCall, kotlin.String, java.util.Locale)/locale), return the message string. If the locale is missing, use the application call to try to get the
preferred locale


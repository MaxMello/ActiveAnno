[activeannoservice](../../index.md) / [common](../index.md) / [io.ktor.application.ApplicationCall](index.md) / [getMessageStringArray](./get-message-string-array.md)

# getMessageStringArray

`fun ApplicationCall.getMessageStringArray(key: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, locale: `[`Locale`](https://docs.oracle.com/javase/6/docs/api/java/util/Locale.html)`? = null): `[`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/index.html)`<`[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`>`

Given a message [key](get-message-string-array.md#common$getMessageStringArray(io.ktor.application.ApplicationCall, kotlin.String, java.util.Locale)/key) and optionally a [locale](get-message-string-array.md#common$getMessageStringArray(io.ktor.application.ApplicationCall, kotlin.String, java.util.Locale)/locale), return the message string array. If the locale is missing, use the application call to try to get
the preferred locale


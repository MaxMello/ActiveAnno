package common

import io.ktor.application.ApplicationCall
import io.ktor.http.HttpHeaders
import io.ktor.http.parseAndSortHeader
import io.ktor.request.header
import org.slf4j.LoggerFactory
import java.util.*

private val logger = LoggerFactory.getLogger("Localization")

/**
 * List of supported locales for ActiveAnno.
 */
private val supportedLocales = listOf(
    Locale.GERMAN,
    Locale.ENGLISH
)

/**
 * Get Locales from AcceptLanguage header
 */
fun ApplicationCall.acceptedLocalesOrDefault(): List<Locale> {
    val acceptLanguageHeader = request.header(HttpHeaders.AcceptLanguage)
    return acceptLanguageHeader?.let { parseAndSortHeader(it) }?.map { Locale.forLanguageTag(it.value) } ?: listOf(Locale.ENGLISH)
}

/**
 * Get the first matching supporting locale or the default locale from an application call
 */
fun ApplicationCall.preferredSupportedLocaleOrDefault(): Locale {
    return acceptedLocalesOrDefault().let { locales ->
        locales.firstOrNull { it in supportedLocales }  // Exact locale
            ?: locales.firstOrNull { it.language in supportedLocales.map { it.language } }  // At least language
            ?: Locale.ENGLISH  // default
    }
}

/**
 * Given a message [key] and optionally a [locale], return the message string. If the locale is missing, use the default locale (english)
 */
fun getMessageString(key: String, locale: Locale? = null): String {
    return try {
        ResourceBundle.getBundle("messages", locale ?: Locale.ENGLISH).getString(key)
    } catch (e: Exception) {
        logger.error("Missing localization String for key $key", e)
        key
    }
}

/**
 *  Given a message [key] and optionally a [locale], return the message string. If the locale is missing, use the application call to try to get the
 *  preferred locale
 */
fun ApplicationCall.getMessageString(key: String, locale: Locale? = null): String {
    return try {
        ResourceBundle.getBundle("messages", locale ?: preferredSupportedLocaleOrDefault()).getString(key)
    } catch (e: Exception) {
        logger.error("Missing localization String for key $key", e)
        key
    }
}

/**
 *  Given a message [key] and optionally a [locale], return a message object. If the locale is missing, use the application call to try to get the
 *  preferred locale
 */
fun ApplicationCall.getMessageObject(key: String, locale: Locale? = null): Any {
    return try {
        ResourceBundle.getBundle("messages", locale ?: preferredSupportedLocaleOrDefault()).getObject(key)
    } catch (e: Exception) {
        logger.error("Missing localization Object for key $key", e)
        key
    }
}

/**
 *  Given a message [key] and optionally a [locale], return the message string array. If the locale is missing, use the application call to try to get
 *  the preferred locale
 */
fun ApplicationCall.getMessageStringArray(key: String, locale: Locale? = null): Array<String> {
    return try {
        ResourceBundle.getBundle("messages", locale ?: preferredSupportedLocaleOrDefault()).getStringArray(key)
    } catch (e: Exception) {
        logger.error("Missing localization StringArray for key $key", e)
        arrayOf(key)
    }
}
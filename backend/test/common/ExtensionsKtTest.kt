package common

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test

internal class ExtensionsKtTest {

    @Test
    fun `test convert any to double`() {
        assertNull("Hallo".toDoubleOrNull())
        assertEquals(null, "0.001".toDoubleOrNull())
        assertEquals(0.0, 0.toDoubleOrNull())
        assertEquals(1234567890.0, 1234567890L.toDoubleOrNull())
    }

    data class TestClass(val nullableField: Long?)

    @Test
    fun `MaxBy vs MaxByOrNullIfNull`() {
        val list = listOf(TestClass(1), TestClass(null), TestClass(1000), TestClass(null))
        var maxValue = list.maxBy { it.nullableField ?: Long.MIN_VALUE }
        assertEquals(1000L, maxValue?.nullableField)
        maxValue = list.maxByOrNullIfNull { it.nullableField }
        assertEquals(1000L, maxValue?.nullableField)

        val list2 = listOf(TestClass(null), TestClass(null), TestClass(null))
        var maxValue2 = list2.maxBy { it.nullableField ?: Long.MIN_VALUE }.takeIf { it?.nullableField != null }
        assertEquals(null, maxValue2)
        maxValue2 = list2.maxByOrNullIfNull { it.nullableField }
        assertEquals(null, maxValue2)
    }
}
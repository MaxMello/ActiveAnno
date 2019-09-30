package common

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class ExtensionsTest {

    @Test
    fun `MutableList map in place`() {
        assertEquals(
            listOf("A", "B", "C"),
            mutableListOf("a", "b", "c").mapInPlace { it.toUpperCase() }
        )
    }
}
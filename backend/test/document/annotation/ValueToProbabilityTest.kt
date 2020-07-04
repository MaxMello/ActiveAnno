package document.annotation

import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test

internal class ValueToProbabilityTest {

    @Test
    fun `test string value is working`() {
        ValueToProbability("Hello")
    }

    @Test
    fun `test number value is working`() {
        ValueToProbability(-1)
        ValueToProbability(1002342352353453434L)
        ValueToProbability(1234.433454323f)
        ValueToProbability(23456.12345432345)
    }

    @Test
    fun `test boolean value is working`() {
        ValueToProbability(true)
        ValueToProbability(false)
    }

    @Test
    fun `test list value is failing`() {
        assertThrows(IllegalArgumentException::class.java) {
            ValueToProbability(listOf("hi", "hello"))
        }
    }

    @Test
    fun `test char value is failing`() {
        assertThrows(IllegalArgumentException::class.java) {
            ValueToProbability('c')
        }
    }

    @Test
    fun `test Any value is failing`() {
        assertThrows(IllegalArgumentException::class.java) {
            ValueToProbability(Any())
        }
    }
}
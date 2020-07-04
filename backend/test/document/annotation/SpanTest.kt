package document.annotation

import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test

internal class SpanTest {

    @Test
    fun `create valid span without text works`() {
        Span(0, 10, null)
    }

    @Test
    fun `create valid span with text works`() {
        Span(0, 8, "Hey guys")
    }

    @Test
    fun `create invalid span because end less than begin fails`() {
        assertThrows(IllegalArgumentException::class.java) {
            Span(5, 4)
        }
    }

    @Test
    fun `create valid 0 width span works`() {
        Span(4, 4)
    }


    @Test
    fun `create invalid span because of span text mismatch fails`() {
        assertThrows(IllegalArgumentException::class.java) {
            Span(0, 9, "Hey guys")
        }
        assertThrows(IllegalArgumentException::class.java) {
            Span(1, 10, "Hey guys")
        }
        assertThrows(IllegalArgumentException::class.java) {
            Span(0, 7, "Hey guys")
        }
    }
}
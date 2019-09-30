package config

import application.jsonMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import config.filter.*
import org.junit.jupiter.api.Test

internal class FilterConditionTest {


    @Test
    fun `test the stuff`() {
        jsonMapper = jacksonObjectMapper()
        val filter = And(
            Or(
                Regex("sessionDuration", "[0-9]{5}"),
                KeyExists("regionId", true),
                GreaterThanEquals("addressId", 2231)
            ),
            LessThan("locationId", 3),
            Equals("customerId", 23L),
            NotEquals("timezone", -120), NotIn("deviceId", listOf(1, 2, 300))
        )
        val listFilter = And(
            Equals("a", "b"),
            Equals("c", "d"),
            ContainsAll("x", listOf(1, 2, "Kappa"))
        )
        println(jacksonObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(filter.buildQuery()))
        println(filter.buildQuery().toString().replace("document.", ""))

        println(jacksonObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(listFilter.buildQuery()))
        println(listFilter.buildQuery().toString().replace("document.", ""))
    }


}
[activeannoservice](../index.md) / [project](index.md) / [getFilterConditions](./get-filter-conditions.md)

# getFilterConditions

`fun `[`Project`](-project/index.md)`.getFilterConditions(): `[`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/index.html)`<`[`FilterCondition`](../project.filter/-filter-condition/index.md)`>`

Get the filterCondition to use for a [Project](-project/index.md). If the project is null, it is treated as a restricted project
and the ID will be used to filter for restrictedProject from documents. Else, the method will make sure that no
restricted document for another project will be accidentally included for this project.


[activeannoservice](../index.md) / [config](index.md) / [getFilterConditions](./get-filter-conditions.md)

# getFilterConditions

`fun `[`ProjectConfig`](-project-config/index.md)`.getFilterConditions(): `[`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/index.html)`<`[`FilterCondition`](../config.filter/-filter-condition/index.md)`>`

Get the filterCondition to use for a [ProjectConfig](-project-config/index.md). If the config is null, it is treated as a restricted config
and the ID will be used to filter for restrictedConfig from documents. Else, the method will make sure that no
restricted document for another config will be accidentally included for this config.


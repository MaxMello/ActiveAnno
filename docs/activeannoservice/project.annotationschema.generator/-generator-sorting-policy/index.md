[activeannoservice](../../index.md) / [project.annotationschema.generator](../index.md) / [GeneratorSortingPolicy](./index.md)

# GeneratorSortingPolicy

`enum class GeneratorSortingPolicy`

How to handle sorting of documents for annotators when generated results is available

### Enum Values

| Name | Summary |
|---|---|
| [NORMAL_SORT](-n-o-r-m-a-l_-s-o-r-t.md) | Use the normal sort ordering defined in Sort |
| [DOCUMENTS_WITH_GENERATED_DATA_FIRST](-d-o-c-u-m-e-n-t-s_-w-i-t-h_-g-e-n-e-r-a-t-e-d_-d-a-t-a_-f-i-r-s-t.md) | Use the normal sort ordering, but prefer documents with generated data available first |
| [ACTIVE_LEARNING_SORT](-a-c-t-i-v-e_-l-e-a-r-n-i-n-g_-s-o-r-t.md) | If possible, sort documents by maximum information gain for updatable annotation generator if they exist. If not, documents with generated data will still be preferred, sorted by normal sort. |

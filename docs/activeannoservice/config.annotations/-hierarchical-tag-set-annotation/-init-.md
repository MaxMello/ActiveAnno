[activeannoservice](../../index.md) / [config.annotations](../index.md) / [HierarchicalTagSetAnnotation](index.md) / [&lt;init&gt;](./-init-.md)

# &lt;init&gt;

`HierarchicalTagSetAnnotation(id: `[`AnnotationID`](../-annotation-i-d.md)`, name: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`, shortName: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)`?, targets: `[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)`<`[`Target`](../-target.md)`>, minNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 1, maxNumberOfTags: `[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/index.html)` = 1, options: `[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)`<`[`HierarchicalTagSetOption`](../-hierarchical-tag-set-option/index.md)`>)`

A set of predefined options nested in a hierarchical fashion, for example
    name = Location
    options = Germany(children = Berlin, Hamburg, Lower Saxony(children = Hannover, Oldenburg, Wolfsburg)))

Similar to PredefinedTagSetAnnotation, except the support for hierarchical tags


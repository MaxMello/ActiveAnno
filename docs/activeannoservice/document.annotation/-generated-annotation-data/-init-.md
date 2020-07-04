[activeannoservice](../../index.md) / [document.annotation](../index.md) / [GeneratedAnnotationData](index.md) / [&lt;init&gt;](./-init-.md)

# &lt;init&gt;

`GeneratedAnnotationData(timestamp: `[`Long`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long/index.html)`, annotations: `[`AnnotationMap`](../-annotation-map.md)`, id: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html)` = UUID.randomUUID().toString())`

When a Project has any AnnotationGenerator defined through the AnnotationSchema, they will store their results here.
Every time annotation generation is triggered, every generator will be executed again and a new instance of this class
will be added to the ProjectAnnotationData


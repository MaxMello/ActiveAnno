[activeannoservice](../../index.md) / [project.annotationschema](../index.md) / [EnableCondition](index.md) / [&lt;init&gt;](./-init-.md)

# &lt;init&gt;

`EnableCondition()`

[AnnotationSchemaElement](../-annotation-schema-element/index.md)s can be conditional, defined by an [EnableCondition](index.md).
If an [EnableCondition](index.md) is null, that means it is always required. Else, the enable conditions [execute](execute.md) method needs to return true
for the element to be prompted.


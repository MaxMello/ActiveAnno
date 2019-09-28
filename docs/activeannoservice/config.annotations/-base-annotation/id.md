[activeannoservice](../../index.md) / [config.annotations](../index.md) / [BaseAnnotation](index.md) / [id](./id.md)

# id

`val id: `[`AnnotationID`](../-annotation-i-d.md)

Every annotation needs a unique ID (inside the project scope). It is advisable to re-use the same ids for the same
annotations across projects to have easier integration when merging the data outside the service. For example,
a sentiment score annotation might always have the id "SENTIMENT_SCORE" across all projects.


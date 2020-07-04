[activeannoservice](../index.md) / [document](index.md) / [getNewestFinalizedAnnotationResult](./get-newest-finalized-annotation-result.md)

# getNewestFinalizedAnnotationResult

`fun `[`ProjectAnnotationData`](-project-annotation-data/index.md)`.getNewestFinalizedAnnotationResult(): `[`FinalizedAnnotationResult`](../document.annotation/-finalized-annotation-result/index.md)`?`

Get the newest finalized annotation, being treated as the actual final annotation. FinalizedAnnotations can be
changed after the fact, so the newest one is always the new truth.


[activeannoservice](../../index.md) / [project.annotationschema.generator](../index.md) / [GeneratorTiming](./index.md)

# GeneratorTiming

`sealed class GeneratorTiming`

### Types

| Name | Summary |
|---|---|
| [Always](-always/index.md) | Generate missing annotations in every possibility (fresh + fast if already fresh, but more often)`object Always : `[`GeneratorTiming`](./index.md) |
| [Never](-never/index.md) | Never generate any annotations for this project`object Never : `[`GeneratorTiming`](./index.md) |
| [OnGenerateMissingAnnotationsRequest](-on-generate-missing-annotations-request/index.md) | Generate missing annotations only on specific endpoint (fast at use time, might have older or missing generated annotation data)`object OnGenerateMissingAnnotationsRequest : `[`GeneratorTiming`](./index.md) |
| [OnGetDocumentRequest](-on-get-document-request/index.md) | Generate missing annotations only when requesting documents (freshest, possibly very slow)`object OnGetDocumentRequest : `[`GeneratorTiming`](./index.md) |

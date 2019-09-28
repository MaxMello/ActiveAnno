[activeannoservice](../index.md) / [config](index.md) / [toAnnotateConfig](./to-annotate-config.md)

# toAnnotateConfig

`suspend fun `[`ProjectConfig`](-project-config/index.md)`.toAnnotateConfig(): `[`AnnotateConfig`](-annotate-config/index.md)

Convert a [ProjectConfig](-project-config/index.md) to an [AnnotateConfig](-annotate-config/index.md), doing some operations to enrich the config data to be able to use it
for annotation. For example, if an [OpenTagAnnotation](../config.annotations/-open-tag-annotation/index.md) is present, this method might aggregate the existing values
from all documents of the config and add it to the annotation config.


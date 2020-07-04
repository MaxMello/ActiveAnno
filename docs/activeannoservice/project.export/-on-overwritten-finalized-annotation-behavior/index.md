[activeannoservice](../../index.md) / [project.export](../index.md) / [OnOverwrittenFinalizedAnnotationBehavior](./index.md)

# OnOverwrittenFinalizedAnnotationBehavior

`enum class OnOverwrittenFinalizedAnnotationBehavior`

Define behavior what to do when a finalizedAnnotation was defined, but a new one was set afterwards. This would not
happen normally, but cannot be prevented for cases where an annotation is found via search to correct an earlier
mistake. For this case, we need to define if we want to trigger web hooks again or not.

### Enum Values

| Name | Summary |
|---|---|
| [DO_NOTHING](-d-o_-n-o-t-h-i-n-g.md) |  |
| [TRIGGER_EXPORT_AGAIN](-t-r-i-g-g-e-r_-e-x-p-o-r-t_-a-g-a-i-n.md) |  |

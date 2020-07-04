[activeannoservice](../../index.md) / [project.layout](../index.md) / [LayoutAreaType](./index.md)

# LayoutAreaType

`enum class LayoutAreaType`

There are 4 different UI areas which are defined by this enum. All four areas can contain read-only/display elements,
but not all are allowed to have all types of interaction elements.

### Enum Values

| Name | Summary |
|---|---|
| [Common](-common.md) | The common area only contains non-interactive elements. Normally, this would be the document text as well as important metadata. |
| [SharedTarget](-shared-target.md) | Annotations that are shared between document and span target are shows above other annotations, so that the switching between the two targets is easier. Only annotations with target document and span are allowed to be here |
| [DocumentTarget](-document-target.md) | Annotation interactions that are only target to the whole document are in this area. |
| [SpanTarget](-span-target.md) | Annotation interactions that are only target to individual spans of the document are in this area. |

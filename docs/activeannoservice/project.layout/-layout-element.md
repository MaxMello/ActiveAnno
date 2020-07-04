[activeannoservice](../index.md) / [project.layout](index.md) / [LayoutElement](./-layout-element.md)

# LayoutElement

`interface LayoutElement`

Interface for all UI elements, uses json polymorphic deserialization to map into actual UI elements.

### Inheritors

| Name | Summary |
|---|---|
| [ActionElement](../project.layout.elements.action/-action-element/index.md) | Intermediary interface which marks subtypes as elements altering the state of the application by setting some annotation value`abstract class ActionElement : `[`LayoutElement`](./-layout-element.md) |
| [DenormalizedActionElement](../project.layout.elements.action/-denormalized-action-element/index.md) | `abstract class DenormalizedActionElement : `[`LayoutElement`](./-layout-element.md) |
| [DisplayElement](../project.layout.elements.display/-display-element.md) | Intermediate interface specify that an Element is non-interactive, allows for restrictions of classes to require Elements to be non-interactive`interface DisplayElement : `[`LayoutElement`](./-layout-element.md) |

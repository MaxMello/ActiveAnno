[activeannoservice](../index.md) / [config](index.md) / [ActionElement](./-action-element.md)

# ActionElement

`interface ActionElement : `[`Element`](-element.md)

Intermediary interface which marks subtypes as elements altering the state of the application by setting some annotation value

### Inheritors

| Name | Summary |
|---|---|
| [ButtonGroup](-button-group/index.md) | `data class ButtonGroup : `[`ActionElement`](./-action-element.md)<br>A ButtonGroup is a collection of buttons which belong together. Based on the referenceAnnotation it can be single select or multi select. |
| [Chips](-chips/index.md) | `data class Chips : `[`ActionElement`](./-action-element.md)<br>Chips element is a variable list of text inputs (tags) which can be extended, including an auto-complete feature with predefined answers. |
| [Dropdown](-dropdown/index.md) | `data class Dropdown : `[`ActionElement`](./-action-element.md) |
| [NumberField](-number-field/index.md) | `data class NumberField : `[`ActionElement`](./-action-element.md)<br>HTML Number input |
| [Slider](-slider/index.md) | `data class Slider : `[`ActionElement`](./-action-element.md)<br>A number slider with n steps and possible one or two markers to either set a number of a number range. |
| [TextField](-text-field/index.md) | `data class TextField : `[`ActionElement`](./-action-element.md)<br>A multi line text input field |

[activeannoservice](../index.md) / [config.layout](index.md) / [Element](./-element.md)

# Element

`interface Element`

Interface for all UI elements, uses json polymorphic deserialization to map into actual UI elements.

### Inheritors

| Name | Summary |
|---|---|
| [ActionElement](-action-element.md) | `interface ActionElement : `[`Element`](./-element.md)<br>Intermediary interface which marks subtypes as elements altering the state of the application by setting some annotation value |
| [DisplayElement](-display-element.md) | `interface DisplayElement : `[`Element`](./-element.md)<br>Intermediate interface specify that an Element is non-interactive, allows for restrictions of classes to require Elements to be non-interactive |

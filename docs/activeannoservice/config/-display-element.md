[activeannoservice](../index.md) / [config](index.md) / [DisplayElement](./-display-element.md)

# DisplayElement

`interface DisplayElement : `[`Element`](-element.md)

Intermediate interface specify that an Element is non-interactive, allows for restrictions of classes to require Elements to be non-interactive

### Inheritors

| Name | Summary |
|---|---|
| [Base64Image](-base64-image/index.md) | `data class Base64Image : `[`DisplayElement`](./-display-element.md)<br>Element displaying a constant Base64 encoded image |
| [Base64ImageMetaData](-base64-image-meta-data/index.md) | `data class Base64ImageMetaData : `[`DisplayElement`](./-display-element.md)<br>Display a meta data element that is a base64 encoded image |
| [Bold](-bold/index.md) | `class Bold : `[`DisplayElement`](./-display-element.md)<br>Wrapper element, all children's text elements will be bold. Equivalent to an inline html element with fontWeight bold which will be applied to the children. |
| [DateMetaData](-date-meta-data/index.md) | `data class DateMetaData : `[`DisplayElement`](./-display-element.md)<br>Convert some input date format (e.g. timestamp) to date format or do nothing if not a timestamp for a given meta data element |
| [DocumentTextElement](-document-text-element/index.md) | `data class DocumentTextElement : `[`DisplayElement`](./-display-element.md)<br>Element displaying the document text. |
| [Icon](-icon/index.md) | `data class Icon : `[`DisplayElement`](./-display-element.md)<br>Display a material icon |
| [Italic](-italic/index.md) | `class Italic : `[`DisplayElement`](./-display-element.md)<br>Wrapper element, all children's text elements will be italic. Equivalent to an inline html element with italic font style which will be applied to the children. |
| [MonospaceFont](-monospace-font/index.md) | `class MonospaceFont : `[`DisplayElement`](./-display-element.md)<br>Wrapper element, all children's text elements will use a monospace font. Equivalent to an inline html element with a monospace font which will be applied to the children. |
| [Popover](-popover/index.md) | `data class Popover : `[`DisplayElement`](./-display-element.md)<br>A popover element, providing the ability to hide information (no interactions!) befind a popover |
| [Text](-text/index.md) | `data class Text : `[`DisplayElement`](./-display-element.md)<br>Just display some static text |
| [TextMetaData](-text-meta-data/index.md) | `data class TextMetaData : `[`DisplayElement`](./-display-element.md)<br>Display the value of a meta data element based on the ID |
| [UrlImage](-url-image/index.md) | `data class UrlImage : `[`DisplayElement`](./-display-element.md)<br>Element displaying an image provided by an URL |

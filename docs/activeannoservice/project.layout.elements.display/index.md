[activeannoservice](../index.md) / [project.layout.elements.display](./index.md)

## Package project.layout.elements.display

### Types

| Name | Summary |
|---|---|
| [Base64Image](-base64-image/index.md) | Element displaying a constant Base64 encoded image`data class Base64Image : `[`DisplayElement`](-display-element.md) |
| [Base64ImageMetaData](-base64-image-meta-data/index.md) | Display a meta data element that is a base64 encoded image`data class Base64ImageMetaData : `[`DisplayElement`](-display-element.md) |
| [Bold](-bold/index.md) | Wrapper element, all children's text elements will be bold. Equivalent to an inline html element with fontWeight bold which will be applied to the children.`class Bold : `[`DisplayElement`](-display-element.md) |
| [DateMetaData](-date-meta-data/index.md) | Convert some input date format (e.g. timestamp) to date format or do nothing if not a timestamp for a given meta data element`data class DateMetaData : `[`DisplayElement`](-display-element.md) |
| [DisplayElement](-display-element.md) | Intermediate interface specify that an Element is non-interactive, allows for restrictions of classes to require Elements to be non-interactive`interface DisplayElement : `[`LayoutElement`](../project.layout/-layout-element.md) |
| [DocumentTextElement](-document-text-element/index.md) | Element displaying the document text.`data class DocumentTextElement : `[`DisplayElement`](-display-element.md) |
| [Icon](-icon/index.md) | Display a material icon`data class Icon : `[`DisplayElement`](-display-element.md) |
| [Italic](-italic/index.md) | Wrapper element, all children's text elements will be italic. Equivalent to an inline html element with italic font style which will be applied to the children.`class Italic : `[`DisplayElement`](-display-element.md) |
| [MetaDataMapping](-meta-data-mapping/index.md) | For a meta data element, use the value as a key to the [mapping](-meta-data-mapping/mapping.md) map and display a list of [DisplayElement](-display-element.md)s or the fallback if no value is found for the key`data class MetaDataMapping : `[`DisplayElement`](-display-element.md) |
| [MonospaceFont](-monospace-font/index.md) | Wrapper element, all children's text elements will use a monospace font. Equivalent to an inline html element with a monospace font which will be applied to the children.`class MonospaceFont : `[`DisplayElement`](-display-element.md) |
| [Popover](-popover/index.md) | A popover element, providing the ability to hide information (no interactions!) befind a popover`data class Popover : `[`DisplayElement`](-display-element.md) |
| [PopoverContent](-popover-content/index.md) | The PopoverContent are display elements which will be shown when the popover is visible`class PopoverContent` |
| [PopoverTarget](-popover-target/index.md) | The PopoverTarget will be displayed into the parent context directly (for example some text, an icon or a combination)`class PopoverTarget` |
| [PopoverTrigger](-popover-trigger/index.md) | Two ways a popover can be triggered, by click or hover`enum class PopoverTrigger` |
| [Text](-text/index.md) | Just display some static text`data class Text : `[`DisplayElement`](-display-element.md) |
| [TextMetaData](-text-meta-data/index.md) | Display the value of a meta data element based on the ID`data class TextMetaData : `[`DisplayElement`](-display-element.md) |
| [UrlImage](-url-image/index.md) | Element displaying an image provided by an URL`data class UrlImage : `[`DisplayElement`](-display-element.md) |
| [UrlImageMetaData](-url-image-meta-data/index.md) | Display a meta data element that is an URL of an image`data class UrlImageMetaData : `[`DisplayElement`](-display-element.md) |

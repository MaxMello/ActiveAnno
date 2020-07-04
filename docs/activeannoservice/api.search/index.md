[activeannoservice](../index.md) / [api.search](./index.md)

## Package api.search

### Types

| Name | Summary |
|---|---|
| [SearchRequest](-search-request/index.md) | Model representing a search request`data class SearchRequest` |
| [SearchResultDocument](-search-result-document/index.md) | The [SearchResultDocument](-search-result-document/index.md) is a view on a document with all useful data for display in the search result area in the frontend.`data class SearchResultDocument` |

### Extensions for External Classes

| Name | Summary |
|---|---|
| [io.ktor.routing.Route](io.ktor.routing.-route/index.md) |  |

### Functions

| Name | Summary |
|---|---|
| [toSearchResultDocument](to-search-result-document.md) | Convert a [Document](../document/-document/index.md) to a [SearchResultDocument](-search-result-document/index.md)`fun `[`Document`](../document/-document/index.md)`.toSearchResultDocument(project: `[`Project`](../project/-project/index.md)`): `[`SearchResultDocument`](-search-result-document/index.md) |

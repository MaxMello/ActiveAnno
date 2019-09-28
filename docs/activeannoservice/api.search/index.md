[activeannoservice](../index.md) / [api.search](./index.md)

## Package api.search

### Types

| Name | Summary |
|---|---|
| [SearchRequest](-search-request/index.md) | `data class SearchRequest`<br>Model representing a search request |
| [SearchResultDocument](-search-result-document/index.md) | `data class SearchResultDocument`<br>The [SearchResultDocument](-search-result-document/index.md) is a view on a document with all useful data for display in the search result area in the frontend. |

### Extensions for External Classes

| Name | Summary |
|---|---|
| [io.ktor.routing.Route](io.ktor.routing.-route/index.md) |  |

### Functions

| Name | Summary |
|---|---|
| [toSearchResultDocument](to-search-result-document.md) | `fun `[`Document`](../document/-document/index.md)`.toSearchResultDocument(config: `[`ProjectConfig`](../config/-project-config/index.md)`): `[`SearchResultDocument`](-search-result-document/index.md)<br>Convert a [Document](../document/-document/index.md) to a [SearchResultDocument](-search-result-document/index.md) |

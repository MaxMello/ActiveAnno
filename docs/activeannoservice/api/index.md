[activeannoservice](../index.md) / [api](./index.md)

## Package api

### Types

| Name | Summary |
|---|---|
| [AnnotationDocument](-annotation-document/index.md) | `data class AnnotationDocument`<br>Model for annotating a document for the frontend |
| [AnnotationStored](-annotation-stored/index.md) | `data class AnnotationStored`<br>Return model for storing endpoints, letting the frontend know the data was stored successfully. |
| [Page](-page/index.md) | `data class Page`<br>A [Page](-page/index.md) represents a UI page of the frontend, optionally with a [badgeCount](-page/badge-count.md) to indicate how many interactions are waiting for the user |
| [PageSetup](-page-setup/index.md) | `data class PageSetup`<br>Model for frontend communication representing the PageSetup, controlling the layout and core data for the page setup of the frontend |
| [PostAnnotationResult](-post-annotation-result/index.md) | `data class PostAnnotationResult`<br>Data class for annotation and curation endpoints for receiving annotation results. Will be mapped into other data structures for storing. |
| [PostAnnotationResults](-post-annotation-results/index.md) | `data class PostAnnotationResults`<br>Wrapper data class for reciving annotations |
| [SearchRequest](-search-request/index.md) | `data class SearchRequest`<br>Model representing a search request |
| [SearchResultDocument](-search-result-document/index.md) | `data class SearchResultDocument`<br>The [SearchResultDocument](-search-result-document/index.md) is a view on a document with all useful data for display in the search result area in the frontend. |

### Extensions for External Classes

| Name | Summary |
|---|---|
| [io.ktor.routing.Route](io.ktor.routing.-route/index.md) |  |

### Properties

| Name | Summary |
|---|---|
| [PAGE_ADMIN](-p-a-g-e_-a-d-m-i-n.md) | `const val PAGE_ADMIN: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [PAGE_ANNOTATE](-p-a-g-e_-a-n-n-o-t-a-t-e.md) | `const val PAGE_ANNOTATE: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [PAGE_CURATE](-p-a-g-e_-c-u-r-a-t-e.md) | `const val PAGE_CURATE: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [PAGE_MANAGE](-p-a-g-e_-m-a-n-a-g-e.md) | `const val PAGE_MANAGE: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [PAGE_MESSAGES](-p-a-g-e_-m-e-s-s-a-g-e-s.md) | `const val PAGE_MESSAGES: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |
| [PAGE_SEARCH](-p-a-g-e_-s-e-a-r-c-h.md) | `const val PAGE_SEARCH: `[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/index.html) |

### Functions

| Name | Summary |
|---|---|
| [toSearchResultDocument](to-search-result-document.md) | `fun `[`Document`](../document/-document/index.md)`.toSearchResultDocument(config: `[`ProjectConfig`](../config/-project-config/index.md)`): `[`SearchResultDocument`](-search-result-document/index.md)<br>Convert a [Document](../document/-document/index.md) to a [SearchResultDocument](-search-result-document/index.md) |

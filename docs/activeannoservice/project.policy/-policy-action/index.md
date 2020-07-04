[activeannoservice](../../index.md) / [project.policy](../index.md) / [PolicyAction](./index.md)

# PolicyAction

`sealed class PolicyAction`

Sealed class for the different actions that can be required to be taken for a document to get the annotation done
properly

### Types

| Name | Summary |
|---|---|
| [DoNothing](-do-nothing.md) | `object DoNothing : `[`PolicyAction`](./index.md) |
| [SaveUpdatedModel](-save-updated-model.md) | `object SaveUpdatedModel : `[`PolicyAction`](./index.md) |
| [ShowToAdmin](-show-to-admin/index.md) | `data class ShowToAdmin : `[`PolicyAction`](./index.md) |
| [ShowToAnnotator](-show-to-annotator/index.md) | `data class ShowToAnnotator : `[`PolicyAction`](./index.md) |
| [ShowToCurator](-show-to-curator/index.md) | `data class ShowToCurator : `[`PolicyAction`](./index.md) |

package project.inputmapping

import project.sort.Order


/**
 * Use this to define a non-text index with an order as well as an optional unique constraint
 */
data class CreateIndex(val order: Order)

data class DocumentText(
    /**
     * Key of the input document where the document text is found
     * Syntax separated with dots for inner objects ("document.comment.text")
     */
    val key: String
)

data class MetaData(
    /**
     * ID to reference this metadata in the layout etc.
     */
    val id: String,
    /**
     * key inside the originalDocument
     * Syntax separated with dots for inner objects ("document.metadata.key")
     */
    val key: String,
    val index: CreateIndex? = null
)

/**
 * Mapping of originalDocument to documentData used in UI. Will be mapped based on this classes values.
 * Additionally, provides the ability to define indices for faster queries in DB
 */
data class InputMapping(
    val documentText: DocumentText,
    val metaData: List<MetaData>
)
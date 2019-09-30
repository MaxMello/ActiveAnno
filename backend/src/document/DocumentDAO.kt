package document

import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.databind.node.ObjectNode
import com.mongodb.client.result.DeleteResult
import com.mongodb.client.result.UpdateResult
import common.getOrCreateCollection
import config.*
import config.filter.*
import config.userroles.UserIdentifier
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.coroutine.CoroutineCollection
import org.litote.kmongo.coroutine.CoroutineDatabase

/*
 * List of keys of the document model / json representation to use in queries.
 * Note that this approach is not as failsafe as using the inbuilt KMongo query operators, as the string values are not
 * checked against the property names of the data class. But this approach allows us to translate dynamic json based filter conditions
 * into mongo queries and combine them with predefined queries.
 */
private const val COLLECTION_DOCUMENT = "document"
private const val KEY_DOCUMENT_ID = "_id"
const val KEY_RESTRICTED_CONFIG = "restrictedConfig"
private const val KEY_CONFIG_ANNOTATION_DATA = "configAnnotationData"
private const val KEY_ANNOTATIONS = "annotations"
private const val KEY_FINALIZED_ANNOTATIONS = "finalizedAnnotations"
private const val KEY_DOCUMENT_ANNOTATIONS = "documentAnnotations"
private const val KEY_SPAN_ANNOTATIONS = "spanAnnotations"
private const val KEY_CREATOR = "creator"
private const val KEY_USER_IDENTIFIER = "userIdentifier"
private const val KEY_POLICY_ACTION = "policyAction"
private const val KEY_POLICY_TYPE = "type"
private const val VALUE_SHOW_ANNOTATOR = "ShowToAnnotator"
private const val VALUE_SHOW_CURATOR = "ShowToCurator"
private const val KEY_TIMESTAMP = "timestamp"
private const val KEY_EXPORT_STATISTICS = "exportStatistics"
private const val KEY_WEB_HOOK_STATISTICS = "webHookStatistics"
private const val KEY_SUCCESS = "success"
private const val KEY_ANNOTATION_ID = "id"
private const val KEY_ANNOTATION_RESULT_IDS = "annotationResultIDs"

/**
 * This DAO provides all methods to interact with the document collection. It hides the collection and controls
 * access to it via the public methods.
 */
class DocumentDAO(database: CoroutineDatabase) {

    /**
     * Mongo Collection to access the document data
     */
    private val documentCollection: CoroutineCollection<Document> = runBlocking {
        database.getOrCreateCollection<Document>(COLLECTION_DOCUMENT)
    }
    /**
     * Given the originalDocument, create a new document entry into the database.
     * Provide [restrictedConfig] optionally (only used in one-off project context)
     */
    suspend fun insert(json: ObjectNode, restrictedConfig: String? = null) {
        documentCollection.insertOne(
            Document(
                storeTimestamp = System.currentTimeMillis(),
                originalDocument = json,
                restrictedConfig = restrictedConfig
            )
        )
    }

    /**
     * Given an json array of originalDocuments, create new document entries into the database.
     * Provide [restrictedConfig] optionally (only used in one-off project context)
     */
    suspend fun insertMany(json: ArrayNode, restrictedConfig: String? = null) {
        documentCollection.insertMany(json.map { obj ->
            if (obj is ObjectNode) {
                Document(
                    storeTimestamp = System.currentTimeMillis(),
                    originalDocument = obj,
                    restrictedConfig = restrictedConfig
                )
            } else {
                throw IllegalArgumentException("Array must contain json objects")
            }
        }.toList())
    }

    suspend fun update(id: String, document: Document): UpdateResult {
        return documentCollection.updateOneById(id, document)
    }

    suspend fun getAll(): List<Document> {
        return documentCollection.find().toList()
    }

    suspend fun byId(id: String): Document? {
        return documentCollection.findOneById(id)
    }

    suspend fun deleteById(id: String): DeleteResult {
        return documentCollection.deleteOneById(id)
    }

    /**
     * Given a [config], find all documents for that config.
     */
    suspend fun findForConfig(config: ProjectConfig): List<Document> {
        return documentCollection.find(And(*config.getFilterConditions()).buildQuery().toString()).toList()
    }

    /**
     * Given a [configurationID], find all documents that are restricted to that config.
     */
    suspend fun findForRestrictedConfig(configurationID: String): List<Document> {
        return documentCollection.find(Equals(KEY_RESTRICTED_CONFIG, configurationID).buildQuery().toString()).toList()
    }

    /**
     * Encapsulates the query for getting new documents to annotate. Will use the configs filterCondition,
     * will optionally exclude some documents, and only return documents that are required for annotation and not already
     * annotated by the user
     */
    suspend fun findForAnnotation(
        config: ProjectConfig,
        userIdentifier: UserIdentifier,
        limit: Int = 10,
        ignoreDocuments: List<String> = listOf()
    ): List<Document> {
        return documentCollection.find(
            And(
                *config.getFilterConditions(),
                *listOfNotNull(
                    if (ignoreDocuments.isNotEmpty()) NotIn(
                        KEY_DOCUMENT_ID,
                        ignoreDocuments
                    ) else null
                ).toTypedArray(),
                NotEquals(
                    concatKeys(
                        KEY_CONFIG_ANNOTATION_DATA,
                        config._id,
                        KEY_ANNOTATIONS,
                        KEY_CREATOR,
                        KEY_USER_IDENTIFIER
                    ), userIdentifier
                ),
                Or(
                    KeyExists(
                        concatKeys(
                            KEY_CONFIG_ANNOTATION_DATA,
                            config._id,
                            KEY_POLICY_ACTION,
                            KEY_POLICY_TYPE
                        ), false
                    ),
                    Equals(
                        concatKeys(
                            KEY_CONFIG_ANNOTATION_DATA,
                            config._id,
                            KEY_POLICY_ACTION,
                            KEY_POLICY_TYPE
                        ), VALUE_SHOW_ANNOTATOR
                    )
                )
            ).buildQuery().toString()
        ).sort(config.sort.buildSort()).limit(limit).toList()
    }

    /**
     * Count number of annotations required by the user given its [userIdentifier] and a list of [configs].
     */
    suspend fun countForAnnotation(configs: List<ProjectConfig>, userIdentifier: UserIdentifier): Long {
        return documentCollection.countDocuments(
            Or(
                *configs.map { c ->
                    And(
                        *c.getFilterConditions(),
                        NotEquals(
                            concatKeys(
                                KEY_CONFIG_ANNOTATION_DATA,
                                c._id,
                                KEY_ANNOTATIONS,
                                KEY_CREATOR,
                                KEY_USER_IDENTIFIER
                            ), userIdentifier
                        ),
                        Or(
                            KeyExists(
                                concatKeys(
                                    KEY_CONFIG_ANNOTATION_DATA,
                                    c._id,
                                    KEY_POLICY_ACTION,
                                    KEY_POLICY_TYPE
                                ), false
                            ),
                            Equals(
                                concatKeys(
                                    KEY_CONFIG_ANNOTATION_DATA,
                                    c._id,
                                    KEY_POLICY_ACTION,
                                    KEY_POLICY_TYPE
                                ), VALUE_SHOW_ANNOTATOR
                            )
                        )
                    )
                }.toTypedArray()
            ).buildQuery().toString()
        )
    }

    /**
     * Encapsulates the query for getting new documents to curate. Will use the configs filterCondition,
     * will optionally exclude some documents, and only return documents that are required for curation.
     * If a curator is also an annotator, and the curator annotated a document, the curator will not be able to curate the document.
     */
    suspend fun findForCuration(
        config: ProjectConfig,
        userIdentifier: UserIdentifier,
        limit: Int = 10,
        ignoreDocuments: List<String> = listOf()
    ): List<Document> {
        return documentCollection.find(
            And(
                *config.getFilterConditions(),
                NotEquals(
                    concatKeys(
                        KEY_CONFIG_ANNOTATION_DATA,
                        config._id,
                        KEY_ANNOTATIONS,
                        KEY_CREATOR,
                        KEY_USER_IDENTIFIER
                    ), userIdentifier
                ),
                *listOfNotNull(
                    if (ignoreDocuments.isNotEmpty()) NotIn(
                        KEY_DOCUMENT_ID,
                        ignoreDocuments
                    ) else null
                ).toTypedArray(),
                Equals(
                    concatKeys(
                        KEY_CONFIG_ANNOTATION_DATA,
                        config._id,
                        KEY_POLICY_ACTION,
                        KEY_POLICY_TYPE
                    ), VALUE_SHOW_CURATOR
                )
            )
                .buildQuery().toString()
        ).sort(config.sort.buildSort()).limit(limit).toList()
    }

    /**
     * Count number of curations required given a list of [configs] and a [userIdentifier].
     */
    suspend fun countForCuration(configs: List<ProjectConfig>, userIdentifier: UserIdentifier): Long {
        return documentCollection.countDocuments(
            Or(
                *configs.map { c ->
                    And(
                        *c.getFilterConditions(),
                        NotEquals(
                            concatKeys(
                                KEY_CONFIG_ANNOTATION_DATA,
                                c._id,
                                KEY_ANNOTATIONS,
                                KEY_CREATOR,
                                KEY_USER_IDENTIFIER
                            ), userIdentifier
                        ),
                        Equals(
                            concatKeys(
                                KEY_CONFIG_ANNOTATION_DATA,
                                c._id,
                                KEY_POLICY_ACTION,
                                KEY_POLICY_TYPE
                            ), VALUE_SHOW_CURATOR
                        )
                    )
                }.toTypedArray()
            ).buildQuery().toString()
        )
    }

    /**
     * Get all documents with failed webhook tries for resend purposes given a [configurationID]
     */
    suspend fun findFailedWebHookDocuments(configurationID: String): List<Document> {
        return documentCollection.find(
            Equals(
                concatKeys(
                    KEY_CONFIG_ANNOTATION_DATA,
                    configurationID,
                    KEY_FINALIZED_ANNOTATIONS,
                    KEY_EXPORT_STATISTICS,
                    KEY_WEB_HOOK_STATISTICS,
                    KEY_SUCCESS
                ),
                false
            ).buildQuery().toString()
        ).toList()
    }

    /**
     * Get all documents for an export for a [configurationID] with options to also include unfinished documents,
     * limit it to a list of [documentIDs] and/or only return documents newer than a [timestamp]. If unfinished documents
     * are included, the annotation timestamp will be used, else the finalizedAnnotation timestamp.
     */
    suspend fun findForExport(configurationID: String, includeUnfinished: Boolean, documentIDs: List<String>, timestamp: Long?): List<Document> {
        return documentCollection.find(
            And(
                *listOfNotNull(
                    if (includeUnfinished) {
                        KeyExists(
                            concatKeys(
                                KEY_CONFIG_ANNOTATION_DATA,
                                configurationID,
                                KEY_ANNOTATIONS,
                                KEY_ANNOTATION_ID
                            ), // Make sure annotations is not empty
                            true
                        )
                    } else {
                        KeyExists(
                            concatKeys(
                                KEY_CONFIG_ANNOTATION_DATA,
                                configurationID,
                                KEY_FINALIZED_ANNOTATIONS,
                                KEY_ANNOTATION_RESULT_IDS
                            ), // Make sure finalizedAnnotations is not empty
                            true
                        )
                    },
                    if (documentIDs.isNotEmpty()) {
                        In(KEY_DOCUMENT_ID, documentIDs)
                    } else {
                        null
                    },
                    if (timestamp != null) {
                        if (includeUnfinished) {
                            GreaterThanEquals(
                                concatKeys(
                                    KEY_CONFIG_ANNOTATION_DATA,
                                    configurationID,
                                    KEY_ANNOTATIONS,
                                    KEY_TIMESTAMP
                                ), timestamp
                            )
                        } else {
                            GreaterThanEquals(
                                concatKeys(
                                    KEY_CONFIG_ANNOTATION_DATA,
                                    configurationID,
                                    KEY_FINALIZED_ANNOTATIONS,
                                    KEY_TIMESTAMP
                                ), timestamp
                            )
                        }
                    } else {
                        null
                    }
                ).toTypedArray()
            ).buildQuery().toString()).toList()
    }

    /**
     * Find documents for a given [config] and an optional additional searchFilter
     */
    suspend fun findForSearch(config: ProjectConfig, searchFilter: FilterCondition?): List<Document> {
        return documentCollection.find(
            And(
                *config.getFilterConditions(),
                *listOfNotNull(searchFilter).toTypedArray()
            ).buildQuery().toString()).toList()
    }

    /**
     * Get unique list of values for a configuration and annotation over all existing annotations.
     */
    suspend fun aggregateValuesForConfigAndAnnotation(configurationID: String, annotationID: String): List<String> {
        return documentCollection.find(
            Or(
                KeyExists(
                    concatKeys(
                        KEY_CONFIG_ANNOTATION_DATA,
                        configurationID,
                        KEY_ANNOTATIONS,
                        KEY_DOCUMENT_ANNOTATIONS,
                        annotationID
                    ), true
                ),
                KeyExists(
                    concatKeys(
                        KEY_CONFIG_ANNOTATION_DATA,
                        configurationID,
                        KEY_ANNOTATIONS,
                        KEY_SPAN_ANNOTATIONS,
                        annotationID
                    ), true
                )
            ).buildQuery().toString()
        ).toList()
            .flatMap {
                it.configAnnotationData[configurationID]!!.annotations.flatMap {
                    it.documentAnnotations[annotationID]?.value as? List<String> ?: listOf()
                } +
                        it.configAnnotationData[configurationID]!!.annotations.flatMap {
                            it.spanAnnotations[annotationID]?.flatMap { it.value as? List<String> ?: listOf() }
                                ?: listOf()
                        }.toSet().toList()
            }
    }

    /**
     * Concat string keys to build a deep key like "document.innerDocument.someKey"
     */
    private fun concatKeys(vararg keys: String): String {
        return keys.joinToString(".")
    }
}
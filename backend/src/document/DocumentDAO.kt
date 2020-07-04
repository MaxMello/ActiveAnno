package document

import annotationdefinition.generator.UpdatableAnnotationGenerator
import annotationdefinition.generator.UpdateState
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.databind.node.ObjectNode
import com.mongodb.bulk.BulkWriteResult
import com.mongodb.client.model.IndexOptions
import com.mongodb.client.result.DeleteResult
import com.mongodb.client.result.UpdateResult
import common.getNestedKey
import common.getOrCreateCollection
import common.maxByOrNullIfNull
import document.annotation.*
import io.ktor.features.NotFoundException
import kotlinx.coroutines.runBlocking
import org.bson.BsonDocument
import org.bson.BsonInt32
import org.bson.BsonString
import org.litote.kmongo.*
import org.litote.kmongo.coroutine.CoroutineCollection
import org.litote.kmongo.coroutine.CoroutineDatabase
import org.slf4j.LoggerFactory
import project.Project
import project.annotationschema.denormalize
import project.annotationschema.generator.GeneratorSortingPolicy
import project.filter.*
import project.getFilterConditions
import project.selection.DateRangeFilter
import project.selection.SelectionType
import project.selection.SubFilterOption
import project.selection.SubFilterQueryResult
import project.userroles.UserIdentifier

/*
 * List of keys of the document model / json representation to use in queries. Uses reflection to make sure string values
 * are equal to actual names in mongoDB
 */
private const val COLLECTION_DOCUMENT = "documents"
private const val KEY_DOCUMENT_ID = "_id"
private val KEY_RESTRICTED_PROJECT = Document::restrictedProjectID.name
private val KEY_PROJECT_ANNOTATION_DATA = Document::projectAnnotationData.name
private val KEY_ANNOTATION_RESULTS = ProjectAnnotationData::annotationResults.name
private val KEY_GENERATED_ANNOTATION_DATA = ProjectAnnotationData::generatedAnnotationData.name
private val KEY_FINALIZED_ANNOTATION_RESULTS = ProjectAnnotationData::finalizedAnnotationResults.name
private val KEY_POLICY_ACTION = ProjectAnnotationData::policyAction.name
private val KEY_ANNOTATIONS = AnnotationResult::annotations.name
private val KEY_CREATOR = AnnotationResult::creator.name
private val KEY_ANNOTATOR_IDENTIFIER = AnnotationResultCreator.Annotator::identifier.name
private val KEY_CURATOR_IDENTIFIER = AnnotationResultCreator.Curator::identifier.name
private const val KEY_POLICY_TYPE = "type"
private const val VALUE_SHOW_ANNOTATOR = "ShowToAnnotator"
private const val VALUE_SHOW_CURATOR = "ShowToCurator"
private const val KEY_TIMESTAMP = "timestamp"
private val KEY_EXPORT_STATISTICS = FinalizedAnnotationResult::exportStatistics.name
private val KEY_WEB_HOOK_STATISTICS = ExportStatistics::webHookStatistics.name
private const val KEY_SUCCESS = "success"
private const val KEY_ANNOTATION_ID = "id"
private val KEY_ANNOTATION_RESULT_IDS = FinalizedAnnotationResult::annotationResultIDs.name

private val logger = LoggerFactory.getLogger("DocumentDAO")


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
     * Provide [restrictedProjectID] optionally (only used in one-off project context)
     */
    suspend fun insert(json: ObjectNode, restrictedProjectID: String? = null): String {
        val id = newId<Document>().toString()
        documentCollection.insertOne(
            Document(
                id = id,
                storeTimestamp = System.currentTimeMillis(),
                originalDocument = json,
                restrictedProjectID = restrictedProjectID
            )
        )
        return id
    }

    /**
     * Given an json array of originalDocuments, create new document entries into the database.
     * Provide [restrictedProjectID] optionally (only used in one-off project context)
     */
    suspend fun insertMany(json: ArrayNode, restrictedProjectID: String? = null): List<String> {
        val ids: MutableList<String> = mutableListOf()
        documentCollection.insertMany(json.map { obj ->
            if (obj is ObjectNode && json.elements().hasNext()) {
                val id = newId<Document>().toString()
                Document(
                    id = id,
                    storeTimestamp = System.currentTimeMillis(),
                    originalDocument = obj,
                    restrictedProjectID = restrictedProjectID
                ).also {
                    ids.add(id)
                }
            } else {
                throw IllegalArgumentException("Array must contain json objects")
            }
        }.toList())
        return ids
    }

    suspend fun save(document: Document): UpdateResult? {
        return documentCollection.save(document)
    }

    suspend fun update(id: String, document: Document): UpdateResult {
        return documentCollection.replaceOneById(id, document)
    }

    suspend fun bulkReplace(documents: List<Document>): BulkWriteResult {
        return documentCollection.bulkWrite(documents.map { replaceOne(BsonDocument("_id", BsonString(it.id)), it, upsert()) })
    }

    suspend fun updateAndValidate(id: String, document: Document): Boolean {
        return documentCollection.replaceOneById(id, document).let {
            if (it.wasAcknowledged()) {
                true
            } else {
                logger.error("Could not update document table, was not acknowledged: $it")
                false
            }
        }
    }

    suspend fun createSparseIndexes(indexes: List<BsonDocument>) {
        val result = indexes.map { index ->
            documentCollection.createIndex(index, IndexOptions().apply { sparse(true) })
        }
    }

    suspend fun dropIndexes(indexes: List<BsonDocument>) {
        indexes.map {
            try {
                documentCollection.dropIndex(it)
            } catch (e: Exception) {
                logger.error("Could not drop index $it", e)
                null
            }
        }
    }

    suspend fun getAllIndexes(): List<BsonDocument> {
        return documentCollection.listIndexes<BsonDocument>().toList()
    }

    suspend fun getAll(batchSize: Int = 10_000): List<Document> {
        return documentCollection.find().batchSize(batchSize).toList()
    }

    suspend fun countAll(): Long {
        return documentCollection.countDocuments()
    }

    suspend fun byId(id: String): Document {
        return documentCollection.findOneById(id) ?: throw NotFoundException("Document with id $id not found")
    }

    suspend fun byIdOrNull(id: String): Document? {
        return documentCollection.findOneById(id)
    }

    suspend fun deleteById(id: String): DeleteResult {
        return documentCollection.deleteOneById(id)
    }

    /**
     * Given a [project], find all documents for that project.
     */
    suspend fun findForProject(project: Project): List<Document> {
        return documentCollection.find(And(*project.getFilterConditions()).buildQuery().toString()).batchSize(10_000)
            .sort(project.sort.buildSort()).toList()
    }

    suspend fun findForProjectAndMissingProjectAnnotationData(project: Project, limit: Int = 10): List<Document> {
        return documentCollection.find(
            And(
                *project.getFilterConditions(),
                KeyExists(concatKeys(KEY_PROJECT_ANNOTATION_DATA, project.id), false)
            ).buildQuery().toString()
        ).batchSize(limit).sort(project.sort.buildSort()).limit(limit).toList()
    }

    suspend fun findForFilter(filter: FilterCondition): List<Document> {
        return documentCollection.find(filter.buildQuery().toString()).batchSize(10_000).toList()
    }

    suspend fun findForProjectAndMissingGeneratedAnnotationData(project: Project, limit: Int = Int.MAX_VALUE): List<Document> {
        val timestamp = if(project.annotationSchema.generatedAnnotationResultHandling.updateGeneratedAnnotationDataOnNewVersion) {
            project.annotationSchema.denormalize().elements
                .mapNotNull { it.annotationGenerator }
                .filterIsInstance<UpdatableAnnotationGenerator>()
                .also { logger.warn("Number of updatableAnnotationGenerators: ${it.size}") }
                .map { generator ->
                    generator.versions
                        .filter { it.updateResponse != null && it.updateState == UpdateState.UPDATED }
                        .also { logger.warn("Generator ${generator.id} has the following updated versions: $it") }
                        .maxBy { it.updateResponse!!.version }?.updateResponse?.timestamp
                }
                .maxByOrNullIfNull { it }
                .also { logger.warn("Timestamp of the newest generator version $it") }
        } else {
            null
        }
        if(timestamp != null) {
            // Documents that are not finalized, and have a generated annotation data timestamp smaller than the newest timestamp
            return documentCollection.find(
                And(
                    *project.getFilterConditions(),
                    KeyExists(
                        concatKeys(
                            KEY_PROJECT_ANNOTATION_DATA,
                            project.id,
                            KEY_FINALIZED_ANNOTATION_RESULTS,
                            KEY_ANNOTATION_RESULT_IDS
                        ),
                        false
                    ),
                    Or(
                        KeyExists(
                            concatKeys(
                                KEY_PROJECT_ANNOTATION_DATA,
                                project.id,
                                KEY_GENERATED_ANNOTATION_DATA,
                                KEY_TIMESTAMP
                            ),
                            false
                        ),
                        LessThanEquals(
                            concatKeys(
                                KEY_PROJECT_ANNOTATION_DATA,
                                project.id,
                                KEY_GENERATED_ANNOTATION_DATA,
                                KEY_TIMESTAMP
                            ),
                            timestamp
                        )
                    )
                ).buildQuery().toString().also { logger.info("Find for project and old / missing generated annotation data: $it") }
            ).batchSize(10_000).sort(project.sort.buildSort()).limit(limit).toList()
        } else {
            return documentCollection.find(
                And(
                    *project.getFilterConditions(),
                    KeyExists(
                        concatKeys(
                            KEY_PROJECT_ANNOTATION_DATA,
                            project.id,
                            KEY_FINALIZED_ANNOTATION_RESULTS,
                            KEY_ANNOTATION_RESULT_IDS
                        ),
                        false
                    ),
                    KeyExists(
                        concatKeys(
                            KEY_PROJECT_ANNOTATION_DATA,
                            project.id,
                            KEY_GENERATED_ANNOTATION_DATA,
                            KEY_TIMESTAMP
                        ),
                        false
                    )
                ).buildQuery().toString().also { logger.info("Find for project and missing generated annotation data: $it") }
            ).batchSize(10_000).sort(project.sort.buildSort()).limit(limit).toList()
        }
    }

    /**
     * Given a [projectID], find all documents that are restricted to that project.
     */
    suspend fun findForRestrictedProject(projectID: String): List<Document> {
        return documentCollection.find(Equals(KEY_RESTRICTED_PROJECT, projectID).buildQuery().toString()).batchSize(10_000).toList()
    }

    /**
     * Encapsulates the query for getting new documents to annotate. Will use the projects filterCondition,
     * will optionally exclude some documents, and only return documents that are required for annotation and not already
     * annotated by the user
     */
    suspend fun findForAnnotation(
        project: Project,
        userIdentifier: UserIdentifier,
        limit: Int = 10,
        ignoreDocuments: List<String> = listOf(),
        subFilter: Map<String, String> = mapOf(),
        dateRange: List<Long?>? = null,
        includeMissingProjectAnnotationData: Boolean = true
    ): List<Document> {
        val sortingPolicy = project.annotationSchema.generatedAnnotationResultHandling.sortingPolicy
        var actualLimit = limit
        lateinit var generators: List<UpdatableAnnotationGenerator>
        if(sortingPolicy == GeneratorSortingPolicy.ACTIVE_LEARNING_SORT) {
            // Because we currently need to the AL sort in Kotlin vs. in Mongo, we have to increase the limit
            // Only do so if we actually have any updatableGenerators for active learning
            generators = project.annotationSchema.denormalize().elements
                .mapNotNull { it.annotationGenerator }
                .filterIsInstance<UpdatableAnnotationGenerator>()
            if(generators.isNotEmpty()) {
                actualLimit = Int.MAX_VALUE
            }
        }
        val requireGeneratedAnnotationData = (sortingPolicy == GeneratorSortingPolicy.ACTIVE_LEARNING_SORT ||
                sortingPolicy == GeneratorSortingPolicy.DOCUMENTS_WITH_GENERATED_DATA_FIRST)

        val defaultConditionsForAnnotate = listOfNotNull(
            *project.getFilterConditions(),
            *listOfNotNull(
                if (ignoreDocuments.isNotEmpty()) NotIn(
                    KEY_DOCUMENT_ID,
                    ignoreDocuments
                ) else null
            ).toTypedArray(),
            NotEquals(
                concatKeys(
                    KEY_PROJECT_ANNOTATION_DATA,
                    project.id,
                    KEY_ANNOTATION_RESULTS,
                    KEY_CREATOR,
                    KEY_ANNOTATOR_IDENTIFIER
                ), userIdentifier
            ),
            if (includeMissingProjectAnnotationData) {
                Or(
                    KeyExists(
                        concatKeys(
                            KEY_PROJECT_ANNOTATION_DATA,
                            project.id,
                            KEY_POLICY_ACTION,
                            KEY_POLICY_TYPE
                        ), false
                    ),
                    Equals(
                        concatKeys(
                            KEY_PROJECT_ANNOTATION_DATA,
                            project.id,
                            KEY_POLICY_ACTION,
                            KEY_POLICY_TYPE
                        ), VALUE_SHOW_ANNOTATOR
                    )
                )
            } else {
                Equals(
                    concatKeys(
                        KEY_PROJECT_ANNOTATION_DATA,
                        project.id,
                        KEY_POLICY_ACTION,
                        KEY_POLICY_TYPE
                    ), VALUE_SHOW_ANNOTATOR
                )
            },
            *subFilter.map { StringEquals(it.key, it.value) }.toTypedArray(),
            *project.selection.dateRangeFilter.buildDateRangeFilter(dateRange)
        )

        val documents = documentCollection.find(
            And(
                *defaultConditionsForAnnotate.toTypedArray(),
                *listOfNotNull(
                    if (requireGeneratedAnnotationData) KeyExists(
                        concatKeys(
                            KEY_PROJECT_ANNOTATION_DATA,
                            project.id,
                            KEY_GENERATED_ANNOTATION_DATA,
                            KEY_TIMESTAMP
                        ),
                        true
                    ) else null
                ).toTypedArray()
            ).buildQuery().toString().also { logger.info("Find for annotate: $it") }
        ).batchSize(10_000).sort(project.sort.buildSort()).limit(actualLimit).toList()
        logger.info("Found ${documents.size} documents for annotate query")
        var returnDocuments = documents.toMutableList()
        if(sortingPolicy == GeneratorSortingPolicy.ACTIVE_LEARNING_SORT) {
            // Assume generators initialized
            if(generators.isNotEmpty()) {
                val annotationIDs = generators.map { it.annotationDefinitionID }
                returnDocuments = documents.sortedBy { document ->
                    document.projectAnnotationData[project.id]?.annotationResults
                    ?.filter { it.creator is AnnotationResultCreator.Generators || it.creator is AnnotationResultCreator.Import }
                    ?.maxBy { it.timestamp }
                    ?.annotations
                    ?.filter { it.key in annotationIDs }
                    ?.map { entry ->
                        when(val value = entry.value) {
                            is DocumentTargetAnnotation -> {
                                value.values.mapNotNull { it.probability }.min() ?: Double.MAX_VALUE
                            }
                            is SpanTargetAnnotation -> {
                                value.annotations.mapNotNull { it.values.mapNotNull { it.probability }.min() }.min() ?: Double.MAX_VALUE
                            }
                        }
                    }?.min() ?: Double.MAX_VALUE.also { logger.warn("For document ${document.id}, no min confidence found") }
                }.take(limit).toMutableList()
                if(returnDocuments.size < limit) {
                    logger.info("Active learning documents not enough, append ${limit - returnDocuments.size} normal documents")
                    val activeLearningDocumentIDs = returnDocuments.map { it.id }
                    returnDocuments.addAll(documents.filter { it.id !in activeLearningDocumentIDs }.take(limit - returnDocuments.size))
                }
            }
        }
        if(requireGeneratedAnnotationData && returnDocuments.size < limit) {
            val newLimit = limit - returnDocuments.size
            val additionalDocuments = documentCollection.find(
                And(*defaultConditionsForAnnotate.toTypedArray(),   // Default conditions, just no generatedAnnotationData
                    // Additionally, filter those already queried
                    *listOfNotNull(
                        if (returnDocuments.isNotEmpty()) NotIn(
                            KEY_DOCUMENT_ID,
                            returnDocuments.map { it.id }
                        ) else null
                    ).toTypedArray()
                ).buildQuery().toString().also { logger.info("Additional find for annotate: $it") }
            ).batchSize(newLimit).sort(project.sort.buildSort()).limit(newLimit).toList()
            logger.info("After requiring generated annotation data, not enough documents to reach limit, got ${additionalDocuments.size} more")
            returnDocuments.addAll(additionalDocuments)
        }
        return returnDocuments
    }

    /**
     * Count number of annotations required by the user given its [userIdentifier] and a list of [projects].
     */
    suspend fun countForAnnotation(
        projects: List<Project>, userIdentifier: UserIdentifier,
        includeMissingProjectAnnotationData: Boolean = true
    ): Long {
        return documentCollection.countDocuments(
            Or(
                *projects.map { c ->
                    And(
                        *c.getFilterConditions(),
                        NotEquals(
                            concatKeys(
                                KEY_PROJECT_ANNOTATION_DATA,
                                c.id,
                                KEY_ANNOTATION_RESULTS,
                                KEY_CREATOR,
                                KEY_ANNOTATOR_IDENTIFIER
                            ), userIdentifier
                        ),
                        if (includeMissingProjectAnnotationData) {
                            Or(
                                KeyExists(
                                    concatKeys(
                                        KEY_PROJECT_ANNOTATION_DATA,
                                        c.id,
                                        KEY_POLICY_ACTION,
                                        KEY_POLICY_TYPE
                                    ), false
                                ),
                                Equals(
                                    concatKeys(
                                        KEY_PROJECT_ANNOTATION_DATA,
                                        c.id,
                                        KEY_POLICY_ACTION,
                                        KEY_POLICY_TYPE
                                    ), VALUE_SHOW_ANNOTATOR
                                )
                            )
                        } else {
                            Equals(
                                concatKeys(
                                    KEY_PROJECT_ANNOTATION_DATA,
                                    c.id,
                                    KEY_POLICY_ACTION,
                                    KEY_POLICY_TYPE
                                ), VALUE_SHOW_ANNOTATOR
                            )
                        }
                    )
                }.toTypedArray()
            ).buildQuery().toString()
        )
    }

    /**
     * Encapsulates the query for getting new documents to curate. Will use the projects filterCondition,
     * will optionally exclude some documents, and only return documents that are required for curation.
     * If a curator is also an annotator, and the curator annotated a document, the curator will not be able to curate the document.
     */
    suspend fun findForCuration(
        project: Project,
        userIdentifier: UserIdentifier,
        limit: Int = 10,
        ignoreDocuments: List<String> = listOf(),
        subFilter: Map<String, String> = mapOf(),
        dateRange: List<Long?>? = null
    ): List<Document> {
        return documentCollection.find(
            And(
                *project.getFilterConditions(),
                NotEquals(
                    concatKeys(
                        KEY_PROJECT_ANNOTATION_DATA,
                        project.id,
                        KEY_ANNOTATION_RESULTS,
                        KEY_CREATOR,
                        KEY_CURATOR_IDENTIFIER
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
                        KEY_PROJECT_ANNOTATION_DATA,
                        project.id,
                        KEY_POLICY_ACTION,
                        KEY_POLICY_TYPE
                    ), VALUE_SHOW_CURATOR
                ),
                *subFilter.map { StringEquals(it.key, it.value) }.toTypedArray(),
                *project.selection.dateRangeFilter.buildDateRangeFilter(dateRange)
            ).buildQuery().toString()
        ).batchSize(limit).sort(project.sort.buildSort()).limit(limit).toList()
    }

    /**
     * Count number of curations required given a list of [projects] and a [userIdentifier].
     */
    suspend fun countForCuration(projects: List<Project>, userIdentifier: UserIdentifier): Long {
        return documentCollection.countDocuments(
            Or(
                *projects.map { c ->
                    And(
                        *c.getFilterConditions(),
                        NotEquals(
                            concatKeys(
                                KEY_PROJECT_ANNOTATION_DATA,
                                c.id,
                                KEY_ANNOTATION_RESULTS,
                                KEY_CREATOR,
                                KEY_CURATOR_IDENTIFIER
                            ), userIdentifier
                        ),
                        Equals(
                            concatKeys(
                                KEY_PROJECT_ANNOTATION_DATA,
                                c.id,
                                KEY_POLICY_ACTION,
                                KEY_POLICY_TYPE
                            ), VALUE_SHOW_CURATOR
                        )
                    )
                }.toTypedArray()
            ).buildQuery().toString()
        )
    }

    suspend fun aggregateOptionsForSubFilterForAnnotation(
        project: Project,
        userIdentifier: UserIdentifier
    ): Map<String, List<SubFilterOption>> {
        val result = documentCollection.aggregate<SubFilterQueryResult>(
            listOf(
                match(
                    And(
                        *project.getFilterConditions(),
                        NotEquals(
                            concatKeys(
                                KEY_PROJECT_ANNOTATION_DATA,
                                project.id,
                                KEY_ANNOTATION_RESULTS,
                                KEY_CREATOR,
                                KEY_ANNOTATOR_IDENTIFIER
                            ), userIdentifier
                        ),
                        Or(
                            KeyExists(
                                concatKeys(
                                    KEY_PROJECT_ANNOTATION_DATA,
                                    project.id,
                                    KEY_POLICY_ACTION,
                                    KEY_POLICY_TYPE
                                ), false
                            ),
                            Equals(
                                concatKeys(
                                    KEY_PROJECT_ANNOTATION_DATA,
                                    project.id,
                                    KEY_POLICY_ACTION,
                                    KEY_POLICY_TYPE
                                ), VALUE_SHOW_ANNOTATOR
                            )
                        )
                    ).buildBson()
                ),
                project(
                    BsonDocument("_id", BsonInt32(0)),
                    *project.selection.subFilter.filter { it.selectionType == SelectionType.AGGREGATE_ALL_VALUES }.map {
                        BsonDocument(
                            "originalDocument.${it.key}",
                            BsonInt32(1)
                        )
                    }.toTypedArray()
                )
            )
        ).batchSize(10_000).toList()
        return result.flatMap { sfqr ->
            sfqr.originalDocument.fieldNames().asSequence().toList().map { it to sfqr.originalDocument.getNestedKey(it) }
        }.groupBy { it.first }
            .map {
                it.key to it.value.map { it.second }.groupingBy { it }.eachCount().map { o ->
                    SubFilterOption(
                        o.key?.asText() ?: throw IllegalStateException("Key missing"),
                        o.value
                    )
                }
            }.toMap()
    }

    suspend fun aggregateOptionsForSubFilterForCuration(
        project: Project,
        userIdentifier: UserIdentifier
    ): Map<String, List<SubFilterOption>> {
        val result = documentCollection.aggregate<SubFilterQueryResult>(
            listOf(
                match(
                    And(
                        *project.getFilterConditions(),
                        NotEquals(
                            concatKeys(
                                KEY_PROJECT_ANNOTATION_DATA,
                                project.id,
                                KEY_ANNOTATION_RESULTS,
                                KEY_CREATOR,
                                KEY_ANNOTATOR_IDENTIFIER
                            ), userIdentifier
                        ),
                        Equals(
                            concatKeys(
                                KEY_PROJECT_ANNOTATION_DATA,
                                project.id,
                                KEY_POLICY_ACTION,
                                KEY_POLICY_TYPE
                            ), VALUE_SHOW_CURATOR
                        )
                    ).buildBson()
                ),
                project(
                    BsonDocument("_id", BsonInt32(0)),
                    *project.selection.subFilter.filter { it.selectionType == SelectionType.AGGREGATE_ALL_VALUES }.map {
                        BsonDocument(
                            "originalDocument.${it.key}",
                            BsonInt32(1)
                        )
                    }.toTypedArray()
                )
            )
        ).batchSize(10_000).toList()
        return result.flatMap { sfqr ->
            sfqr.originalDocument.fieldNames().asSequence().toList().map { it to sfqr.originalDocument.getNestedKey(it) }
        }.groupBy { it.first }
            .map {
                it.key to it.value.map { it.second }.groupingBy { it }.eachCount().map { o ->
                    SubFilterOption(
                        o.key?.asText() ?: throw IllegalStateException("Key missing"),
                        o.value
                    )
                }
            }.toMap()
    }

    /**
     * Get all documents with failed webhook tries for resend purposes given a [projectID]
     */
    suspend fun findFailedWebHookDocuments(projectID: String): List<Document> {
        return documentCollection.find(
            Equals(
                concatKeys(
                    KEY_PROJECT_ANNOTATION_DATA,
                    projectID,
                    KEY_FINALIZED_ANNOTATION_RESULTS,
                    KEY_EXPORT_STATISTICS,
                    KEY_WEB_HOOK_STATISTICS,
                    KEY_SUCCESS
                ),
                false
            ).buildQuery().toString()
        ).batchSize(10_000).toList()
    }

    /**
     * Get all documents for an export for a [projectID] with options to also include unfinished documents,
     * limit it to a list of [documentIDs] and/or only return documents newer than a [timestamp]. If unfinished documents
     * are included, the annotation timestamp will be used, else the finalizedAnnotation timestamp.
     */
    suspend fun findForExport(
        projectID: String,
        includeUnfinished: Boolean,
        documentIDs: List<String>,
        timestamp: Long?
    ): List<Document> {
        return documentCollection.find(
            And(
                *listOfNotNull(
                    if (includeUnfinished) {
                        KeyExists(
                            concatKeys(
                                KEY_PROJECT_ANNOTATION_DATA,
                                projectID,
                                KEY_ANNOTATION_RESULTS,
                                KEY_ANNOTATION_ID
                            ), // Make sure annotations is not empty
                            true
                        )
                    } else {
                        KeyExists(
                            concatKeys(
                                KEY_PROJECT_ANNOTATION_DATA,
                                projectID,
                                KEY_FINALIZED_ANNOTATION_RESULTS,
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
                                    KEY_PROJECT_ANNOTATION_DATA,
                                    projectID,
                                    KEY_ANNOTATION_RESULTS,
                                    KEY_TIMESTAMP
                                ), timestamp
                            )
                        } else {
                            GreaterThanEquals(
                                concatKeys(
                                    KEY_PROJECT_ANNOTATION_DATA,
                                    projectID,
                                    KEY_FINALIZED_ANNOTATION_RESULTS,
                                    KEY_TIMESTAMP
                                ), timestamp
                            )
                        }
                    } else {
                        null
                    }
                ).toTypedArray()
            ).buildQuery().toString().also { logger.info("Export query: $it") }
        ).batchSize(10_000).toList()
    }

    /**
     * Find documents for a given [project] and an optional additional searchFilter
     */
    suspend fun findForSearch(project: Project, searchFilter: FilterCondition?): List<Document> {
        return documentCollection.find(
            And(
                *project.getFilterConditions(),
                *listOfNotNull(searchFilter).toTypedArray()
            ).buildQuery().toString().also { logger.info("Find for search query $it") }
        ).batchSize(10_000).toList()
    }

    /**
     * Get unique list of values for a project and annotation over all existing annotations.
     */
    suspend fun aggregateValuesForProjectAndAnnotation(projectID: String, annotationID: String): List<String> {
        return documentCollection.find(
            KeyExists(
                concatKeys(
                    KEY_PROJECT_ANNOTATION_DATA,
                    projectID,
                    KEY_ANNOTATION_RESULTS,
                    KEY_ANNOTATIONS,
                    annotationID
                ), true
            ).buildQuery().toString()
        ).batchSize(10_000).toList()
            .flatMap { document ->
                document.projectAnnotationData[projectID]!!.annotationResults.mapNotNull { annotationResult ->
                    annotationResult.annotations[annotationID]?.let { annotation ->
                        when(annotation) {
                            is DocumentTargetAnnotation -> {
                                annotation.values.map { it.value.toString() }
                            }
                            is SpanTargetAnnotation -> {
                                annotation.annotations.flatMap { it.values.map { it.value.toString() } }
                            }
                        }
                    }
                }.flatten()
            }.toSet().sorted()
    }

    /**
     * Concat string keys to build a deep key like "document.innerDocument.someKey"
     */
    private fun concatKeys(vararg keys: String): String {
        return keys.joinToString(".")
    }

    private fun DateRangeFilter?.buildDateRangeFilter(dateRange: List<Long?>?): Array<FilterCondition> {
        return if (this != null && dateRange != null && dateRange.size == 2) {
            listOfNotNull(
                if (dateRange[0] != null) {
                    if (dateFormat == null) {
                        GreaterThanEquals(dateKey, dateRange[0]!!)
                    } else {
                        DateGreaterThanEquals(dateKey, dateFormat, dateRange[0]!!)
                    }
                } else {
                    null
                },
                if (dateRange[1] != null) {
                    if (dateFormat == null) {
                        LessThanEquals(dateKey, dateRange[1]!!)
                    } else {
                        DateLessThanEquals(dateKey, dateFormat, dateRange[1]!!)
                    }
                } else {
                    null
                }
            ).toTypedArray()
        } else {
            arrayOf()
        }
    }
}
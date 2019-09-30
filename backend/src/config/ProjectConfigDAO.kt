package config

import com.mongodb.client.result.UpdateResult
import common.getOrCreateCollection
import config.filter.And
import config.filter.Equals
import config.filter.In
import config.filter.Or
import config.sort.Order
import config.sort.Sort
import config.sort.SortElement
import config.userroles.UserIdentifier
import config.userroles.UserRoles
import io.ktor.features.NotFoundException
import io.ktor.util.KtorExperimentalAPI
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.contains
import org.litote.kmongo.coroutine.CoroutineCollection
import org.litote.kmongo.coroutine.CoroutineDatabase
import org.litote.kmongo.div

private const val PROJECT_CONFIG_COLLECTION = "config"

/**
 * DAO for the [ProjectConfig] regulating access to the config collection
 */
class ProjectConfigDAO(database: CoroutineDatabase) {
    private val configCollection: CoroutineCollection<ProjectConfig> = runBlocking {
        database.getOrCreateCollection<ProjectConfig>(PROJECT_CONFIG_COLLECTION)
    }

    suspend fun getConfigsForUser(userIdentifier: UserIdentifier, activeOnly: Boolean = true): Set<ProjectConfig> {
        return if (activeOnly) {
            configCollection.find(
                And(
                    Equals("active", true), Or(
                        Equals("userRoles.annotators", userIdentifier),
                        Equals("userRoles.curators", userIdentifier),
                        Equals("userRoles.managers", userIdentifier)
                    )
                ).buildQuery().toString()
            ).toList().toSet()
        } else {
            configCollection.find(
                Or(
                    Equals("userRoles.annotators", userIdentifier),
                    Equals("userRoles.curators", userIdentifier),
                    Equals("userRoles.managers", userIdentifier)
                ).buildQuery().toString()
            ).toList().toSet()
        }
    }

    suspend fun getAnnotateConfigsForUser(
        userIdentifier: UserIdentifier,
        activeOnly: Boolean = true
    ): Set<ProjectConfig> {
        return if (activeOnly) {
            configCollection.find(
                And(
                    Equals("active", true),
                    Equals("userRoles.annotators", userIdentifier)
                )
                    .buildQuery().toString()
            ).sort(Sort(listOf(SortElement("priority", Order.DESC))).buildSort())
                .toList().toSet()
        } else {
            configCollection.find(
                ProjectConfig::userRoles / UserRoles::annotators contains userIdentifier
            ).sort(Sort(listOf(SortElement("priority", Order.DESC))).buildSort())
                .toList().toSet()
        }
    }

    suspend fun getCurateConfigsForUser(
        userIdentifier: UserIdentifier,
        activeOnly: Boolean = true
    ): Set<ProjectConfig> {
        return if (activeOnly) {
            configCollection.find(
                And(
                    Equals("active", true),
                    Equals("userRoles.curators", userIdentifier)
                )
                    .buildQuery().toString()
            ).sort(Sort(listOf(SortElement("priority", Order.DESC))).buildSort())
                .toList().toSet()
        } else {
            configCollection.find(ProjectConfig::userRoles / UserRoles::curators contains userIdentifier)
                .sort(Sort(listOf(SortElement("priority", Order.DESC))).buildSort())
                .toList().toSet()
        }
    }

    suspend fun getManageConfigsForUser(
        userIdentifier: UserIdentifier,
        activeOnly: Boolean = true
    ): Set<ProjectConfig> {
        return if (activeOnly) {
            configCollection.find(
                And(
                    Equals("active", true),
                    Equals("userRoles.managers", userIdentifier)
                )
                    .buildQuery().toString()
            ).toList().toSet()
        } else {
            configCollection.find(ProjectConfig::userRoles / UserRoles::managers contains userIdentifier).toList()
                .toSet()
        }
    }

    @KtorExperimentalAPI
    suspend fun getConfigById(id: String): ProjectConfig {
        return configCollection.findOneById(id) ?: throw NotFoundException("ProjectConfig with id $id not found")
    }

    suspend fun getConfigsByIds(ids: List<String>): List<ProjectConfig> {
        return configCollection.find(In("_id", ids).buildQuery().toString()).toList()
    }

    suspend fun replaceById(id: String, config: ProjectConfig): UpdateResult {
        return configCollection.replaceOneById(id, config)
    }

    suspend fun insertOne(config: ProjectConfig): String {
        configCollection.insertOne(config)
        return config._id
    }
}
package project

import com.mongodb.client.result.UpdateResult
import common.getOrCreateCollection
import io.ktor.features.NotFoundException
import io.ktor.util.KtorExperimentalAPI
import kotlinx.coroutines.runBlocking
import org.litote.kmongo.contains
import org.litote.kmongo.coroutine.CoroutineCollection
import org.litote.kmongo.coroutine.CoroutineDatabase
import org.litote.kmongo.div
import project.filter.And
import project.filter.Equals
import project.filter.In
import project.filter.Or
import project.sort.Order
import project.sort.Sort
import project.sort.SortElement
import project.userroles.UserIdentifier
import project.userroles.UserRoles

private const val PROJECT_COLLECTION = "projects"

/**
 * DAO for the [Project] regulating access to the project collection
 *
 */
class ProjectDAO(database: CoroutineDatabase) {
    private val projectCollection: CoroutineCollection<Project> = runBlocking {
        database.getOrCreateCollection<Project>(PROJECT_COLLECTION)
    }

    suspend fun getProjectsForUser(userIdentifier: UserIdentifier, activeOnly: Boolean = true): Set<Project> {
        return if (activeOnly) {
            projectCollection.find(
                And(
                    Equals("active", true), Or(
                        Equals("userRoles.annotators", userIdentifier),
                        Equals("userRoles.curators", userIdentifier),
                        Equals("userRoles.managers", userIdentifier)
                    )
                ).buildQuery().toString()
            ).toList().toSet()
        } else {
            projectCollection.find(
                Or(
                    Equals("userRoles.annotators", userIdentifier),
                    Equals("userRoles.curators", userIdentifier),
                    Equals("userRoles.managers", userIdentifier)
                ).buildQuery().toString()
            ).toList().toSet()
        }
    }

    suspend fun getAnnotateProjectsForUser(
        userIdentifier: UserIdentifier,
        activeOnly: Boolean = true
    ): Set<Project> {
        return if (activeOnly) {
            projectCollection.find(
                And(
                    Equals("active", true),
                    Equals("userRoles.annotators", userIdentifier)
                )
                    .buildQuery().toString()
            ).sort(Sort(listOf(SortElement("priority", Order.DESC))).buildSort())
                .toList().toSet()
        } else {
            projectCollection.find(
                Project::userRoles / UserRoles::annotators contains userIdentifier
            ).sort(Sort(listOf(SortElement("priority", Order.DESC))).buildSort())
                .toList().toSet()
        }
    }

    suspend fun getCurateProjectsForUser(
        userIdentifier: UserIdentifier,
        activeOnly: Boolean = true
    ): Set<Project> {
        return if (activeOnly) {
            projectCollection.find(
                And(
                    Equals("active", true),
                    Equals("userRoles.curators", userIdentifier)
                )
                    .buildQuery().toString()
            ).sort(Sort(listOf(SortElement("priority", Order.DESC))).buildSort())
                .toList().toSet()
        } else {
            projectCollection.find(Project::userRoles / UserRoles::curators contains userIdentifier)
                .sort(Sort(listOf(SortElement("priority", Order.DESC))).buildSort())
                .toList().toSet()
        }
    }

    suspend fun getManageProjectsForUser(
        userIdentifier: UserIdentifier,
        activeOnly: Boolean = true
    ): Set<Project> {
        return if (activeOnly) {
            projectCollection.find(
                And(
                    Equals("active", true),
                    Equals("userRoles.managers", userIdentifier)
                )
                    .buildQuery().toString()
            ).toList().toSet()
        } else {
            projectCollection.find(Project::userRoles / UserRoles::managers contains userIdentifier).toList()
                .toSet()
        }
    }

    @KtorExperimentalAPI
    suspend fun getProjectById(id: String): Project {
        return projectCollection.findOneById(id) ?: throw NotFoundException("Project with id $id not found")
    }

    suspend fun getProjectsByIds(ids: List<String>): List<Project> {
        return projectCollection.find(In("_id", ids).buildQuery().toString()).toList()
    }

    suspend fun getAll(): List<Project> {
        return projectCollection.find().toList()
    }

    suspend fun getAllActive(): List<Project> {
        return projectCollection.find(Equals("active", true).buildQuery().toString()).toList()
    }

    suspend fun replaceById(id: String, project: Project): UpdateResult {
        return projectCollection.replaceOneById(id, project)
    }

    suspend fun insertOne(project: Project): String {
        projectCollection.insertOne(project)
        return project.id
    }

    suspend fun save(project: Project): UpdateResult? {
        return projectCollection.save(project)
    }
}
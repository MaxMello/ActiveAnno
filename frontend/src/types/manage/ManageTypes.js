// @flow
import type {DocumentSelection} from "../project/ProjectTypes";
import type {Dictionary, ProjectID} from "../Types";
import type {Layout} from "../project/layout/Layout";
import type {FinalizeAnnotationPolicy} from "../../constants/ProjectConfig";
import type {AnnotationSchema} from "./AnnotationSchema";


export type ManageListProject = {|
    id: ProjectID,
    name: string,
    description: string
|}

export type ManageProject = {|
    ...ManageListProject,
    priority: number,
    active: boolean,
    userRoles: UserRoles,
    inputMapping: InputMapping,
    filter?: FilterCondition,
    sort: Sort,
    selection: DocumentSelection,
    annotationSchema: AnnotationSchema,
    layout: Layout,
    policy: Policy,
    export: Export,
    createProjectSpecificIndexes: boolean,
|}

export type NewManageProject = {|
    id?: ProjectID,
    name: string,
    description: string,
    priority: number,
    active: boolean,
    userRoles: UserRoles,
    inputMapping: InputMapping,
    filter: ?FilterCondition,
    sort: Sort,
    selection: DocumentSelection,
    annotationSchema: AnnotationSchema,
    layout: ?Layout,
    policy: ?Policy,
    export: ?Export,
    createProjectSpecificIndexes: boolean
|}

export type ProjectStoreResponse = {|
    projectID: ?ProjectID,
    project: ?ManageProject,
    success: boolean,
    errors: Dictionary<string, ProjectValidationError>,
    message: string
|}

export type ProjectStoreResponseInState = {|
    success: boolean,
    errors: Dictionary<string, ProjectValidationError>,
    message: string
|}

export type ProjectValidationError = {|
    key: string,
    message: string,
    criticalError: boolean
|}

export type UserRoles = {|
    managers: Array<string>,
    annotators: Array<string>,
    curators: Array<string>
|}

export type InputMapping = {|
    documentText: DocumentText,
    metaData: Array<MetaData>
|}

export type DocumentText = {|
    key: string
|}

export type MetaData = {|
    id: string,
    key: string,
    index?: CreateIndex
|}

export type Order = 'ASC' | 'DESC'

export type CreateIndex = {|
    type: string,
    order: Order
|}

export type FilterConditionOperator = 'eq' | 'neq' | 'exists' | 'regex' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' |
    'all' | 'size' | 'not' | 'and' | 'or' | 'nor';

export type FilterCondition = {|
    key: string,
    operator: FilterConditionOperator,
    dataType?: string, // Ignored by the backend, only relevant for frontend
    value?: any, // Equals, NotEquals, GT, GTE, LT, LTE, Size, KeyExists, Regex, In, NotIn, ContainsAll
    filterCondition?: FilterCondition, // Not
    filterConditions?: Array<FilterCondition> // Any, Or, Nor
|}

export type Sort = {|
    sorts: Array<SortElement>
|}

export type SortElement = {|
    key: string,
    order: Order
|}

export type Policy = {|
    numberOfAnnotatorsPerDocument: number,
    allowManualEscalationToCurator: boolean,
    finalizeAnnotationPolicy: FinalizeAnnotationPolicy
|}

export type OnOverwrittenFinalizedAnnotationBehavior = 'DO_NOTHING' | 'TRIGGER_EXPORT_AGAIN';

export type Export = {|
    webHooks: Array<WebHookConfig>,
    rest: ?RestConfig,
    onOverwrittenFinalizedAnnotationBehavior: OnOverwrittenFinalizedAnnotationBehavior
|}

export type WebHookConfig = {|
    url: string,
    onFailure: OnWebHookFailureBehavior,
    exportFormat: ExportFormat,
    authentication: WebHookAuthentication
|}

export type OnWebHookFailureBehavior = 'IGNORE' | 'RESEND_ON_NEXT_TRIGGER'

export type ExportFormat = {|
    includeOriginalDocument: boolean,
    includeAllAnnotations: boolean
|}

export type RestConfig = {|
    exportFormat: ExportFormat,
    authentication: RestAuthentication
|}

export type RestAuthentication = {|
    type: RestAuthenticationType,
    username?: string, // only HttpBasicAuth
    password?: string // only HttpBasicAuth
|}

export type WebHookAuthentication = {
    type: WebHookAuthenticationType,
    username?: string, // only HttpBasicAuth
    password?: string, // only HttpBasicAuth
    clientID?: string, // only Oauth2
    clientSecret?: string, // only OAuth2
    tokenUrl?: string // only Oauth2
}

export type RestAuthenticationType = 'None' | "JwtRole" | "HttpBasicAuth";

export type WebHookAuthenticationType = "None" | "HttpBasicAuth" | "Oauth2";
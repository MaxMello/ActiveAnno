import type {Dictionary} from "./Types";
import type {Annotations} from "./AnnotationConfigTypes";
import type {Layout} from "./LayoutConfigTypes";


export type ManageConfigMinimal = {
    id: string,
    name: string,
    description: string,
    priority: number
}

export type ManageConfigFull = {
    id: string,
    name: string,
    description: string,
    priority: number,
    active: boolean,
    userRoles: UserRoles,
    inputMapping: InputMapping,
    filter?: FilterCondition,
    sort: Sort,
    annotations: Annotations,
    layout: Layout,
    policy: Policy,
    export: Export,
    needsSyncing?: boolean
}

export type NewManageConfig = {
    id?: string,
    name?: string,
    description?: string,
    priority?: number,
    active?: boolean,
    userRoles?: UserRoles,
    inputMapping?: InputMapping,
    filter?: FilterCondition,
    sort?: Sort,
    annotations?: Annotations,
    layout?: Layout,
    policy?: Policy,
    export?: Export
}

export type UserRoles = {
    managers: Array<string>,
    annotators: Array<string>,
    curators: Array<string>
}

export type InputMapping = {
    documentText: DocumentText,
    metaData: Array<MetaData>
}

export type DocumentText = {
    key: string,
    createTextIndex: boolean
}

export type MetaData = {
    id: string,
    key: string,
    index?: CreateIndex | CreateTextIndex
}

export type Order = 'ASC' | 'DESC'

export type CreateIndex = {
    type: string,
    order: Order,
    unique: boolean
}

export type CreateTextIndex = {
    type: string
}

export type FilterConditionOperator = 'eq' | 'neq' | 'exists' | 'regex' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'all' | 'size' | 'not' | 'and' | 'or' | 'nor';

export type FilterCondition = {
    key: string,
    operator: FilterConditionOperator,
    dataType?: string, // Ignored by the backend, only relevant for frontend
    value?: any, // Equals, NotEquals, GT, GTE, LT, LTE, Size, KeyExists, Regex, In, NotIn, ContainsAll
    filterCondition?: FilterCondition, // Not
    filterConditions?: Array<FilterCondition> // Any, Or, Nor
}

export type Sort = {
    sorts: Array<SortElement>
}

export type SortElement = {
    key: string,
    order: Order
}

export type FinalizeAnnotationPolicy = 'EXPORT_EVERY_ANNOTATION_SEPARATELY' | 'MAJORITY_VOTE_PER_ANNOTATION_OR_CURATOR' | 'MAJORITY_VOTE_WHOLE_DOCUMENT_OR_CURATOR' | 'ALWAYS_REQUIRE_CURATION' | 'MAJORITY_VOTE_PER_ANNOTATION_OR_ADDITIONAL_ANNOTATOR' | 'MAJORITY_VOTE_WHOLE_DOCUMENT_OR_ADDITIONAL_ANNOTATOR';

export type Policy = {
    numberOfAnnotatorsPerDocument: number,
    allowManualEscalationToCurator: boolean,
    finalizeAnnotationPolicy: FinalizeAnnotationPolicy
}

export type OnOverwrittenFinalizedAnnotationBehavior = 'DO_NOTHING' | 'TRIGGER_EXPORT_AGAIN';

export type Export = {
    webHooks: Array<WebHookConfig>,
    rest?: RestConfig,
    onOverwrittenFinalizedAnnotationBehavior: OnOverwrittenFinalizedAnnotationBehavior
}

export type WebHookConfig = {
    url: string,
    onFailure: OnWebHookFailureBehavior,
    exportFormat: ExportFormat,
    authentication: WebHookAuthentication
}

export type OnWebHookFailureBehavior = 'IGNORE' | 'RESEND_ON_NEXT_TRIGGER'

export type ExportFormat = {
    includeOriginalDocument: boolean,
    includeAllAnnotations: boolean
}

export type RestConfig = {
    exportFormat: ExportFormat,
    authentication: RestAuthentication
}

export type RestAuthentication = {
    type: RestAuthenticationType,
    username?: string, // only HttpBasicAuth
    password?: string // only HttpBasicAuth
}

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

export type ManageState = {
    configs: Dictionary<string, ManageConfigMinimal | ManageConfigFull>,
    listFetchStatus: number,
    configFetchStatus: number,
    newConfig: NewManageConfig
}
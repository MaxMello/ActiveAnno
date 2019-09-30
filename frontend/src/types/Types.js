import type {ValidationError} from "../components/helper/ValidateAnnotations";
import type {CurationConfigState, CurationDataState} from "./CurateTypes";
import type {Annotations} from "./AnnotationConfigTypes";
import type {AnnotationConfigState, AnnotationDataState} from "./AnnotationTypes";
import type {PageSetupState} from "./PageSetupTypes";
import type {AuthenticationState} from "./AuthenticationTypes";
import type {ManageState} from "./ManageTypes";


/******************************************************************
 * 2. General purpose
 ******************************************************************/

export type Dictionary<A, B> = {
    [A]: B
};

/******************************************************************
 * 2. Type aliases
 ******************************************************************/

export type configurationID = string;
export type documentID = string;
export type annotationID = string;
export type userIdentifier = string;

/******************************************************************
 * 2. Redux
 ******************************************************************/

export type Action = {
    type: string,
    payload?: Object,
    meta?: Object,
    error?: boolean
}

/******************************************************************
 * 3. API usage
 ******************************************************************/

export type HttpError = {
    statusCode: number,
    statusText: string
}

/******************************************************************
 * 4. React component props
 ******************************************************************/

export type WithStylesComponentProps = {
    classes: Object
}

export type WithRouterComponentProps = {
    history: Object,
    location: Object,
    match: Object
}

export type WithLocalizationComponentProps = {
    localize: Function
}

export type AnnotationInteractionProps = {
    localize: Function,
    configID: string,
    annotationConfig: Annotations,
    documentID: string,
    target: string,
    annotations: Dictionary<string, any>,
    setAnnotationValue: Function,
    element: any,
    keyValue: string,
    validationErrors: Array<ValidationError>
};

/******************************************************************
 * 5. States
 ******************************************************************/

export type ApplicationState = {
    language: {
        selected: string,
        available: Array<string>
    }
}

export type AppState = {
    authentication: AuthenticationState,
    application: ApplicationState,
    pageSetup: PageSetupState,
    annotationConfig: AnnotationConfigState,
    annotationData: AnnotationDataState,
    curationConfig: CurationConfigState,
    curationData: CurationDataState,
    manage: ManageState
}
// @flow
import type {AuthenticationState} from "./AuthenticationState";
import type {ApplicationState} from "./ApplicationState";
import type {PageSetupState} from "./PageSetupState";
import type {AnnotationDataState} from "./annotate/AnnotationDataState";
import type {CurationDataState} from "./annotate/CurationDataState";
import type {ManageState} from "./ManageState";
import type {AnnotationProjectState} from "./AnnotationConfigState";
import type {CurationProjectState} from "./CurationConfigState";

export type AppState = {|
    authentication: AuthenticationState,
    application: ApplicationState,
    pageSetup: PageSetupState,
    annotationProject: AnnotationProjectState,
    annotationData: AnnotationDataState,
    curationProject: CurationProjectState,
    curationData: CurationDataState,
    manage: ManageState
|}
// @flow
import type {AnnotateProject, ListProject} from "../annotate/DTOTypes";
import type {DocumentSelectionParameters} from "../annotate/DocumentSelectionParameters";
import type {Dictionary, ProjectID} from "../Types";

export type AnnotationProjectState = {|
    type: "annotate",
    projects: Dictionary<string, ListProject | AnnotateProject>,
    listFetchStatus: ?number,
    projectFetchStatus: ?number,
    activeProjectID: ProjectID,
    selection: DocumentSelectionParameters
|}
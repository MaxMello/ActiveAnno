// @flow
import type {Dictionary, ProjectID} from "../Types";
import type {AnnotateProject, ListProject} from "../annotate/DTOTypes";
import type {DocumentSelectionParameters} from "../annotate/DocumentSelectionParameters";

export type CurationProjectState = {|
    type: "curate",
    projects: Dictionary<ProjectID, ListProject | AnnotateProject>,
    listFetchStatus: ?number,
    projectFetchStatus: ?number,
    activeProjectID: ProjectID,
    selection: DocumentSelectionParameters
|}
// @flow
import {connect} from "react-redux";
import type {Dictionary, DocumentID, ProjectID} from "../../types/Types";
import {CurationDataActions, StoreCurationDataActions} from "../../redux/annotate/curationData";
import {CurationAction} from "../../redux/annotate/curationRefresh";
import type {AppState} from "../../types/redux/AppState";
import {CurationProjectActions, CurationSelectionActions} from "../../redux/annotate/curationProject";
import AnnotateView from "../elements/AnnotateView";
import type {AnnotationDocumentInState} from "../../types/redux/annotate/AnnotationDataState";
import type {UsedAnnotateProject} from "../../types/project/UsedAnnotateProject";


const mapStateToProps = (state: AppState): Object => ({
    projectState: state.curationProject,
    dataState: state.curationData
});

const mapDispatchToProps = (dispatch: Function): Object => ({
    // Project
    loadProject: (projectID: string) => {
        dispatch(CurationProjectActions.start(projectID));
    },
    setProjectActive: (projectID: string) => {
        dispatch(CurationProjectActions.setActive(projectID));
    },
    // Data
    setDocumentActive: (projectID: string, documentID: string) => {
        dispatch(CurationDataActions.setActive(projectID, documentID));
    },
    setAnnotationValue: (projectID: string, documentID: string, annotationID: string, value: any) => {
        dispatch(CurationDataActions.setAnnotationValue(projectID, documentID, annotationID, value));
    },
    sendDocument: (annotationDocument: AnnotationDocumentInState, usedProject: UsedAnnotateProject) => {
        dispatch(StoreCurationDataActions.start(annotationDocument, usedProject));
    },
    deleteDocumentsForProject: (projectID: string) => {
        dispatch(CurationDataActions.removeDocumentsFromStoreForProject(projectID))
    },
    resetAnnotations: (projectID: ProjectID, documentID: DocumentID) => {
        dispatch(CurationDataActions.resetAnnotations(projectID, documentID))
    },
    skipDocument: (projectID: ProjectID, documentID: DocumentID) => {
        dispatch(CurationDataActions.skipDocument(projectID, documentID))
    },
    // Refresh
    startRefreshing: () => {
        dispatch(CurationAction.startRefreshing());
    },
    stopRefreshing: () => {
        dispatch(CurationAction.stopRefreshing());
    },
    forceRefresh: () => {
        dispatch(CurationAction.forceRefresh());
    },
    triggerRefresh: () => {
        dispatch(CurationAction.triggerRefresh());
    },
    // Selection
    setSubFilter: (subFilter: Dictionary<string, string>) => {
        dispatch(CurationSelectionActions.setSubFilter(subFilter))
    },
    setDateFilterFrom: (date: string) => {
        dispatch(CurationSelectionActions.setDateFilterFrom(date))
    },
    setDateFilterTo: (date: string) => {
        dispatch(CurationSelectionActions.setDateFilterTo(date))
    }
});

export const CuratePage = connect(mapStateToProps, mapDispatchToProps)(AnnotateView);
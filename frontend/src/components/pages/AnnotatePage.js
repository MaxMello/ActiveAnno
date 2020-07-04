// @flow
import {connect} from "react-redux";
import {AnnotationDataActions, StoreAnnotationDataActions} from "../../redux/annotate/annotationData";
import {AnnotationAction} from "../../redux/annotate/annotationRefresh";
import type {Dictionary, DocumentID, ProjectID} from "../../types/Types";
import type {AnnotationDocumentInState} from "../../types/redux/annotate/AnnotationDataState";
import type {AppState} from "../../types/redux/AppState";
import {AnnotationProjectActions, AnnotationSelectionActions} from "../../redux/annotate/annotationProject";
import type {UsedAnnotateProject} from "../../types/project/UsedAnnotateProject";
import AnnotateView from "../elements/AnnotateView";

const mapStateToProps = (state: AppState): Object => ({
    projectState: state.annotationProject,
    dataState: state.annotationData
});

const mapDispatchToProps = (dispatch: Function): Object => ({
        // Project
        loadProject: (projectID: string) => {
            dispatch(AnnotationProjectActions.start(projectID));
        },
        setProjectActive: (projectID: string) => {
            dispatch(AnnotationProjectActions.setActive(projectID));
        },
        // Data
        setDocumentActive: (projectID: string, documentID: string) => {
            dispatch(AnnotationDataActions.setActive(projectID, documentID));
        },
        setAnnotationValue: (projectID: string, documentID: string, annotationID: string, value: any) => {
            dispatch(AnnotationDataActions.setAnnotationValue(projectID, documentID, annotationID, value));
        },
        sendDocument: (annotationDocument: AnnotationDocumentInState, usedProject: UsedAnnotateProject) => {
            dispatch(StoreAnnotationDataActions.start(annotationDocument, usedProject));
        },
        deleteDocumentsForProject: (projectID: string) => {
            dispatch(AnnotationDataActions.removeDocumentsFromStoreForProject(projectID))
        },
        resetAnnotations: (projectID: ProjectID, documentID: DocumentID) => {
            dispatch(AnnotationDataActions.resetAnnotations(projectID, documentID))
        },
        skipDocument: (projectID: ProjectID, documentID: DocumentID) => {
            dispatch(AnnotationDataActions.skipDocument(projectID, documentID))
        },
        // Refresh
        startRefreshing: () => {
            dispatch(AnnotationAction.startRefreshing());
        },
        stopRefreshing: () => {
            dispatch(AnnotationAction.stopRefreshing());
        },
        forceRefresh: () => {
            dispatch(AnnotationAction.forceRefresh());
        },
        triggerRefresh: () => {
            dispatch(AnnotationAction.triggerRefresh());
        },
        // Selection
        setSubFilter: (subFilter: Dictionary<string, string>) => {
            dispatch(AnnotationSelectionActions.setSubFilter(subFilter))
        },
        setDateFilterFrom: (date: string) => {
            dispatch(AnnotationSelectionActions.setDateFilterFrom(date))
        },
        setDateFilterTo: (date: string) => {
            dispatch(AnnotationSelectionActions.setDateFilterTo(date))
        }
});

export const AnnotatePage = connect(mapStateToProps, mapDispatchToProps)(AnnotateView);
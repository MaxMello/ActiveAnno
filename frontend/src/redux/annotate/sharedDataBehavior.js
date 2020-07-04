import type {CurationDataState} from "../../types/redux/annotate/CurationDataState";
import type {
    AnnotationDataState,
    CheckEnableConditionResponse,
    SetAnnotationValueAction
} from "../../types/redux/annotate/AnnotationDataState";
import type {CurationDocument} from "../../types/annotate/CurateTypes";
import type {AnnotationDocument, AnnotationResultStoreResponse} from "../../types/annotate/AnnotateTypes";
import type {Action, DocumentID, ProjectID} from "../../types/Types";
import type {PostAnnotationResult} from "../../types/annotate/DTOTypes";

/*
    This file contains logic / behavior shared by both annotate and curate data
 */
/**
 * Update the annotations for a document and project
 * */
export const setAnnotationValue = (state: CurationDataState | AnnotationDataState, action:
    SetAnnotationValueAction): Function => {
    return {
        ...state,
        documents: {
            ...state.documents,
            [action.payload.projectID]: {
                ...state.documents[action.payload.projectID],
                [action.payload.documentID]: {
                    ...state.documents[action.payload.projectID][action.payload.documentID],
                    annotations: {
                        ...state.documents[action.payload.projectID][action.payload.documentID].annotations,
                        [action.payload.annotationID]: action.payload.annotation
                    },
                    interactionLog: {
                        ...state.documents[action.payload.projectID][action.payload.documentID]
                            .interactionLog,
                        firstInteractionTimestamp: state.documents[action.payload.projectID]
                            [action.payload.documentID].interactionLog?.firstInteractionTimestamp ?? Date.now()
                    }
                },
            },
        }
    };
}

export const mapDataToState: Function = (state: CurationDataState | AnnotationDataState,
                                         data: Array<CurationDocument | AnnotationDocument>) => {
    let intermediateState: CurationDataState | AnnotationDataState = {
        ...state
    };
    data.forEach((d: CurationDocument | AnnotationDocument) => {
        intermediateState = {
            ...intermediateState,
            ...{
                documents: {
                    ...intermediateState.documents,
                    [d.projectID]: {
                        ...intermediateState.documents[d.projectID],
                        [d.documentID]: {
                            // Above spread: will be overwritten by existing state
                            interactionLog: {},
                            isSending: false,
                            skipped: false,
                            validationErrors: [],
                            annotations: d.annotations ?? {},
                            ...intermediateState.documents[d.projectID]
                                ? intermediateState.documents[d.projectID][d.documentID] : {},
                            // below spread: new state overwrites existing state
                            documentData: d.documentData,
                            projectID: d.projectID,
                            documentID: d.documentID,
                            annotationResults: d.annotationResults ?? undefined,
                            annotationConditions: d.annotationConditions
                        },
                    },
                },
                documentOrder: {
                    ...intermediateState.documentOrder,
                    // This should keep insertion order, but have no duplicates
                    [d.projectID]: [...new Set(
                        intermediateState.documentOrder[d.projectID]?.concat([d.documentID]) ?? []
                    )]
                }
            },

        }
    });
    return intermediateState;
};



export const resetActiveDocument = (state: AnnotationDataState | CurationDataState, action: {
    ...Action,
    payload: ProjectID
}): Function => {
    // On active project switch, we need to remove the active document if not for the new project
    return (state.activeDocumentID &&
        !(state.documents[action.payload] && state.documents[action.payload][state.activeDocumentID])) ? {
        ...state,
        ...{
            activeDocumentID: ""
        }
    } : state;
};

export const setDocumentActive = (state: AnnotationDataState | CurationDataState, action: {|
    ...Action,
    payload: {|
        projectID: string,
        documentID: string
    |}
|}): Function => {
    return {
        ...state,
        ...{
            activeDocumentID: action.payload.documentID,
            documents: {
                ...state.documents,
                [action.payload.projectID]: {
                    ...state.documents[action.payload.projectID],
                    [action.payload.documentID]: {
                        ...state.documents[action.payload.projectID][action.payload.documentID],
                        interactionLog: {
                            firstShownTimestamp: Date.now()
                        }
                    },
                },
            }
        }
    };
};

export const deleteDocumentsForProject = (state: AnnotationDataState | CurationDataState, action: {|
    ...Action,
    payload: {|
        projectID: ProjectID
    |}
|}):
    Function => {
    let newActiveDocumentID = state.activeDocumentID;
    if(Object.keys(state.documents[action.payload.projectID] ?? {}).includes(state.activeDocumentID)) {
        // If we delete the active document, reset the activeDocumentID
        newActiveDocumentID = "";
    }
    return {
        ...state,
        activeDocumentID: newActiveDocumentID,
        documents: {
            ...state.documents,
            [action.payload.projectID]: {}
        },
        documentOrder: {
            ...state.documentOrder,
            [action.payload.projectID]: []
        }
    };
};

export const resetAnnotations = (state: AnnotationDataState | CurationDataState, action: {|
    ...Action,
    payload: {|
        projectID: ProjectID,
        documentID: DocumentID
    |}
|}):
    Function => {
    return {
        ...state,
        documents: {
            ...state.documents,
            [action.payload.projectID]: {
                ...state.documents[action.payload.projectID],
                [action.payload.documentID]: {
                    ...state.documents[action.payload.projectID][action.payload.documentID],
                    annotations: {}
                },
            }
        }
    };
};

export const skipDocument = (state: AnnotationDataState | CurationDataState, action: {|
    ...Action,
    payload: {|
        projectID: ProjectID,
        documentID: DocumentID
    |}
|}):
    Function => {
    return {
        ...state,
        documents: {
            ...state.documents,
            [action.payload.projectID]: {
                ...state.documents[action.payload.projectID],
                [action.payload.documentID]: {
                    ...state.documents[action.payload.projectID][action.payload.documentID],
                    skipped: true
                },
            }
        }
    };
};

export const startAnnotationResultStore = (state: AnnotationDataState | CurationDataState, action: {|
    ...Action,
    payload: PostAnnotationResult
|}): Function => {
    return {
        ...state,
        ...{
            documents: {
                ...state.documents,
                [action.payload.projectID]: {
                    ...state.documents[action.payload.projectID],
                    [action.payload.documentID]: {
                        ...state.documents[action.payload.projectID][action.payload.documentID],
                        isSending: true,
                        interactionLog: {
                            ...state.documents[action.payload.projectID][action.payload.documentID].interactionLog,
                            firstInteractionTimestamp: state.documents[action.payload.projectID]
                                [action.payload.documentID]?.interactionLog?.firstInteractionTimestamp ?? Date.now(),
                            lastInteractionTimestamp: Date.now()
                        }
                    },
                },
            }
        }
    }
}

const removeStoredAnnotations = (state: AnnotationDataState | CurationDataState,
                                 storeResponse: AnnotationResultStoreResponse): Function => {
    let intermediateState: AnnotationDataState | CurationDataState = {
        ...{},
        ...state,
        ...{
            documentOrder: {
                ...state.documentOrder,
                [storeResponse.projectID]: (state.documentOrder[storeResponse.projectID]?.filter(
                        (documentID: DocumentID) => documentID !== storeResponse.documentID
                ) ?? [])
            }
        }
    };
    if (intermediateState.documents[storeResponse.projectID]) {
        delete intermediateState.documents[storeResponse.projectID][storeResponse.documentID];
    }
    return intermediateState;
};

export const receiveAnnotationResultStored = (state: AnnotationDataState | CurationDataState, action: {|
    ...Action,
    payload: AnnotationResultStoreResponse
|}): Function => {
    if(action.payload.success) {
        return removeStoredAnnotations(state, action.payload);
    } else {
        return {
            ...state,
            ...{
                documents: {
                    ...state.documents,
                    [action.payload.projectID]: {
                        ...state.documents[action.payload.projectID],
                        [action.payload.documentID]: {
                            ...state.documents[action.payload.projectID][action.payload.documentID],
                            isSending: false,
                            validationErrors: action.payload.validationErrors
                        },
                    },
                }
            }
        }
    }
}

export const updateEnableConditions = (state: AnnotationDataState | CurationDataState, action: {|
    ...Action,
    payload: CheckEnableConditionResponse
|}): Function => {
    return {
        ...state,
        ...{
            documents: {
                ...state.documents,
                [action.payload.projectID]: {
                    ...state.documents[action.payload.projectID],
                    [action.payload.documentID]: {
                        ...state.documents[action.payload.projectID][action.payload.documentID],
                        annotationConditions: action.payload.annotationConditions
                    },
                },
            }
        }
    }
}
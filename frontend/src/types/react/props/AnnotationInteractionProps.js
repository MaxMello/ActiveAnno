// @flow
import type {AnnotationMap, DocumentID, ProjectID} from "../../Types";
import type {DenormalizedActionElement} from "../../project/layout/LayoutElement";
import type {ValidationError} from "../../annotate/ValidationError";

export type AnnotationInteractionProps = {|
    localize: Function,
    projectID: ProjectID,
    documentID: DocumentID,
    annotations: AnnotationMap,
    setAnnotationValue: Function,
    element: DenormalizedActionElement,
    keyValue: string,
    validationErrors: Array<ValidationError>,
    disabled: boolean
|};
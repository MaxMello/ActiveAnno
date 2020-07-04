// @flow
import type {TargetType} from "../../redux/annotate/annotationData";
import type {AnnotationID} from "../Types";

export type ValidationError = {
    annotationDefinitionID: AnnotationID,
    message: string,
    target: TargetType
}
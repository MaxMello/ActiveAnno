// @flow
import type {Dictionary} from "../types/Types";
import type {CaseBehavior as CaseBehaviorType} from "../types/annotationdefinition/AnnotationDefinition";

/**
 * CaseBehavior is how to process new open tag input values
 */
export const CaseBehavior: Dictionary<CaseBehaviorType, CaseBehaviorType> = {
    KEEP_ORIGINAL: "KEEP_ORIGINAL",
    TO_LOWER: "TO_LOWER",
    TO_UPPER: "TO_UPPER",
    CAPITALIZE: "CAPITALIZE"
};
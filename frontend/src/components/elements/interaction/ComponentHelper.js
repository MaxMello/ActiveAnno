// @flow
import type {
    OpenTagAnnotationDefinition,
    TagSetAnnotationDefinition
} from "../../../types/annotationdefinition/AnnotationDefinition";

export function checkDisableButton(currentValue: ?Array<string>, annotationDefinition: TagSetAnnotationDefinition,
                            optionID: string) {
    return ((annotationDefinition.maxNumberOfTags ?? Number.MAX_SAFE_INTEGER) > 1 && currentValue != null &&
        annotationDefinition.maxNumberOfTags === currentValue.length && !currentValue.includes(optionID));
}

export function createCaptionForTagInputs(annotationDefinition:
                                              TagSetAnnotationDefinition | OpenTagAnnotationDefinition,
                                          localize: Function): ?string {
    const isMultiSelect = (annotationDefinition.maxNumberOfTags ?? Number.MAX_SAFE_INTEGER) > 1;
    const isOptional = annotationDefinition.minNumberOfTags < 1;
    if (isMultiSelect && isOptional) {
        return `${localize('card.multiSelect')} ${annotationDefinition
            .maxNumberOfTags ? "(" + localize('card.maxAnswers') + ": " 
            + (annotationDefinition.maxNumberOfTags ?? "") + ")"
            : ""} - (${localize('card.optional')})`;
    } else if (isMultiSelect && !isOptional) {
        return `${localize('card.multiSelect')} ${annotationDefinition
            .maxNumberOfTags ? "(" + localize('card.maxAnswers') + ": "
            + (annotationDefinition.maxNumberOfTags ?? "") + ")" 
            : ""}`;
    } else if (!isMultiSelect && isOptional) {
        return `(${localize('card.optional')})`;
    } else {
        return null;
    }
}
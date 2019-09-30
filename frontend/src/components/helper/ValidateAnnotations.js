import type {
    AnnotationConfigFull,
    annotationID,
    Dictionary,
    DocumentToAnnotate,
} from "../../types/Types";
import {Target} from "../../redux/annotationData";
import {isArray} from "./HelperFunctions";

export type ValidationError = {
    message: string,
    target: string
}

/**
 * Validate document annotations based on annotation config
 */
export const validateAnnotations = (annotationConfig: AnnotationConfigFull, document: DocumentToAnnotate, localize: Function): Dictionary<annotationID, Array<ValidationError>> => {
    const validationErrors = {};
    Object.values(annotationConfig.annotations.annotationMap).forEach(annotation => {
        if (Object.values(annotation.targets).filter(t => t.type === Target.DOCUMENT).length !== 0) {
            // minNumberOfTags check for PredefinedTagSetAnnotation and OpenTagAnnotation
            if (annotation.minNumberOfTags > 0 && // If minNumberOfTags is not defined or not at least 1, don't use it as validation (equivalent to optional in that case)
                   (!document.documentAnnotations[annotation.id] || // if the min number is at least 1 and it is not defined, trigger as too little answers given
                    !isArray(document.documentAnnotations[annotation.id].value) || // if the actual value is not an array, can't check length so also trigger
                    document.documentAnnotations[annotation.id].value.length < annotation.minNumberOfTags) // Too little check
            ) {
                validationErrors[annotation.id] = [
                    ...validationErrors[annotation.id] ? validationErrors[annotation.id] : [],
                    {
                        "message": localize('error.tooLittleTags'),
                        "target": Target.DOCUMENT
                    }
                ];
            }
            // maxNumberOfTags check for PredefinedTagSetAnnotation and OpenTagAnnotation
            if (annotation.maxNumberOfTags > 0 && // If maxNumberOfTags is not defined or not at least 1, don't use it as validation
                document.documentAnnotations[annotation.id] && // To check for too many tags, there need to be at least some
                isArray(document.documentAnnotations[annotation.id].value) && // tags are always arrays, wo this is a check for actual values and that .length will succeed
                document.documentAnnotations[annotation.id].value.length > annotation.maxNumberOfTags) { // Too many tags
                validationErrors[annotation.id] = [
                    ...validationErrors[annotation.id] ? validationErrors[annotation.id] : [],
                    {
                        "message": localize('error.tooManyTags'),
                        "target": Target.DOCUMENT
                    }
                ];
            }
            // minLength is for OpenTextAnnotation
            if (annotation.minLength > 0 && // Min length needs to be at least 1 to trigger
                document.documentAnnotations[annotation.id] &&  // minLength is not responsible for exists check, so we only trigger if value is there
                typeof document.documentAnnotations[annotation.id].value === "string" && // make sure .length works
                document.documentAnnotations[annotation.id].value.length < annotation.minLength) { // actual length check
                validationErrors[annotation.id] = [
                    ...validationErrors[annotation.id] ? validationErrors[annotation.id] : [],
                    {
                        "message": localize('error.textTooShort'),
                        "target": Target.DOCUMENT
                    }
                ];
            }
            // maxLength is for OpenTextAnnotation
            if (annotation.maxLength > 0 &&
                document.documentAnnotations[annotation.id] &&  // maxLength is not responsible for exists check, so we only trigger if value is there
                typeof document.documentAnnotations[annotation.id].value === "string" && // make sure .length works
                document.documentAnnotations[annotation.id].value.length > annotation.maxLength) { // actual length check
                validationErrors[annotation.id] = [
                    ...validationErrors[annotation.id] ? validationErrors[annotation.id] : [],
                    {
                        "message": localize('error.textTooLong'),
                        "target": Target.DOCUMENT
                    }
                ];
            }
            // min is for ClosedNumberAnnotation
            if (annotation.min > 0 &&
                document.documentAnnotations[annotation.id] &&  // max is not responsible for exists check, so we only trigger if value is there
                typeof document.documentAnnotations[annotation.id].value === "number" && // make sure < makes sense
                document.documentAnnotations[annotation.id].value < annotation.min) {
                validationErrors[annotation.id] = [
                    ...validationErrors[annotation.id] ? validationErrors[annotation.id] : [],
                    {
                        "message": localize('error.textTooShort'),
                        "target": Target.DOCUMENT
                    }
                ];
            }
            if (annotation.max > 0 &&
                document.documentAnnotations[annotation.id] &&  // max is not responsible for exists check, so we only trigger if value is there
                typeof document.documentAnnotations[annotation.id].value === "number" && // make sure > makes sense
                document.documentAnnotations[annotation.id].value > annotation.max) {
                validationErrors[annotation.id] = [
                    ...validationErrors[annotation.id] ? validationErrors[annotation.id] : [],
                    {
                        "message": localize('error.numberTooLarge'),
                        "target": Target.DOCUMENT
                    }
                ];
            }
            if (annotation.step &&
                document.documentAnnotations[annotation.id] &&  // max is not responsible for exists check, so we only trigger if value is there
                typeof document.documentAnnotations[annotation.id].value === "number"){ // make sure % makes sense
                    // to make sure modulo works with decimal numbers, we need to increase them to be integers because of floating point errors
                    const stepAsString = annotation.step.toString();
                    const placesAfterDot = stepAsString.includes(".") ? stepAsString.substring(stepAsString.indexOf(".") + 1).length : 0;
                    const factor = 10**placesAfterDot; // example: 0.05 -> 0.05 * (10**2) = 5
                    if((document.documentAnnotations[annotation.id].value * factor) % (annotation.step * factor) !== 0) {
                        validationErrors[annotation.id] = [
                            ...validationErrors[annotation.id] ? validationErrors[annotation.id] : [],
                            {
                                "message": localize('error.numberNotOnStep'),
                                "target": Target.DOCUMENT
                            }
                        ];
                    }
            }
            if (annotation.optional === false && (!document.documentAnnotations[annotation.id] || document.documentAnnotations[annotation.id].value === undefined || document.documentAnnotations[annotation.id].value === null)) {
                validationErrors[annotation.id] = [
                    ...validationErrors[annotation.id] ? validationErrors[annotation.id] : [],
                    {
                        "message": localize('error.answerRequired'),
                        "target": Target.DOCUMENT
                    }
                ];
            }
        }
        if (Object.values(annotation.targets).filter(t => t.type === Target.SPAN).length !== 0) {
            if (annotation.minNumberOfTags > 0 && document.spanAnnotations[annotation.id].value.length < annotation.minNumberOfTags) {
                validationErrors[annotation.id] = [
                    ...validationErrors[annotation.id] ? validationErrors[annotation.id] : [],
                    {
                        "message": localize('error.tooLittleTags'),
                        "target": Target.SPAN
                    }
                ];
            }
            if (annotation.maxNumberOfTags > 0 && document.spanAnnotations[annotation.id].value.length > annotation.maxNumberOfTags) {
                validationErrors[annotation.id] = [
                    ...validationErrors[annotation.id] ? validationErrors[annotation.id] : [],
                    {
                        "message": localize('error.tooManyTags'),
                        "target": Target.SPAN
                    }
                ];
            }
            if (annotation.minLength > 0 && document.spanAnnotations[annotation.id].value.length < annotation.minLength) {
                validationErrors[annotation.id] = [
                    ...validationErrors[annotation.id] ? validationErrors[annotation.id] : [],
                    {
                        "message": localize('error.textTooShort'),
                        "target": Target.SPAN
                    }
                ];
            }
            if (annotation.maxLength > 0 && document.spanAnnotations[annotation.id].value.length > annotation.maxLength) {
                validationErrors[annotation.id] = [
                    ...validationErrors[annotation.id] ? validationErrors[annotation.id] : [],
                    {
                        "message": localize('error.textTooLong'),
                        "target": Target.SPAN
                    }
                ];
            }
            if (annotation.min > 0 && document.spanAnnotations[annotation.id].value < annotation.min) {
                validationErrors[annotation.id] = [
                    ...validationErrors[annotation.id] ? validationErrors[annotation.id] : [],
                    {
                        "message": localize('error.textTooShort'),
                        "target": Target.SPAN
                    }
                ];
            }
            if (annotation.max > 0 && document.spanAnnotations[annotation.id].value > annotation.max) {
                validationErrors[annotation.id] = [
                    ...validationErrors[annotation.id] ? validationErrors[annotation.id] : [],
                    {
                        "message": localize('error.numberTooLarge'),
                        "target": Target.SPAN
                    }
                ];
            }
            if (annotation.step && document.spanAnnotations[annotation.id].value % annotation.step !== 0) {
                validationErrors[annotation.id] = [
                    ...validationErrors[annotation.id] ? validationErrors[annotation.id] : [],
                    {
                        "message": localize('error.numberNotOnStep'),
                        "target": Target.SPAN
                    }
                ];
            }
            if (annotation.optional === false && (!document.spanAnnotations[annotation.id] || document.spanAnnotations[annotation.id].value === undefined || document.spanAnnotations[annotation.id].value === null)) {
                validationErrors[annotation.id] = [
                    ...validationErrors[annotation.id] ? validationErrors[annotation.id] : [],
                    {
                        "message": localize('error.answerRequired'),
                        "target": Target.SPAN
                    }
                ];
            }
        }
    });
    return validationErrors;
};
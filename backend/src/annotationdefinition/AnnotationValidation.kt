package annotationdefinition

import annotationdefinition.target.Target
import annotationdefinition.target.TargetType
import api.annotate.dto.ValidationError
import common.getMessageString
import document.annotation.AnnotationMap
import document.annotation.DocumentTargetAnnotation
import document.annotation.SpanTargetAnnotation
import document.annotation.SpanTargetSingleAnnotation
import java.util.*

internal fun AnnotationDefinition.commonCheck(annotations: AnnotationMap,
                                              optional: Boolean,
                                              target: Target,
                                              locale: Locale?): ValidationError? {
    return if (!optional && annotations[id] == null) {
        ValidationError(id, target.type, getMessageString("validationError.annotationMissing", locale))
    } else {
        null
    }
}

internal fun AnnotationDefinition.commonDocumentTargetAnnotationCheck(
    annotations: AnnotationMap,
    optional: Boolean,
    locale: Locale?
): ValidationError? {
    return if (!optional && annotations[id].let { it is DocumentTargetAnnotation && it.values.isEmpty() }) {
        ValidationError(id, TargetType.DOCUMENT_TARGET, getMessageString("validationError.annotationMissing", locale))
    } else if (!optional && annotations[id].let { it !is DocumentTargetAnnotation }) {
        ValidationError(id, TargetType.DOCUMENT_TARGET, getMessageString("validationError.targetMismatch.document", locale))
    } else {
        null
    }
}

internal fun AnnotationDefinition.commonSpanTargetAnnotationCheck(
    annotations: AnnotationMap,
    optional: Boolean,
    locale: Locale?
): ValidationError? {
    return if (!optional && annotations[id].let { annotation -> annotation is SpanTargetAnnotation
                && annotation.annotations.any { it.values.isEmpty() } }) {
        return ValidationError(id, TargetType.SPAN_TARGET, getMessageString("validationError.annotationMissing", locale))
    } else if (!optional && annotations[id].let { it !is SpanTargetAnnotation }) {
        return ValidationError(id, TargetType.SPAN_TARGET, getMessageString("validationError.targetMismatch.span", locale))
    } else {
        null
    }
}

/**
 * Apply a condition on all span target annotations for an annotation definition. Will only fail it the annotation actually exists.
 */
internal fun AnnotationDefinition.applyConditionOnAllSpanAnnotations(
    annotations: AnnotationMap,
    condition: (SpanTargetSingleAnnotation) -> Boolean
): Boolean {
    return annotations[id].let { annotation ->
        annotation === null || (annotation is SpanTargetAnnotation && annotation.annotations.all { condition(it) })
    }
}

/**
 * Apply a condition on a document target annotation. Will only fail it the annotation actually exists.
 */
internal fun AnnotationDefinition.applyConditionOnDocumentAnnotation(
    annotations: AnnotationMap,
    condition: (DocumentTargetAnnotation) -> Boolean
): Boolean {
    return annotations[id].let { annotation ->
        annotation === null || (annotation is DocumentTargetAnnotation && condition(annotation))
    }
}
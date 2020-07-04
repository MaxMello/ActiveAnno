// @flow
import React from "react";
import type {Dictionary} from "../../../types/Types";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core";
import InteractionComponentWrapper from "./InteractionComponentWrapper";
import type {AnnotationInteractionProps} from "../../../types/react/props/AnnotationInteractionProps";
import type {DenormalizedOpenTextInput} from "../../../types/project/layout/LayoutElement";
import type {OpenTextAnnotationDefinition} from "../../../types/annotationdefinition/AnnotationDefinition";
import type {DocumentTargetAnnotation} from "../../../types/document/annotation/Annotation";

type OpenTextInputProps = {
    ...AnnotationInteractionProps,
    documentData: Dictionary<string, any>
}

const useStyles = makeStyles(theme => ({
    defaultFormControl: theme.defaultFormControl,
    wrapper: {
        // display: "inline-block",
        position: "relative",
        overflow: "hidden !important",
        WebkitTextSizeAdjust: "none !important"
    },
    highlightWrapper: {
        position: "absolute !important",
        marginTop: 26,
        marginLeft: 14,
        marginRight: 14,
        overflowX: "hidden !important",
        overflowY: "auto !important"
    },
    highlights: {
        cursor: "text",
        fontSize: "1rem",
        boxSizing: "border-box",
        fontFamily: "Barlow, sans-serif",
        lineHeight: "1.1875em"
    },
    normalText: {
        color: "black"
    },
    diffText: {
        color: theme.palette.redTone.dark
    },
    textFieldDiffMode: {
        color: "transparent"
    },
}));

export default function OpenTextInput(props: OpenTextInputProps) {
    const classes = useStyles();
    const element: DenormalizedOpenTextInput = (props.element: any);
    const annotationDefinition: OpenTextAnnotationDefinition = element.annotationDefinition;
    const currentAnnotationValue: DocumentTargetAnnotation = (props.annotations[annotationDefinition.id]: any);
    const currentValue = currentAnnotationValue?.values[0]?.value ??
        (annotationDefinition.documentDataDefault ? props.documentData[annotationDefinition.documentDataDefault] : "");
    let helperText = (currentValue?.length ?? 0);
    if(annotationDefinition.maxLength) {
        helperText += "/" + annotationDefinition.maxLength;
    }
    if(annotationDefinition.minLength || annotationDefinition.optional) {
        helperText += " (";
    }
    if(annotationDefinition.minLength) {
        helperText += props.localize("card.minTextLength") + " " + annotationDefinition.minLength;
    }
    if(annotationDefinition.minLength && annotationDefinition.optional) {
        helperText += ", ";
    }
    if(annotationDefinition.optional) {
        helperText += props.localize("card.optional");
    }
    if(annotationDefinition.minLength || annotationDefinition.optional) {
        helperText += ")";
    }

    return <InteractionComponentWrapper name={annotationDefinition.name}
                                        caption={helperText}
                                        validationErrors={props.validationErrors}
                                        disabled={props.disabled}
                                        localize={props.localize}
                                        key={props.keyValue} keyValue={props.keyValue}>
        <div className={classes.wrapper}>
            <TextField
                key={`${props.keyValue}TextField`}
                multiline
                value={currentValue}
                disabled={props.disabled}
                onChange={(e) => {
                    if(!(annotationDefinition.maxLength && e.target.value.length > annotationDefinition.maxLength)) {
                        const newAnnotationValue: DocumentTargetAnnotation = {
                            target: "document",
                            values: [
                                {
                                    value: e.target.value
                                }
                            ]
                        }
                        props.setAnnotationValue(props.projectID, props.documentID,
                            annotationDefinition.id, newAnnotationValue);
                    }
                }}
                className={classes.defaultFormControl}
                InputProps={{
                    className: classes.normalText
                }}
                fullWidth
                margin="normal"
                variant="outlined"
            />
        </div>
    </InteractionComponentWrapper>;
}
import React from "react";
import type {AnnotationInteractionProps} from "../../../types/Types";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core";
import InteractionComponentWrapper from "./InteractionComponentWrapper";

type OpenTextInputProps = AnnotationInteractionProps & {
    documentText: string
}

const useStyles = makeStyles(theme => ({
    defaultFormControl: theme.defaultFormControl
}));

export default function OpenTextInput(props: OpenTextInputProps) {
    const classes = useStyles();
    const currentValue = props.annotations[props.element.referenceAnnotation] ? props.annotations[props.element.referenceAnnotation].value : (props.annotationConfig[props.element.referenceAnnotation].useDocumentTextAsDefault ? props.documentText : "");
    let helperText = (currentValue ? currentValue.length : 0);
    if(props.annotationConfig[props.element.referenceAnnotation].maxLength) {
        helperText += "/" + props.annotationConfig[props.element.referenceAnnotation].maxLength;
    }
    if(props.annotationConfig[props.element.referenceAnnotation].minLength || props.annotationConfig[props.element.referenceAnnotation].optional) {
        helperText += " (";
    }
    if(props.annotationConfig[props.element.referenceAnnotation].minLength) {
        helperText += props.localize("card.minTextLength") + " " + props.annotationConfig[props.element.referenceAnnotation].minLength;
    }
    if(props.annotationConfig[props.element.referenceAnnotation].minLength && props.annotationConfig[props.element.referenceAnnotation].optional) {
        helperText += ", ";
    }
    if(props.annotationConfig[props.element.referenceAnnotation].optional) {
        helperText += props.localize("card.optional");
    }
    if(props.annotationConfig[props.element.referenceAnnotation].minLength || props.annotationConfig[props.element.referenceAnnotation].optional) {
        helperText += ")";
    }

    return <InteractionComponentWrapper name={props.annotationConfig[props.element.referenceAnnotation].name}
                                        caption={helperText}
                                        validationErrors={props.validationErrors}
                                        key={props.keyValue} keyValue={props.keyValue}>
        <TextField
            key={`${props.keyValue}TextField`}
            multiline
            value={currentValue}
            onChange={(e) => {
                if(!(props.annotationConfig[props.element.referenceAnnotation].maxLength && e.target.value.length > props.annotationConfig[props.element.referenceAnnotation].maxLength)) {
                    props.setAnnotationValue(props.configID, props.documentID, props.element.referenceAnnotation, e.target.value); // TODO span
                }
            }}
            className={classes.defaultFormControl}
            fullWidth
            margin="normal"
            variant="outlined"
        />
    </InteractionComponentWrapper>;
}
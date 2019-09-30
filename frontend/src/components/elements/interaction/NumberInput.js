import {makeStyles} from "@material-ui/core";
import React from "react";
import type {AnnotationInteractionProps} from "../../../types/Types";
import TextField from "@material-ui/core/TextField";
import InteractionComponentWrapper from "./InteractionComponentWrapper";

const useStyles = makeStyles(theme => ({
    defaultFormControl: theme.defaultFormControl
}));

export default function NumberInput(props: AnnotationInteractionProps) {
    const classes = useStyles();
    const inputProps = {};
    let helperText = "";
    if(props.annotationConfig[props.element.referenceAnnotation].min !== null) {
        inputProps["min"] = props.annotationConfig[props.element.referenceAnnotation].min;
        if(props.annotationConfig[props.element.referenceAnnotation].max === null) {
            helperText += props.localize("card.minimum") + ": " + props.annotationConfig[props.element.referenceAnnotation].min;
        } else {
            helperText += props.annotationConfig[props.element.referenceAnnotation].min + "-";
        }
    }
    if(props.annotationConfig[props.element.referenceAnnotation].max !== null) {
        inputProps["max"] = props.annotationConfig[props.element.referenceAnnotation].max;
        if(props.annotationConfig[props.element.referenceAnnotation].min === null) {
            helperText += props.localize("card.maximum") + ": " + props.annotationConfig[props.element.referenceAnnotation].max;
        } else {
            helperText += props.annotationConfig[props.element.referenceAnnotation].max;
        }
    }
    if(props.annotationConfig[props.element.referenceAnnotation].step !== null) {
        inputProps["step"] = props.annotationConfig[props.element.referenceAnnotation].step;
        helperText += ", " + props.localize("card.steps") + ": " + props.annotationConfig[props.element.referenceAnnotation].step;
    }
    if(props.annotationConfig[props.element.referenceAnnotation].min !== null || props.annotationConfig[props.element.referenceAnnotation].max !== null || props.annotationConfig[props.element.referenceAnnotation].step !== null) {
        helperText += " ";
    }
    helperText += props.annotationConfig[props.element.referenceAnnotation].optional ? `(${props.localize("card.optional")})` : "";

    return <InteractionComponentWrapper name={props.annotationConfig[props.element.referenceAnnotation].name}
                                        caption={helperText}
                                        validationErrors={props.validationErrors}
                                        key={props.keyValue} keyValue={props.keyValue}>
        <TextField
            value={props.annotations[props.element.referenceAnnotation] &&
            props.annotations[props.element.referenceAnnotation].value !== undefined &&
            props.annotations[props.element.referenceAnnotation].value !== null ?
                props.annotations[props.element.referenceAnnotation].value : ""}
            onChange={(e) => {
                let newValue = e.target.value;
                if(newValue === "") {
                    newValue = undefined;
                } else if(props.annotationConfig[props.element.referenceAnnotation].min !== null && newValue < props.annotationConfig[props.element.referenceAnnotation].min) {
                    newValue = props.annotationConfig[props.element.referenceAnnotation].min;
                } else if(props.annotationConfig[props.element.referenceAnnotation].max !== null && newValue > props.annotationConfig[props.element.referenceAnnotation].max) {
                    newValue = props.annotationConfig[props.element.referenceAnnotation].max;
                }
                props.setAnnotationValue(props.configID, props.documentID, props.element.referenceAnnotation, newValue); // TODO span
            }}
            onBlur={() => {
                if(props.annotationConfig[props.element.referenceAnnotation].step !== null
                    && props.annotations[props.element.referenceAnnotation]
                    && props.annotations[props.element.referenceAnnotation].value !== undefined
                    && props.annotations[props.element.referenceAnnotation] % props.annotationConfig[props.element.referenceAnnotation].step !== 0) {
                    const fixedValue = props.annotations[props.element.referenceAnnotation].value - (props.annotations[props.element.referenceAnnotation].value % props.annotationConfig[props.element.referenceAnnotation].step);
                    props.setAnnotationValue(props.configID, props.documentID, props.element.referenceAnnotation, fixedValue); // TODO span
                }
            }}
            type="number"
            inputProps={inputProps}
            className={classes.defaultFormControl}
            fullWidth
            margin="normal"
            variant="outlined"
        />
    </InteractionComponentWrapper>;
}
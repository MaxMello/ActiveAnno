// @flow
import {makeStyles} from "@material-ui/core";
import React from "react";
import TextField from "@material-ui/core/TextField";
import InteractionComponentWrapper from "./InteractionComponentWrapper";
import type {AnnotationInteractionProps} from "../../../types/react/props/AnnotationInteractionProps";
import type {DenormalizedOpenNumberInput,} from "../../../types/project/layout/LayoutElement";
import type {OpenNumberAnnotationDefinition,} from "../../../types/annotationdefinition/AnnotationDefinition";
import type {DocumentTargetAnnotation} from "../../../types/document/annotation/Annotation";

const useStyles = makeStyles(theme => ({
    defaultFormControl: theme.defaultFormControl
}));

export default function OpenNumberInput(props: AnnotationInteractionProps) {
    const classes = useStyles();
    const inputProps = {};
    const element: DenormalizedOpenNumberInput = (props.element: any);
    const annotationDefinition: OpenNumberAnnotationDefinition = element.annotationDefinition;
    const currentAnnotationValue: DocumentTargetAnnotation = (props.annotations[annotationDefinition.id]: any);
    const currentValue = currentAnnotationValue?.values[0]?.value ?? "";

    let helperText = "";
    if(annotationDefinition.step !== null) {
        inputProps["step"] = annotationDefinition.step;
        helperText += ", " + props.localize("card.steps") + ": " + (annotationDefinition.step ?? "");
    }
    if(annotationDefinition.step !== null) {
        helperText += " ";
    }
    helperText += annotationDefinition.optional ? `(${props.localize("card.optional")})` : "";

    return <InteractionComponentWrapper name={annotationDefinition.name}
                                        caption={helperText}
                                        validationErrors={props.validationErrors}
                                        disabled={props.disabled}
                                        localize={props.localize}
                                        key={props.keyValue} keyValue={props.keyValue}>
        <TextField
            value={currentValue}
            onChange={(e) => {
                let newValue = e.target.value;
                if(newValue === "") {
                    newValue = undefined;
                }
                props.setAnnotationValue(props.projectID, props.documentID,
                    annotationDefinition.id, newValue);
            }}
            onBlur={() => {
                if(annotationDefinition.step != null && (currentValue % annotationDefinition.step) !== 0) {
                    const fixedValue = currentValue - (currentValue % annotationDefinition.step);
                    props.setAnnotationValue(props.projectID, props.documentID, annotationDefinition.id, fixedValue);
                }
            }}
            type="number"
            disabled={props.disabled}
            inputProps={inputProps}
            className={classes.defaultFormControl}
            fullWidth
            margin="normal"
            variant="outlined"
        />
    </InteractionComponentWrapper>;
}
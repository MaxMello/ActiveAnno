import {makeStyles} from "@material-ui/core";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import React from "react";
import type {AnnotationInteractionProps} from "../../../types/Types";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
import InteractionComponentWrapper from "./InteractionComponentWrapper";

const useStyles = makeStyles(theme => ({
    buttonGroup: theme.defaultFullWidthButtonGroup,
    toggleButton: theme.defaultFullWidthToggleButton,
    toggleButtonSelected: theme.defaultToggleButtonSelected,
    buttonLabel: {
        padding: theme.spacing(1),
        userSelect: 'none'
    },
}));

export default function BooleanButtonGroup(props: AnnotationInteractionProps) {
    const classes = useStyles();

    return <InteractionComponentWrapper name={props.annotationConfig[props.element.referenceAnnotation].name}
                                        caption={props.annotationConfig[props.element.referenceAnnotation].optional ? `(${props.localize("card.optional")})` : ""}
                                        validationErrors={props.validationErrors}
                                        key={props.keyValue} keyValue={props.keyValue}>
        <ToggleButtonGroup value={props.annotations[props.element.referenceAnnotation] ? props.annotations[props.element.referenceAnnotation].value : undefined}
                           exclusive
                           className={classes.buttonGroup}
                           onChange={(_, newValue) => {
                               if ((props.annotations[props.element.referenceAnnotation] && props.annotations[props.element.referenceAnnotation].value === newValue) || newValue === null) {
                                   props.setAnnotationValue(props.configID, props.documentID, props.element.referenceAnnotation, undefined); // TODO span
                               } else {
                                   props.setAnnotationValue(props.configID, props.documentID, props.element.referenceAnnotation, newValue); // TODO span
                               }
                           }
                           }
                           key={`${props.keyValue}ToggleButtonGroup`}>
            <ToggleButton value={true} className={classes.toggleButton}
                          classes={{selected: classes.toggleButtonSelected}}>
                <Check/>
                {props.localize('yes')}
            </ToggleButton>
            <ToggleButton value={false} className={classes.toggleButton}
                          classes={{selected: classes.toggleButtonSelected}}>
                <Close/>
                {props.localize('no')}
            </ToggleButton>
        </ToggleButtonGroup>
    </InteractionComponentWrapper>;
}
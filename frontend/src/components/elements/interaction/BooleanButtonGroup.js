// @flow
import {makeStyles} from "@material-ui/core";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import React from "react";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
import InteractionComponentWrapper from "./InteractionComponentWrapper";
import {ButtonSizes} from "../../../constants/ButtonSizes";
import {ButtonColors} from "../../../constants/ButtonColors";
import {colorButtonClasses} from "../colorButtonClasses";
import type {AnnotationInteractionProps} from "../../../types/react/props/AnnotationInteractionProps";
import type {DenormalizedBooleanButtonGroup} from "../../../types/project/layout/LayoutElement";
import type {BooleanAnnotationDefinition} from "../../../types/annotationdefinition/AnnotationDefinition";
import type {DocumentTargetAnnotation} from "../../../types/document/annotation/Annotation";

const useStyles = makeStyles(theme => ({
    ...theme.buttons,
    buttonGroup: theme.defaultFullWidthButtonGroup,
    buttonLabel: {
        padding: theme.spacing(1),
        userSelect: 'none'
    },
}));

export default function BooleanButtonGroup(props: AnnotationInteractionProps) {
    const classes = useStyles();
    const element: DenormalizedBooleanButtonGroup = (props.element: any);
    const annotationDefinition: BooleanAnnotationDefinition = element.annotationDefinition;
    const currentAnnotationValue: DocumentTargetAnnotation = (props.annotations[annotationDefinition.id]: any);
    const currentValue = currentAnnotationValue?.values[0]?.value ?? undefined;
    const buttonSize = ButtonSizes[element.buttonSize ?? "MEDIUM"] ?? ButtonSizes.MEDIUM;
    const buttonColorTrue = ButtonColors[element.buttonColorTrue ?? "GREEN_TONE"] ?? ButtonColors.GREEN_TONE;
    const buttonColorFalse = ButtonColors[element.buttonColorFalse ?? "RED_TONE"] ?? ButtonColors.RED_TONE;

    return <InteractionComponentWrapper name={annotationDefinition.name}
                                        caption={annotationDefinition.optional ? `(${props.localize("card.optional")})`
                                            : ""}
                                        validationErrors={props.validationErrors}
                                        disabled={props.disabled}
                                        localize={props.localize}
                                        key={props.keyValue} keyValue={props.keyValue}>
        <ToggleButtonGroup value={currentValue}
                           exclusive
                           size={buttonSize}
                           className={classes.buttonGroup}
                           onChange={(_, newValue?: boolean) => {
                               if (currentValue === newValue /* toggle */ || newValue === null) {
                                   props.setAnnotationValue(props.projectID, props.documentID,
                                       annotationDefinition.id, undefined);
                               } else {
                                   // newValue not null
                                   const newAnnotationValue: DocumentTargetAnnotation = {
                                       target: "document",
                                       values: [{
                                           value: newValue
                                       }]
                                   }
                                   props.setAnnotationValue(props.projectID, props.documentID, annotationDefinition.id,
                                       newAnnotationValue);
                               }
                           }
                           }
                           key={`${props.keyValue}BooleanButtonGroup`}>
            <ToggleButton value={true}
                          disabled={props.disabled}
                          classes={colorButtonClasses(classes,buttonColorTrue, true)}>
                <Check/>
                {props.localize('yes')}
            </ToggleButton>
            <ToggleButton value={false}
                          disabled={props.disabled}
                          classes={colorButtonClasses(classes,buttonColorFalse, true)}>
                <Close/>
                {props.localize('no')}
            </ToggleButton>
        </ToggleButtonGroup>
    </InteractionComponentWrapper>;
}
// @flow
import {makeStyles} from "@material-ui/core";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import React from "react";
import {isArray} from "../../helper/HelperFunctions";
import InteractionComponentWrapper from "./InteractionComponentWrapper";
import {ButtonSizes} from "../../../constants/ButtonSizes";
import {ButtonColors} from "../../../constants/ButtonColors";
import {colorButtonClasses} from "../colorButtonClasses";
import type {AnnotationInteractionProps} from "../../../types/react/props/AnnotationInteractionProps";
import type {DenormalizedTagSetButtonGroup} from "../../../types/project/layout/LayoutElement";
import type {TagSetAnnotationDefinition} from "../../../types/annotationdefinition/AnnotationDefinition";
import type {DocumentTargetAnnotation} from "../../../types/document/annotation/Annotation";
import {checkDisableButton, createCaptionForTagInputs} from "./ComponentHelper";

const useStyles = makeStyles(theme => ({
    ...theme.buttons,
    buttonGroup: theme.defaultButtonGroup
}));


export default function TagSetButtonGroup(props: AnnotationInteractionProps) {
    const classes = useStyles();
    const element: DenormalizedTagSetButtonGroup = (props.element: any);
    const annotationDefinition: TagSetAnnotationDefinition = element.annotationDefinition;
    const currentAnnotationValue: DocumentTargetAnnotation = (props.annotations[annotationDefinition.id]: any);
    const currentValue = currentAnnotationValue?.values?.map(val => {
        return val.value
    }) ?? undefined;
    const buttonSize = ButtonSizes[element.buttonSize ?? "MEDIUM"] ?? ButtonSizes.MEDIUM;
    return <InteractionComponentWrapper name={annotationDefinition.name}
                                        caption={createCaptionForTagInputs(annotationDefinition, props.localize) ?? ""}
                                        validationErrors={props.validationErrors}
                                        disabled={props.disabled}
                                        localize={props.localize}
                                        key={props.keyValue} keyValue={props.keyValue}>
        <ToggleButtonGroup value={currentValue}
                           className={classes.buttonGroup}
                           exclusive={annotationDefinition.maxNumberOfTags === 1}
                           size={buttonSize}
                           onChange={(_, newValue) => {
                               /* Documentation:
                               value: of the selected buttons. When exclusive is true this is a single value; when false
                                an array of selected values. If no value is selected and exclusive is true the value is
                                null; when false an empty array.
                                */
                               let newValueArray;
                               if (newValue === null) {
                                   newValueArray = []; // make null to an array instead
                               } else if (!isArray(newValue)) {
                                   newValueArray = [newValue];   // make single value to an array instead
                               } else {
                                   newValueArray = newValue;
                               }
                               if (!(newValueArray.length >
                                   (annotationDefinition?.maxNumberOfTags ?? Number.MAX_SAFE_INTEGER))) {
                                   const newAnnotationValue: DocumentTargetAnnotation = {
                                       target: "document",
                                       values: newValueArray.map(val => {
                                           return {
                                               value: val
                                           }
                                       })
                                   }
                                   // Only allow setting of new value if limit not reached
                                   props.setAnnotationValue(props.projectID, props.documentID,
                                       annotationDefinition.id, newAnnotationValue);
                               }
                           }}
                           key={`${props.keyValue}ToggleButtonGroup`}>
            {annotationDefinition.options.map((opt, index) => {
                return <ToggleButton value={opt.id}
                                     classes={colorButtonClasses(classes,
                                         ButtonColors[element.buttonColors?.[opt.id]] ?? ButtonColors.PRIMARY,
                                         false)}
                disabled={props.disabled || checkDisableButton(currentValue, annotationDefinition, opt.id)}
                                     key={`${props.keyValue}ToggleButton${index}`}>
                    {opt.name}
                </ToggleButton>;
            })
            }
        </ToggleButtonGroup>
    </InteractionComponentWrapper>;
}
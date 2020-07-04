// @flow
import {makeStyles} from "@material-ui/core";
import React from "react";
import {CaseBehavior} from "../../../constants/CaseBehavior";
import InteractionComponentWrapper from "./InteractionComponentWrapper";
import type {AnnotationInteractionProps} from "../../../types/react/props/AnnotationInteractionProps";
import type {DenormalizedOpenTagChipInput} from "../../../types/project/layout/LayoutElement";
import type {OpenTagAnnotationDefinition} from "../../../types/annotationdefinition/AnnotationDefinition";
import type {DocumentTargetAnnotation} from "../../../types/document/annotation/Annotation";
import {createCaptionForTagInputs} from "./ComponentHelper";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles(theme => ({
    defaultFormControl: theme.defaultFormControl
}));

function applyCaseBehavior(behavior, chipText: string): string {
    if(behavior === CaseBehavior.KEEP_ORIGINAL) {
        return chipText;
    } else if(behavior === CaseBehavior.TO_LOWER) {
        return chipText.toLowerCase();
    } else if(behavior === CaseBehavior.TO_UPPER) {
        return chipText.toUpperCase();
    } else if(behavior === CaseBehavior.CAPITALIZE) {
        return chipText.length > 0 ? chipText.charAt(0).toUpperCase() + chipText.slice(1) : chipText;
    } else {
        return chipText;
    }
}

/**
 * Interaction type that accepts potentially multiple open input texts, but with predefined tags as suggestions to
 * reduce too similar but different tags.
 * NOTE: This component uses an additional library that still needs an old version of material UI, if that is ever
 * updated, please migrate and remove the
 * <MuiThemeProvider> wrapper as well as the dependency to the old version of material ui.
 */
export default function OpenTagInput(props: AnnotationInteractionProps) {
    const classes = useStyles();
    const element: DenormalizedOpenTagChipInput = (props.element: any);
    const annotationDefinition: OpenTagAnnotationDefinition = element.annotationDefinition;
    const currentAnnotationValue: DocumentTargetAnnotation = (props.annotations[annotationDefinition.id]: any);
    let currentValue = currentAnnotationValue?.values?.map(val => {
        return val.value
    }) ?? [];

    return <InteractionComponentWrapper name={annotationDefinition.name}
                                        caption={createCaptionForTagInputs(annotationDefinition, props.localize) ?? ""}
                                        validationErrors={props.validationErrors}
                                        disabled={props.disabled}
                                        localize={props.localize}
                                        key={props.keyValue} keyValue={props.keyValue}>
        <Autocomplete
            key={`${props.keyValue}Select`}
            fullWidth
            autoComplete={true}
            freeSolo={true}
            value={currentValue}
            multiple={true}
            options={annotationDefinition.predefinedTags}
            disableCloseOnSelect={false}
            disabled={props.disabled}
            className={classes.defaultFormControl}
            autoHighlight={false}
            autoSelect={true}
            getOptionLabel={(option: string) => {
                return option
            }}
            onChange={(_, value: Array<string>) => {
                let newValueArray: Array<string>;
                if(value == null) {
                    newValueArray = [];
                } else {
                    newValueArray = value;
                }
                newValueArray = newValueArray.map(v => applyCaseBehavior(annotationDefinition.caseBehavior, v.trim()));
                // Remove duplicates after case behavior
                newValueArray = [...new Set(newValueArray)];
                if (!(newValueArray.length > (annotationDefinition.maxNumberOfTags ?? Number.MAX_SAFE_INTEGER))) {
                    // Only allow setting of new value if limit not reached
                    const newAnnotationValue: DocumentTargetAnnotation = {
                        target: "document",
                        values: newValueArray.map((val: string) => {
                            return {
                                value: val
                            }
                        })
                    }
                    props.setAnnotationValue(props.projectID, props.documentID,
                        annotationDefinition.id, newAnnotationValue);
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                />
            )}
        />
    </InteractionComponentWrapper>;
}
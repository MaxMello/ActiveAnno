// @flow
import {makeStyles} from "@material-ui/core";
import React from "react";
import {isArray} from "../../helper/HelperFunctions";
import InteractionComponentWrapper from "./InteractionComponentWrapper";
import type {AnnotationInteractionProps} from "../../../types/react/props/AnnotationInteractionProps";
import type {TagSetAnnotationDefinition} from "../../../types/annotationdefinition/AnnotationDefinition";
import {checkDisableButton, createCaptionForTagInputs} from "./ComponentHelper";
import type {DenormalizedTagSetButtonGroup} from "../../../types/project/layout/LayoutElement";
import type {DocumentTargetAnnotation} from "../../../types/document/annotation/Annotation";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";


const useStyles = makeStyles(theme => ({
    defaultFormControl: theme.defaultFormControl,
}));


export default function DropdownInput(props: AnnotationInteractionProps) {
    const classes = useStyles();
    const element: DenormalizedTagSetButtonGroup = (props.element: any);
    const annotationDefinition: TagSetAnnotationDefinition = element.annotationDefinition;
    const currentAnnotationValue: DocumentTargetAnnotation = (props.annotations[annotationDefinition.id]: any);
    const currentValue = currentAnnotationValue?.values?.map(val => {
        return val.value
    }) ?? [];
    const multiple = (annotationDefinition?.maxNumberOfTags ?? 0) > 1;
    const inputOptions = annotationDefinition.options.map(o => o.id);
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
            value={multiple ? currentValue : (currentValue[0] ?? null)}
            multiple={multiple}
            options={inputOptions}
            disableCloseOnSelect={multiple}
            clearOnBlur={false}
            className={classes.defaultFormControl}
            disabled={props.disabled}
            autoHighlight={false}
            autoSelect={false}
            getOptionLabel={(option: string) => {
                return annotationDefinition.options.find(it => it.id === option)?.name ?? ""
            }}
            getOptionDisabled={(option: string) => {
                return checkDisableButton(currentValue, annotationDefinition, option)
            }}
            onChange={(_, value: any) => {
                let newValueArray: Array<string>;
                if(value == null) {
                    newValueArray = [];
                } else if(!isArray(value)) {
                    newValueArray = [value];
                } else {
                    newValueArray = value;
                }
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
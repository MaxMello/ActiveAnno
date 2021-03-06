// @flow
import {makeStyles} from "@material-ui/core";
import React from "react";
import Slider from "@material-ui/core/Slider";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import InteractionComponentWrapper from "./InteractionComponentWrapper";
import type {AnnotationInteractionProps} from "../../../types/react/props/AnnotationInteractionProps";
import type {DenormalizedNumberRangeSlider} from "../../../types/project/layout/LayoutElement";
import type {NumberRangeAnnotationDefinition} from "../../../types/annotationdefinition/AnnotationDefinition";
import type {DocumentTargetAnnotation} from "../../../types/document/annotation/Annotation";

const useStyles = makeStyles(theme => ({
    slider: {
        flexGrow: 1,
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    sliderBox: {
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        marginTop: theme.spacing(2)
    },
    removeValue: {
        alignSelf: 'center',
        bottom: 10,
        right: 5
    },
    removeValueIcon: {
        fontSize: '1rem'
    }
}));

export default function NumberRangeSlider(props: AnnotationInteractionProps) {
    const classes = useStyles();
    const element: DenormalizedNumberRangeSlider = (props.element: any);
    const annotationDefinition: NumberRangeAnnotationDefinition = element.annotationDefinition;
    const currentAnnotationValue: DocumentTargetAnnotation = (props.annotations[annotationDefinition.id]: any);
    const currentValue = currentAnnotationValue?.values?.map(val => {
        return val.value
    }) ?? [null, null];
    const marks = [{
        value: annotationDefinition.min,
        label: annotationDefinition.min
        },
        {
            value: annotationDefinition.max,
            label: annotationDefinition.max
        }];
    const addedValues = [annotationDefinition.min, annotationDefinition.max];
    currentValue.forEach((e) => {
        if(typeof e === 'number' && !(addedValues.includes(e))) {
            marks.push({
                value: e,
                label: e
            });
            addedValues.push(e);
        }
    });
    // There will be a warning about invalid prop type in development mode. because of the empty string,
    // but only this way can the slider be reset correctly visually.
    return <InteractionComponentWrapper name={annotationDefinition.name}
                                        caption={annotationDefinition.optional ?
                                            `(${props.localize("card.optional")})` : ""}
                                        validationErrors={props.validationErrors}
                                        disabled={props.disabled}
                                        localize={props.localize}
                                        key={props.keyValue} keyValue={props.keyValue}>
        <Box display={"flex"} className={classes.sliderBox} key={`${props.keyValue}SliderBox`}>
            <Slider
                value={currentValue}
                onChange={(_, newValue) => {
                    const newAnnotationValue: DocumentTargetAnnotation = {
                        target: "document",
                        values: newValue.map(val => {
                            return {
                                value: val
                            }
                        })
                    }
                    props.setAnnotationValue(props.projectID, props.documentID, annotationDefinition.id,
                        newAnnotationValue);
                }}
                classes={{root: classes.slider}}
                disabled={props.disabled}
                valueLabelDisplay="off"
                step={annotationDefinition.step}
                marks={marks}
                min={annotationDefinition.min}
                max={annotationDefinition.max}
            />
            <IconButton disabled={props.disabled} color="primary" size={"small"}
                        className={classes.removeValue} onClick={() => {
                props.setAnnotationValue(props.projectID, props.documentID, annotationDefinition.id, undefined);
            }}>
                <Close className={classes.removeValueIcon}/>
            </IconButton>
        </Box>
    </InteractionComponentWrapper>;
}
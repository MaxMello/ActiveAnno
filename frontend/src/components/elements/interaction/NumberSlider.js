import {makeStyles} from "@material-ui/core";
import React from "react";
import type {AnnotationInteractionProps} from "../../../types/Types";
import Slider from "@material-ui/lab/Slider";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import {isArray} from "../../helper/HelperFunctions";
import InteractionComponentWrapper from "./InteractionComponentWrapper";

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

type NumberSliderProps = AnnotationInteractionProps & {
    isRange: boolean
}

export default function NumberSlider(props: NumberSliderProps) {
    const classes = useStyles();
    const marks = [{
        value: props.annotationConfig[props.element.referenceAnnotation].min,
        label: props.annotationConfig[props.element.referenceAnnotation].min
        },
        {
            value: props.annotationConfig[props.element.referenceAnnotation].max,
            label: props.annotationConfig[props.element.referenceAnnotation].max
        }];
    const sliderValue = props.annotations[props.element.referenceAnnotation] && props.annotations[props.element.referenceAnnotation].value !== undefined ? props.annotations[props.element.referenceAnnotation].value : (props.isRange ? [null, null] : "");
    const addedValues = [props.annotationConfig[props.element.referenceAnnotation].min, props.annotationConfig[props.element.referenceAnnotation].max];
    if(isArray(sliderValue)) {
        sliderValue.forEach((e) => {
            if(typeof e === 'number' && !(addedValues.includes(e))) {
                marks.push({
                    value: e,
                    label: e
                });
                addedValues.push(e);
            }
        });
    } else if(typeof sliderValue === 'number' && !(addedValues.includes(sliderValue))) {
        marks.push({
            value: sliderValue,
            label: sliderValue
        })
    }
    // There will be a warning about invalid prop type in development mode. because of the empty string, but only this way can the slider be reset correctly visually.
    return <InteractionComponentWrapper name={props.annotationConfig[props.element.referenceAnnotation].name}
                                        caption={props.annotationConfig[props.element.referenceAnnotation].optional ? `(${props.localize("card.optional")})` : ""}
                                        validationErrors={props.validationErrors}
                                        key={props.keyValue} keyValue={props.keyValue}>
        <Box display={"flex"} className={classes.sliderBox} key={`${props.keyValue}SliderBox`}>
            <Slider
                value={sliderValue}
                onChange={(_, newValue) => {
                    props.setAnnotationValue(props.configID, props.documentID, props.element.referenceAnnotation, newValue); // TODO span
                }}
                classes={{root: classes.slider}}
                valueLabelDisplay="off"
                step={props.annotationConfig[props.element.referenceAnnotation].step}
                marks={marks}
                min={props.annotationConfig[props.element.referenceAnnotation].min}
                max={props.annotationConfig[props.element.referenceAnnotation].max}
            />
            <IconButton color="primary" size={"small"} className={classes.removeValue} onClick={() => {
                props.setAnnotationValue(props.configID, props.documentID, props.element.referenceAnnotation, undefined); // TODO span
            }}>
                <Close className={classes.removeValueIcon}/>
            </IconButton>
        </Box>
    </InteractionComponentWrapper>;
}
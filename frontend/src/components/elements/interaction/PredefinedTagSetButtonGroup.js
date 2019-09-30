import {makeStyles} from "@material-ui/core";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import React from "react";
import { grey } from '@material-ui/core/colors';
import color from 'color';
import type {
    AnnotationInteractionProps,
    Annotations,
    Dictionary
} from "../../../types/Types";
import {isArray} from "../../helper/HelperFunctions";
import InteractionComponentWrapper from "./InteractionComponentWrapper";

const useStyles = makeStyles(theme => ({
    buttonGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        userSelect: 'none',
        backgroundColor: 'transparent'
    },
    toggleButton: {
        color: `${theme.palette.secondary.main} !important`,
        backgroundColor: grey[100],
        border: '0 !important',
        paddingTop: theme.spacing(0.75),
        paddingBottom: theme.spacing(0.75),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        height: 'inherit !important',
        margin: theme.spacing(0.5),
        '&:hover':{
            backgroundColor: grey[200],
            marginLeft: '4px !important',
            marginRight: '4px !important'
        },
        '&:not(:first-child)': {
            marginLeft: '4px !important',
            marginRight: '4px !important'
        },
        [theme.breakpoints.down('xs')]: {
            width: '100% !important',
        }
    },
    toggleButtonSelected: {
        color: `${theme.palette.secondary.main} !important`,
        backgroundColor: `${color(theme.palette.secondary.light).lighten(0.95).hex()} !important`
    },
    toggleButtonDisabled: {
        color: 'rgba(0, 0, 0, 0.12) !important'
    }
}));

function checkDisableButton(annotations: Dictionary<string, any>, annotationConfig: Annotations, referenceAnnotation: string, optionID) {
    return (annotations[referenceAnnotation] &&
        annotationConfig[referenceAnnotation].maxNumberOfTags > 1 &&
        annotationConfig[referenceAnnotation].maxNumberOfTags === annotations[referenceAnnotation].value.length &&
        !annotations[referenceAnnotation].value.includes(optionID));
}

function createCaption(annotationConfig: Annotations, referenceAnnotation: string, localize: Function): string {
    const isMultiSelect = annotationConfig[referenceAnnotation].maxNumberOfTags > 1;
    const isOptional = annotationConfig[referenceAnnotation].minNumberOfTags < 1;
    if(isMultiSelect && isOptional) {
        return `${localize('card.multiSelect')} (${localize('card.maxAnswers')}: ${annotationConfig[referenceAnnotation].maxNumberOfTags}) - (${localize('card.optional')})`;
    } else if(isMultiSelect && !isOptional) {
        return `${localize('card.multiSelect')} (${localize('card.maxAnswers')}: ${annotationConfig[referenceAnnotation].maxNumberOfTags})`;
    } else if(!isMultiSelect && isOptional) {
        return `(${localize('card.optional')})`;
    } else {
        return null;
    }
}

export default function PredefinedTagSetButtonGroup(props: AnnotationInteractionProps) {
    const classes = useStyles();
    return  <InteractionComponentWrapper name={props.annotationConfig[props.element.referenceAnnotation].name}
                                         caption={createCaption(props.annotationConfig, props.element.referenceAnnotation, props.localize)}
                                         validationErrors={props.validationErrors}
                                         key={props.keyValue} keyValue={props.keyValue}>
        <ToggleButtonGroup value={props.annotations[props.element.referenceAnnotation] ? props.annotations[props.element.referenceAnnotation].value : undefined}
                           className={classes.buttonGroup}
                           exclusive={props.annotationConfig[props.element.referenceAnnotation].maxNumberOfTags === 1}
                           onChange={(_, newValue) => {
                               if(!isArray(newValue)) {
                                   newValue = [newValue];
                               }
                               if((props.annotations[props.element.referenceAnnotation] && props.annotations[props.element.referenceAnnotation].value === newValue) || newValue === null) {
                                   // Only triggers if exclusive true, as the result will be a single value, not an array
                                   props.setAnnotationValue(props.configID, props.documentID, props.element.referenceAnnotation, undefined); // TODO span
                               } else if(!(newValue && (newValue.length > props.annotationConfig[props.element.referenceAnnotation].maxNumberOfTags))) {
                                   // Only allow setting of new value if limit not reached
                                   // For multi select, deselection works automatically here, no need to check identity between existing and new value
                                   props.setAnnotationValue(props.configID, props.documentID, props.element.referenceAnnotation, newValue); // TODO span
                               }
                           }}
                           key={`${props.keyValue}ToggleButtonGroup`}>
            {props.annotationConfig[props.element.referenceAnnotation].options.map((opt, index) => {
                return <ToggleButton value={opt.id} className={classes.toggleButton}
                                     classes={{selected: classes.toggleButtonSelected, disabled: classes.toggleButtonDisabled}}
                                     disabled={props.target === null || checkDisableButton(props.annotations, props.annotationConfig, props.element.referenceAnnotation, opt.id)}
                                     key={`${props.keyValue}ToggleButton${index}`}>
                    {opt.name}
                </ToggleButton>;
            })
            }
        </ToggleButtonGroup>
    </InteractionComponentWrapper>;
}
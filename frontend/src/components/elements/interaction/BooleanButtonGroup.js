import {makeStyles} from "@material-ui/core";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import React from "react";
import {grey} from '@material-ui/core/colors';
import color from 'color';
import type {AnnotationInteractionProps} from "../../../types/Types";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
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
        '&:hover': {
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
    interactionCaption: theme.interactionCaption,
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
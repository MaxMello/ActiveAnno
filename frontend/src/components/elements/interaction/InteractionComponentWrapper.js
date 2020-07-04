// @flow
import React from "react";
import {makeStyles, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import type {ValidationError} from "../../../types/annotate/ValidationError";

type InteractionComponentProps = {
    localize: Function,
    name: string,
    caption: string,
    keyValue: string,
    children: any,
    validationErrors: Array<ValidationError>,
    disabled: boolean
}

const useStyles = makeStyles(theme => ({
    interactionHeader: theme.interactionHeader,
    disabledInteractionHeader: {
        ...theme.interactionHeader,
        color: theme.palette.default.light
    },
    interactionCaption: theme.interactionCaption,
    disabledInteractionCaption: {
        ...theme.interactionCaption,
        color: theme.palette.default.light
    },
    validationError: {
        ...theme.interactionCaption,
        color: theme.palette.error.dark
    }
}));

/**
 * Wrapper component that streamlines the structure of interaction components: name, interaction component, caption.
 * All interaction components should use this component
 */
export default function InteractionComponentWrapper(props: InteractionComponentProps) {
    const classes = useStyles();
    return [<Box key={`${props.keyValue}InteractionHeader`}>
        <Typography className={props.disabled ? classes.disabledInteractionHeader : classes.interactionHeader}>
            {props.name} {props.disabled && props.localize("card.disabled")}
        </Typography>
        </Box>,
        props.children,
        <Typography variant="caption"
        display="block"
        className={props.disabled ? classes.disabledInteractionCaption : classes.interactionCaption}
        key={`${props.keyValue}InteractionCaption`}>
         {props.caption}
    </Typography>,
        !props.disabled && props.validationErrors ? props.validationErrors.map<Typography>(
            (e: ValidationError, index: number) => {
                return <Typography variant="caption"
                            display="block"
                            className={classes.validationError}
                            key={`${props.keyValue}InteractionValidationError${index}`}>
                    {e.message}
                </Typography>
            }) : null
    ];
}
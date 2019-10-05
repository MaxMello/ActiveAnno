import React from "react";
import {makeStyles, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import type {ValidationError} from "../../helper/ValidateAnnotations";

type InteractionComponentProps = {
    name: string,
    caption: string,
    keyValue: string,
    children: any,
    validationErrors: Array<ValidationError>
}

const useStyles = makeStyles(theme => ({
    interactionHeader: theme.interactionHeader,
    interactionCaption: theme.interactionCaption,
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
        <Typography className={classes.interactionHeader}>
            {props.name}
        </Typography>
        </Box>,
        props.children,
        <Typography variant="caption"
        display="block"
        className={classes.interactionCaption}
        key={`${props.keyValue}InteractionCaption`}>
         {props.caption}
    </Typography>,
        props.validationErrors ? props.validationErrors.map((e, index) => {
            return <Typography variant="caption"
                        display="block"
                        className={classes.validationError}
                        key={`${props.keyValue}InteractionValidationError${index}`}>
                {e.message}
            </Typography>
        }) : null
    ];
}
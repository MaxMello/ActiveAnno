// @flow
import React from "react";
import {makeStyles, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";

type InputWrapperProps = {
    name: string,
    caption: string,
    keyValue: string,
    children: any,
    disabled?: boolean
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
    }
}));

/**
 * General wrapper component which displays a title and caption around some input
 */
export default function InputWrapper(props: InputWrapperProps) {
    const classes = useStyles();
    return [<Box key={`${props.keyValue}InputWrapper`}>
            <Typography className={props?.disabled ? classes.disabledInteractionHeader : classes.interactionHeader}>
                {props.name}
            </Typography>
        </Box>,
        props.children,
        <Typography variant="caption"
            display="block"
            className={props?.disabled ? classes.disabledInteractionCaption : classes.interactionCaption}
            key={`${props.keyValue}InputWrapperTypography`}>
             {props.caption}
        </Typography>
    ];
}
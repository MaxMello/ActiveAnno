import {makeStyles} from "@material-ui/core";
import React, {Component} from "react";
import PopupState, {bindHover, bindPopover, bindTrigger} from "material-ui-popup-state";
import Box from "@material-ui/core/Box";
import Popover from "@material-ui/core/Popover";

type DefaultPopoverProps = {
    trigger: string,
    targets: Array<Component> | Component,
    content: Array<Component> | Component | string,
    keyValue: string
}
const useStyles = makeStyles(theme => ({
    popoverContent: {
        maxWidth: '50vw',
        ...theme.typography.body2
    },
}));

export default function DefaultPopover(props: DefaultPopoverProps) {
    const classes = useStyles();
    return <PopupState variant="popover" popupId={`${props.keyValue}Popover`} key={props.keyValue}>
        {popupState => (
            [<Box display={'inline'} {...props.trigger === 'CLICK' ? bindTrigger(popupState) : bindHover(popupState) } key={`${props.keyValue}PopoverTarget`}>
                {props.targets}
            </Box>,
                <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    key={`${props.keyValue}PopoverContent`}>
                    <Box className={classes.popoverContent}>
                        {props.content}
                    </Box>
                </Popover>
            ]
        )}
    </PopupState>
}
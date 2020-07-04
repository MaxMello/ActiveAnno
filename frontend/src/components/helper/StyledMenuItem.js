import MenuItem from "@material-ui/core/MenuItem";
import {makeStyles} from "@material-ui/core";
import * as React from "react";

const useStyles = makeStyles(theme => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    }
}));

export const StyledMenuItem = React.forwardRef((props, ref) => {
    const classes = useStyles();
    return <MenuItem ref={ref} classes={{root: classes.root}} {...props}>
        {props.children}
    </MenuItem>;
});
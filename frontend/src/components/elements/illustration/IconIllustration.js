// @flow
import {makeStyles} from "@material-ui/core";
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import MaterialIcon from "@material/react-material-icon";

type IconIllustrationProps = {
    element: Object
}

const useStyles = makeStyles(theme => ({
    interactiveIcon: {
        bottom: 2,
    },
    nonInteractiveIcon: {
        bottom: 2,
        '&:hover': {
            backgroundColor: 'transparent',
            cursor: 'auto'
        }
    }
}));

export default function IconIllustration(props: IconIllustrationProps) {
    const classes = useStyles();
    if (props.element.interactive) {
        return <IconButton color="inherit"
                           size={"small"}
                           className={classes.interactiveIcon}>
            <MaterialIcon icon={props.element.name}
                          hasRipple={true}/>
        </IconButton>;
    } else {
        return <IconButton color="inherit"
                           size={"small"}
                           disableRipple={true}
                           className={classes.nonInteractiveIcon}>
            <MaterialIcon icon={props.element.name}
                          hasRipple={true}/>
        </IconButton>;
    }
}
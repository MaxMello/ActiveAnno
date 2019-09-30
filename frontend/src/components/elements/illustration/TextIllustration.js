import {makeStyles, Typography} from "@material-ui/core";
import React from "react";

type TextIllustrationProps = {
    element: Object
}

const useStyles = makeStyles(theme => ({
    defaultTypography: {
        fontWeight: 'inherit'
    }
}));

export default function TextIllustration(props: TextIllustrationProps) {
    const classes = useStyles();
    return <Typography className={classes.defaultTypography}
                       display={'inline'}>
        {props.element.text}
    </Typography>;
}
// @flow
import {makeStyles, Typography} from "@material-ui/core";
import React from "react";

type TextMetaDataProps = {
    element: Object,
    documentData: Object
}

const useStyles = makeStyles(theme => ({
    defaultTypography: {
        fontWeight: 'inherit',
        fontFamily: 'inherit'
    }
}));

/**
 * Display the value of a metadata key
 */
export default function TextMetaData(props: TextMetaDataProps) {
    const classes = useStyles();
    return <Typography className={classes.defaultTypography}
                       display={'inline'}>
        {props.documentData[props.element.id]}
    </Typography>;
}
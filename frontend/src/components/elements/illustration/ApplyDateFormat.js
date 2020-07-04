// @flow
import {makeStyles, Typography} from "@material-ui/core";
import React from "react";
import {formatByMoment} from "../../../helper/Helper";

type ApplyDateFormatProps = {
    element: Object,
    documentData: Object
}

const useStyles = makeStyles(theme => ({
    defaultTypography: {
        fontWeight: 'inherit',
        fontFamily: 'inherit'
    }
}));

export default function ApplyDateFormat(props: ApplyDateFormatProps) {
    const classes = useStyles();
    return <Typography className={classes.defaultTypography} display={'inline'}>
            {formatByMoment(props.documentData[props.element.id], props.element.formatString)}
        </Typography>;
}
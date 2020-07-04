// @flow
import React from "react";
import Box from "@material-ui/core/Box";
import {makeStyles} from "@material-ui/core";

type ApplyMonospaceStyleProps = {
    element: Object,
    documentData: Object,
    keyValue: string,
    childMapperFunction: Function
}

const useStyles = makeStyles(theme => ({
    monospace: {
        fontWeight: 'inherit',
        fontFamily: 'Roboto Mono, monospace'
    }
}));

export default function ApplyMonospaceStyle(props: ApplyMonospaceStyleProps) {
    const classes = useStyles();
    return <Box display="inline" className={classes.monospace}>
        {props.element.children.map((c, index) => {
            return props.childMapperFunction(c, props.documentData, `${props.keyValue}MonospaceChild${index}`);
        })}
    </Box>
}
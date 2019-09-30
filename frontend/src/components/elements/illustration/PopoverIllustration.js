import React from "react";
import Box from "@material-ui/core/Box";
import DefaultPopover from "../DefaultPopover";
import {makeStyles} from "@material-ui/core";

type PopoverIllustrationProps = {
    element: Object,
    documentData: Object,
    keyValue: string,
    childMapperFunction: Function
}

const useStyles = makeStyles(theme => ({
    popoverContent: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    }
}));

export default function PopoverIllustration(props: PopoverIllustrationProps) {
    const classes = useStyles();
    return <DefaultPopover trigger={props.element.trigger} targets={
        props.element.targets.elements.map((e, index) => {
            return props.childMapperFunction(e, props.documentData, `${props.keyValue}PopoverTarget${index}`)
        })
    } content={  <Box className={classes.popoverContent}>
        {props.element.content.elements.map((e, index) => {
            return props.childMapperFunction(e, props.documentData, `${props.keyValue}PopoverContent${index}`)
        })}
    </Box>
    } keyValue={props.keyValue}/>;
}
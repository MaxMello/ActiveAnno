import {makeStyles} from "@material-ui/core";
import React from "react";
import TextField from "@material-ui/core/TextField";

type DocumentTextIllustrationProps = {
    element: Object,
    documentData: Object
}

const useStyles = makeStyles(theme => ({
    documentText: {
    },
    documentTextInputField: {
        fontWeight: 'inherit',
        color: 'inherit',
        fontStyle: 'inherit'
    }
}));

export default function DocumentTextIllustration(props: DocumentTextIllustrationProps) {
    const classes = useStyles();
    return <TextField
        label={props.element.label}
        multiline
        value={props.documentData["DOCUMENT_TEXT"]}
        classes={{root: classes.documentText}}
        InputLabelProps={{
            disableAnimation: true,
            shrink: true,
            focused: true,
        }}
        InputProps={{
            readOnly: true,
            classes: {
                root: classes.documentTextInputField
            }
        }}
        fullWidth
        margin="normal"
        variant="outlined"/>;
}
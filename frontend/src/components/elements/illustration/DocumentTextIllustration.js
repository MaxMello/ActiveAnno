// @flow
import {makeStyles, Typography} from "@material-ui/core";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

type DocumentTextIllustrationProps = {
    element: Object,
    documentData: Object
}

const useStyles = makeStyles(theme => ({
    card: {
        marginTop: 10,
        marginBottom: 10
    },
    cardContent: {
        padding: 12,
        paddingTop: 10,
        paddingBottom: "18px !important"
    },
    title: {
        fontSize: 14
    }
}));

/**
 * Display the documents main text, highlighted in larger font and in a outlined card
 */
export default function DocumentTextIllustration(props: DocumentTextIllustrationProps) {
    const classes = useStyles();
    return <Card variant={"outlined"} className={classes.card}>
        <CardContent className={classes.cardContent}>
            <Typography className={classes.title} color="textSecondary" gutterBottom>{props.element.label}</Typography>
            <Typography variant={"h5"} component={"h2"}>
                {props.documentData["DOCUMENT_TEXT"]}
            </Typography>
        </CardContent>
    </Card>;
}
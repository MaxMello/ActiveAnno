// @flow
import {makeStyles} from "@material-ui/core";
import React from "react";
import type {MetaDataMapping} from "../../../types/project/layout/LayoutElement";
import type {Dictionary} from "../../../types/Types";
import Box from "@material-ui/core/Box";


type TextMetaDataMappingProps = {
    element: MetaDataMapping,
    documentData: Dictionary<string, string>,
    childMapperFunction: Function,
    keyValue: string
}

const useStyles = makeStyles(theme => ({
    defaultTypography: {
        fontWeight: 'inherit',
        fontFamily: 'inherit'
    }
}));

/**
 * Map layout components based on metadata values
 */
export default function MetaDataMappingElement(props: TextMetaDataMappingProps) {
    const classes = useStyles();
    const mappingKey = props.documentData[props.element.id]?.toString();
    let displayElements = props.element.fallback;
    if(mappingKey != null && props.element.mapping[mappingKey] != null) {
        displayElements = props.element.mapping[mappingKey];
    }
    return <Box className={classes.defaultTypography} display={'inline'}>
        {displayElements.map((c, index) => {
            return props.childMapperFunction(c, props.documentData, `${props.keyValue}MetaDataMapping${index}`);
        })}
    </Box>;
}
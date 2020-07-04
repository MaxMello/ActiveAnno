// @flow
import React from "react";
import Box from "@material-ui/core/Box";

type ApplyItalicStyleProps = {
    element: Object,
    documentData: Object,
    keyValue: string,
    childMapperFunction: Function
}

export default function ApplyItalicStyle(props: ApplyItalicStyleProps) {
    return <Box fontStyle="italic" display="inline">
        {props.element.children.map((c, index) => {
            return props.childMapperFunction(c, props.documentData, `${props.keyValue}ItalicChild${index}`);
        })}
    </Box>
}
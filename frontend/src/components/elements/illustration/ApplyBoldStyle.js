import React from "react";
import Box from "@material-ui/core/Box";

type ApplyBoldStyleProps = {
    element: Object,
    documentData: Object,
    keyValue: string,
    childMapperFunction: Function
}

export default function ApplyBoldStyle(props: ApplyBoldStyleProps) {
    return <Box fontWeight={500} display="inline">
        {props.element.children.map((c, index) => {
            return props.childMapperFunction(c, props.documentData, `${props.keyValue}BoldChild${index}`);
        })}
    </Box>
}
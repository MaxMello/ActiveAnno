import React from "react";
import Box from "@material-ui/core/Box";

type ApplyMonospaceStyleProps = {
    element: Object,
    documentData: Object,
    keyValue: string,
    childMapperFunction: Function
}

export default function ApplyMonospaceStyle(props: ApplyMonospaceStyleProps) {
    return <Box fontFamily="Monospace" display="inline">
        {props.element.children.map((c, index) => {
            return props.childMapperFunction(c, props.documentData, `${props.keyValue}MonospaceChild${index}`);
        })}
    </Box>
}
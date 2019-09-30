import React from "react";
import Image from 'material-ui-image';

type UrlImageMetaDataProps = {
    element: Object,
    documentData: Object
}

export default function UrlImageMetaData(props: UrlImageMetaDataProps) {
    return <Image src={props.documentData[props.element.id]}/>
}
import React from "react";
import Image from 'material-ui-image';

type Base64ImageMetaDataProps = {
    element: Object,
    documentData: Object
}

export default function Base64ImageMetaData(props: Base64ImageMetaDataProps) {
    return <Image src={`data:image/png;base64, ${props.documentData[props.element.id]}`}/>
}
// @flow
import React from "react";
import Image from 'material-ui-image';

type Base64ImageProps = {
    element: Object
}

export default function Base64Image(props: Base64ImageProps) {
    return <Image src={`data:image/png;base64, ${props.element.base64}`}/>
}
import React from "react";
import Image from 'material-ui-image';

type UrlImageProps = {
    element: Object
}

export default function UrlImage(props: UrlImageProps) {
    return <Image src={props.element.url}/>
}
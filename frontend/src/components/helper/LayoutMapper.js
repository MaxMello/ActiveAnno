// @flow
import {LayoutElement} from "../../constants/LayoutElement";
import React from "react";
import TextIllustration from "../elements/illustration/TextIllustration";
import ApplyDateFormat from "../elements/illustration/ApplyDateFormat";
import DocumentTextIllustration from "../elements/illustration/DocumentTextIllustration";
import ApplyBoldStyle from "../elements/illustration/ApplyBoldStyle";
import ApplyItalicStyle from "../elements/illustration/ApplyItalicStyle";
import ApplyMonospaceStyle from "../elements/illustration/ApplyMonospaceStyle";
import IconIllustration from "../elements/illustration/IconIllustration";
import PopoverIllustration from "../elements/illustration/PopoverIllustration";
import TextMetaData from "../elements/illustration/TextMetaData";
import Base64Image from "../elements/illustration/Base64Image";
import Base64ImageMetaData from "../elements/illustration/Base64ImageMetaData";
import UrlImage from "../elements/illustration/UrlImage";
import UrlImageMetaData from "../elements/illustration/UrlImageMetaData";
import MetaDataMappingElement from "../elements/illustration/MetaDataMappingElement";

/**
 * From the DisplayElement definitions, built actual display element components
 */
export const createIllustrationComponent = (element: any, documentData: any, key: string): any => {
    switch(element.type) {
        case LayoutElement.TEXT: {
            return <TextIllustration element={element} key={key}/>;
        }
        case LayoutElement.ICON: {
            return <IconIllustration element={element} key={key}/>
        }
        case LayoutElement.BASE64_IMAGE: {
            return <Base64Image element={element}/>
        }
        case LayoutElement.BASE64_IMAGE_META_DATA: {
            return <Base64ImageMetaData element={element} documentData={documentData}/>
        }
        case LayoutElement.URL_IMAGE: {
            return <UrlImage element={element}/>
        }
        case LayoutElement.URL_IMAGE_META_DATA: {
            return <UrlImageMetaData element={element} documentData={documentData}/>
        }
        case LayoutElement.TEXT_META_DATA: {
            return <TextMetaData element={element} documentData={documentData} key={key}/>
        }
        case LayoutElement.META_DATA_MAPPING: {
            return <MetaDataMappingElement element={element}
                                   documentData={documentData} key={key}
                                   keyValue={key}
                                   childMapperFunction={createIllustrationComponent}/>
        }
        case LayoutElement.DATE_META_DATA: {
            return <ApplyDateFormat element={element} documentData={documentData} key={key}/>
        }
        case LayoutElement.DOCUMENT_TEXT: {
            return <DocumentTextIllustration element={element} documentData={documentData} key={key}/>;
        }
        case LayoutElement.BOLD: {
            return <ApplyBoldStyle element={element}
                                   documentData={documentData} key={key}
                                   keyValue={key}
                                   childMapperFunction={createIllustrationComponent}/>
        }
        case LayoutElement.ITALIC: {
            return <ApplyItalicStyle element={element}
                                   documentData={documentData} key={key}
                                   keyValue={key}
                                   childMapperFunction={createIllustrationComponent}/>
        }
        case LayoutElement.MONOSPACE: {
            return <ApplyMonospaceStyle element={element}
                                     documentData={documentData} key={key}
                                     keyValue={key}
                                     childMapperFunction={createIllustrationComponent}/>
        }
        case LayoutElement.POPOVER: {
            return <PopoverIllustration element={element}
                                        documentData={documentData}
                                        key={key}
                                        keyValue={key}
                                        childMapperFunction={createIllustrationComponent}/>;
        }
        default:
            return null;
    }
};
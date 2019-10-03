import React, { Component } from "react";
import {withStyles} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import {withLocalization} from "react-localize";
import classNames from 'classnames';
import SwipeableViews from 'react-swipeable-views';
import Grid from '@material-ui/core/Grid';
import {LayoutElement} from "../../../constants/LayoutElement";
import {AnnotationType} from "../../../constants/AnnotationType";
import PredefinedTagSetButtonGroup from "./PredefinedTagSetButtonGroup";
import BooleanButtonGroup from "./BooleanButtonGroup";
import {Target} from "../../../redux/annotationData";
import {LayoutAreaTypes} from "../../../constants/LayoutAreaTypes";
import {grey} from "@material-ui/core/colors";
import OpenTextInput from "./OpenTextInput";
import OpenTagInput from "./OpenTagInput";
import NumberInput from "./NumberInput";
import NumberSlider from "./NumberSlider";
import DropdownInput from "./DropdownInput";
import type {ValidationError} from "../../helper/ValidateAnnotations";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {createIllustrationComponent} from "../../helper/LayoutMapper";
import CardHeader from "@material-ui/core/CardHeader";
import type {LayoutAreaType, Row} from "../../../types/LayoutConfigTypes";
import type {AnnotationConfigFull, AnnotationDocument, DocumentToAnnotate} from "../../../types/AnnotationTypes";

type AnnotateDocumentCardProps = {
    config: AnnotationConfigFull,
    document: DocumentToAnnotate,
    currentTarget: string,
    setDocumentAnnotationValue: Function,
    setSpanAnnotationValue: Function,
    setCurrentTarget: Function,
};

const style: Function = (theme: Object): Object => {
    return ({
        wrapper: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            flexWrap: 'nowrap'
        },
        card: {
            maxWidth: 1280,
            backgroundColor: 'white',
            margin: theme.spacing(2),
            marginTop: theme.spacing(1),
            flexGrow: 1,
        },
        cardTabContent: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            flexGrow: 1,
            fontWeight: 400,
        },
        tabBar: {
            backgroundColor: 'white'
        },
        row: {
            paddingBottom: theme.spacing(1),
            paddingTop: theme.spacing(1)
        },
        column: {
            alignContent: 'center',
            paddingRight: theme.spacing(1),
            paddingLeft: theme.spacing(1),
        },
        divider: {
            backgroundColor: grey[200]
        },
        [LayoutAreaTypes.SHARED_TARGET]: {

        },
        [LayoutAreaTypes.DOCUMENT_TARGET]: {

        },
        [LayoutAreaTypes.SPAN_TARGET]: {
            backgroundColor: grey[200]
        },
    });
};


class AnnotateDocumentCard extends Component<AnnotateDocumentCardProps> {

    constructor(props) {
        super(props);
        this.state = {
            tabIndex: null
        };
    }

    getValidationErrorsForComponent(element: Object): Array<ValidationError> {
       if(this.props.document.validationErrors[element.referenceAnnotation]){
           return this.props.document.validationErrors[element.referenceAnnotation].filter(e => e.target === this.props.currentTarget);
       } else {
           return [];
       }
    }

    mapLayoutElementsToComponent = (element: Object, documentData: Object, key: string): Array<Component> => {
        const nonInteractiveComponent = createIllustrationComponent(element, documentData, key);
        if(nonInteractiveComponent === null) {
            switch (element.type) {
                case LayoutElement.BUTTON_GROUP: {
                    if (this.props.config.annotations.annotationMap[element.referenceAnnotation].type === AnnotationType.BooleanAnnotation) {
                        return <BooleanButtonGroup localize={this.props.localize}
                                                   configID={this.props.config.id}
                                                   annotationConfig={this.props.config.annotations.annotationMap}
                                                   documentID={this.props.document.documentID}
                                                   target={this.props.currentTarget}
                                                   annotations={this.props.currentTarget === Target.SPAN ? this.props.document.spanAnnotations : this.props.document.documentAnnotations}
                                                   setAnnotationValue={this.props.currentTarget === Target.SPAN ? this.props.setSpanAnnotationValue : this.props.setDocumentAnnotationValue}
                                                   element={element}
                                                   validationErrors={this.getValidationErrorsForComponent(element)}
                                                   key={key}
                                                   keyValue={key}/>
                    } else if (this.props.config.annotations.annotationMap[element.referenceAnnotation].type === AnnotationType.PredefinedTagSetAnnotation) {
                        return <PredefinedTagSetButtonGroup localize={this.props.localize}
                                                            configID={this.props.config.id}
                                                            annotationConfig={this.props.config.annotations.annotationMap}
                                                            documentID={this.props.document.documentID}
                                                            target={this.props.currentTarget}
                                                            annotations={this.props.currentTarget === Target.SPAN ? this.props.document.spanAnnotations : this.props.document.documentAnnotations}
                                                            setAnnotationValue={this.props.currentTarget === Target.SPAN ? this.props.setSpanAnnotationValue : this.props.setDocumentAnnotationValue}
                                                            element={element}
                                                            validationErrors={this.getValidationErrorsForComponent(element)}
                                                            key={key}
                                                            keyValue={key}/>
                    } else {
                        throw Error("Unsupported annotation type for ButtonGroup");
                    }
                }
                case LayoutElement.DROPDOWN: {
                    if (this.props.config.annotations.annotationMap[element.referenceAnnotation].type === AnnotationType.PredefinedTagSetAnnotation) {
                        return <DropdownInput               localize={this.props.localize}
                                                            configID={this.props.config.id}
                                                            annotationConfig={this.props.config.annotations.annotationMap}
                                                            documentID={this.props.document.documentID}
                                                            target={this.props.currentTarget}
                                                            annotations={this.props.currentTarget === Target.SPAN ? this.props.document.spanAnnotations : this.props.document.documentAnnotations}
                                                            setAnnotationValue={this.props.currentTarget === Target.SPAN ? this.props.setSpanAnnotationValue : this.props.setDocumentAnnotationValue}
                                                            element={element}
                                                            validationErrors={this.getValidationErrorsForComponent(element)}
                                                            key={key}
                                                            keyValue={key}/>
                    } else {
                        throw Error("Unsupported annotation type for Dropdown");
                    }
                }
                case LayoutElement.TEXT_FIELD: {
                    if(!(this.props.config.annotations.annotationMap[element.referenceAnnotation].type === AnnotationType.OpenTextAnnotation)) {
                        throw Error("Unsupported annotation type for OpenTextInput");
                    }
                    return <OpenTextInput   localize={this.props.localize}
                                            configID={this.props.config.id}
                                            annotationConfig={this.props.config.annotations.annotationMap}
                                            documentID={this.props.document.documentID}
                                            target={this.props.currentTarget}
                                            annotations={this.props.currentTarget === Target.SPAN ? this.props.document.spanAnnotations : this.props.document.documentAnnotations}
                                            setAnnotationValue={this.props.currentTarget === Target.SPAN ? this.props.setSpanAnnotationValue : this.props.setDocumentAnnotationValue}
                                            element={element}
                                            validationErrors={this.getValidationErrorsForComponent(element)}
                                            documentText={documentData["DOCUMENT_TEXT"]}
                                            key={key}
                                            keyValue={key}/>
                }
                case LayoutElement.NUMBER_FIELD: {
                    if(!(this.props.config.annotations.annotationMap[element.referenceAnnotation].type === AnnotationType.ClosedNumberAnnotation || this.props.config.annotations.annotationMap[element.referenceAnnotation].type === AnnotationType.OpenNumberAnnotation)) {
                        throw Error("Unsupported annotation type for NumberInput");
                    }
                    return <NumberInput     localize={this.props.localize}
                                            configID={this.props.config.id}
                                            annotationConfig={this.props.config.annotations.annotationMap}
                                            documentID={this.props.document.documentID}
                                            target={this.props.currentTarget}
                                            annotations={this.props.currentTarget === Target.SPAN ? this.props.document.spanAnnotations : this.props.document.documentAnnotations}
                                            setAnnotationValue={this.props.currentTarget === Target.SPAN ? this.props.setSpanAnnotationValue : this.props.setDocumentAnnotationValue}
                                            element={element}
                                            validationErrors={this.getValidationErrorsForComponent(element)}
                                            key={key}
                                            keyValue={key}/>
                }
                case LayoutElement.SLIDER: {
                    if(!(this.props.config.annotations.annotationMap[element.referenceAnnotation].type === AnnotationType.ClosedNumberAnnotation || this.props.config.annotations.annotationMap[element.referenceAnnotation].type === AnnotationType.NumberRangeAnnotation)) {
                        throw Error("Unsupported annotation type for NumberSlider");
                    }
                    return <NumberSlider    isRange={this.props.config.annotations.annotationMap[element.referenceAnnotation].type === AnnotationType.NumberRangeAnnotation}
                                            localize={this.props.localize}
                                            configID={this.props.config.id}
                                            annotationConfig={this.props.config.annotations.annotationMap}
                                            documentID={this.props.document.documentID}
                                            target={this.props.currentTarget}
                                            annotations={this.props.currentTarget === Target.SPAN ? this.props.document.spanAnnotations : this.props.document.documentAnnotations}
                                            setAnnotationValue={this.props.currentTarget === Target.SPAN ? this.props.setSpanAnnotationValue : this.props.setDocumentAnnotationValue}
                                            element={element}
                                            validationErrors={this.getValidationErrorsForComponent(element)}
                                            key={key}
                                            keyValue={key}/>
                }
                case LayoutElement.CHIPS: {
                    if(!(this.props.config.annotations.annotationMap[element.referenceAnnotation].type === AnnotationType.OpenTagAnnotation)) {
                        throw Error("Unsupported annotation type for OpenTagInput");
                    }
                    return <OpenTagInput    localize={this.props.localize}
                                            configID={this.props.config.id}
                                            annotationConfig={this.props.config.annotations.annotationMap}
                                            documentID={this.props.document.documentID}
                                            target={this.props.currentTarget}
                                            annotations={this.props.currentTarget === Target.SPAN ? this.props.document.spanAnnotations : this.props.document.documentAnnotations}
                                            setAnnotationValue={this.props.currentTarget === Target.SPAN ? this.props.setSpanAnnotationValue : this.props.setDocumentAnnotationValue}
                                            element={element}
                                            validationErrors={this.getValidationErrorsForComponent(element)}
                                            key={key}
                                            keyValue={key}/>
                }
                default:
                    return null;
            }
        } else {
            return null;
        }
    };

    createRow(layoutAreaType: LayoutAreaType, document: AnnotationDocument, row: Row, rowIndex: number, key: string) {
        let cssClass;
        if(this.props.currentTarget === Target.SPAN && layoutAreaType === LayoutAreaTypes.SHARED_TARGET) {
            cssClass = this.props.classes[LayoutAreaTypes.SPAN_TARGET];
        } else {
            cssClass = this.props.classes[layoutAreaType];
        }
        return [<Grid container className={classNames(this.props.classes.row, cssClass)}
                     key={`${key}Row${rowIndex}`}>
            {row.cols.map((c, columnIndex) => {
                return [<Grid item
                              xs={c.width.xs ? c.width.xs : undefined}
                              sm={c.width.sm ? c.width.sm : undefined}
                              md={c.width.md ? c.width.md : undefined}
                              lg={c.width.lg ? c.width.lg : undefined}
                              xl={c.width.xl ? c.width.xl : undefined}
                              className={this.props.classes.column}
                              key={`${key}Row${rowIndex}Column${columnIndex}`}>
                    {c.children.map((child, index) => {
                        return this.mapLayoutElementsToComponent(child, document.documentData, `${key}Row${rowIndex}Column${columnIndex}Element${index}`)
                    })}
                </Grid>]
            })}
        </Grid>, <Divider variant={'fullWidth'} className={this.props.classes.divider} key={`${key}Divider${rowIndex}`}/>]
    }

    render() {
        const config = this.props.config;
        if(!config.layout) {
            return null;
        }
        const document = this.props.document;
        let documentContent = [];
        const spanContent = [];
        if(LayoutAreaTypes.SHARED_TARGET in config.layout.layoutAreas) {
            documentContent.push(
                config.layout.layoutAreas[LayoutAreaTypes.SHARED_TARGET].rows.map((r, rowIndex) => {
                    return this.createRow(LayoutAreaTypes.SHARED_TARGET, document, r, rowIndex, `config${config.id}Document${document.documentID}LayoutSharedTarget`);
                })
            );
            spanContent.push(
                config.layout.layoutAreas[LayoutAreaTypes.SHARED_TARGET].rows.map((r, rowIndex) => {
                    return this.createRow(LayoutAreaTypes.SHARED_TARGET, document, r, rowIndex, `config${config.id}Document${document.documentID}LayoutSharedTarget`);
                })
            );
        }
        if(this.props.currentTarget === Target.DOCUMENT && LayoutAreaTypes.DOCUMENT_TARGET in config.layout.layoutAreas) {
            documentContent.push(
                config.layout.layoutAreas[LayoutAreaTypes.DOCUMENT_TARGET].rows.map((r, rowIndex) => {
                    return this.createRow(LayoutAreaTypes.DOCUMENT_TARGET, document, r, rowIndex, `config${config.id}Document${document.documentID}LayoutDocumentTarget`);
                })
            );
        }
        if(this.props.currentTarget === Target.SPAN && LayoutAreaTypes.SPAN_TARGET in config.layout.layoutAreas) {
            spanContent.push(
                config.layout.layoutAreas[LayoutAreaTypes.SPAN_TARGET].rows.map((r, rowIndex) => {
                    return this.createRow(LayoutAreaTypes.SPAN_TARGET, document, r, rowIndex, `config${config.id}Document${document.documentID}LayoutSpanTarget`);
                })
            );
        }
        if(documentContent.length === 0 && spanContent.length === 0) {
            return null;
        }
        return <div className={this.props.classes.wrapper}>
            <Card className={this.props.classes.card} raised={false}>
                { (documentContent.length > 0 && spanContent.length > 0) ?
                    [<AppBar position="static" color="default" className={this.props.classes.tabBar} key={`${config.id}Document${document.documentID}AppBar`}>
                        <Tabs
                            value={this.state.tabIndex !== null ? this.state.tabIndex : (documentContent.length > 0 ? 0 : 1)}
                            onChange={(e, index) => {
                                this.setState({
                                    tabIndex: index
                                })
                            }}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                        >
                            <Tab label={this.props.localize("card.documentInteractionTitle")}/>
                            <Tab label={this.props.localize("card.spanInteractionTitle")}/>
                        </Tabs>
                    </AppBar>,
                    <SwipeableViews
                        axis={'x'}
                        index={this.state.tabIndex}
                        key={`${config.id}Document${document.documentID}SwipeableView`}
                        onChangeIndex={(index) => {
                            this.setState({
                                tabIndex: index
                            })
                        }}>
                        <CardContent className={this.props.classes.cardTabContent}>{documentContent}</CardContent>
                        <CardContent className={this.props.classes.cardTabContent}>{spanContent}</CardContent>
                    </SwipeableViews>]
                    : [(documentContent.length > 0 ? [
                        <CardHeader title={this.props.localize("card.documentInteractionTitle")} key={`${config.id}Document${document.documentID}DocCardTitle`}/>,
                        <CardContent className={this.props.classes.cardTabContent} key={`${config.id}Document${document.documentID}DocCardContent`}>{documentContent}</CardContent>
                    ] : null),
                        (spanContent.length > 0 ? [
                            <CardHeader title={this.props.localize("card.spanInteractionTitle")} subheader={this.props.localize("card.spanInteractionSubtitle")} key={`${config.id}Document${document.documentID}SpanCardHeader`}/>,
                            <CardContent className={this.props.classes.cardTabContent} key={`${config.id}Document${document.documentID}SpanCardContent`}>{spanContent}</CardContent>
                        ] : null)]
                }
            </Card>
        </div>;
    }
}

export default withLocalization(withStyles(style)(AnnotateDocumentCard));
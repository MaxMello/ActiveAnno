// @flow
import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {withLocalization} from "react-localize";
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import {ActionElements, NormalizedActionElements} from "../../../constants/LayoutElement";
import type {
    DenormalizedActionElement,
    LayoutElement as LayoutElementType
} from "../../../types/project/layout/LayoutElement";
import TagSetButtonGroup from "./TagSetButtonGroup";
import BooleanButtonGroup from "./BooleanButtonGroup";
import type {TargetType} from "../../../redux/annotate/annotationData";
import {Target} from "../../../redux/annotate/annotationData";
import type {LayoutAreaType} from "../../../constants/LayoutAreaTypes";
import {LayoutAreaTypes} from "../../../constants/LayoutAreaTypes";
import {grey} from "@material-ui/core/colors";
import OpenTextInput from "./OpenTextInput";
import OpenTagInput from "./OpenTagInput";
import OpenNumberInput from "./OpenNumberInput";
import ClosedNumberSlider from "./ClosedNumberSlider";
import DropdownInput from "./DropdownInput";
import {createIllustrationComponent} from "../../helper/LayoutMapper";
import CardHeader from "@material-ui/core/CardHeader";
import type {AnnotateProject} from "../../../types/annotate/DTOTypes";
import type {
    AnnotationDocumentInState,
    AnnotationEnableConditionResult
} from "../../../types/redux/annotate/AnnotationDataState";
import NumberRangeSlider from "./NumberRangeSlider";
import type {Row} from "../../../types/project/layout/Layout";
import type {Dictionary, WithLocalizationComponentProps, WithStylesComponentProps} from "../../../types/Types";
import type {ValidationError} from "../../../types/annotate/ValidationError";

type AnnotateDocumentCardProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    project: AnnotateProject,
    document: AnnotationDocumentInState,
    setAnnotationValue: Function
};

type AnnotationDocumentCardState = {
    tabIndex: ?number
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
            margin: theme.spacing(1),
            flexGrow: 1,
        },
        cardTabContent: {
            flexGrow: 1,
            fontWeight: 400
        },
        tabBar: {
            backgroundColor: 'white'
        },
        [(LayoutAreaTypes.SHARED_TARGET: string)]: {

        },
        [(LayoutAreaTypes.DOCUMENT_TARGET: string)]: {

        },
        [(LayoutAreaTypes.SPAN_TARGET: string)]: {
            backgroundColor: grey[200]
        },
    });
};


/**
 * Card that displays interaction elements for the document
 */
class AnnotateDocumentCard extends Component<AnnotateDocumentCardProps, AnnotationDocumentCardState> {

    constructor(props) {
        super(props);
        this.state = {
            tabIndex: null
        };
    }

    getValidationErrorsForComponent(element: DenormalizedActionElement): Array<ValidationError> {
       return this.props.document?.validationErrors?.filter(v => v.annotationDefinitionID
           === element.annotationDefinition.id) ?? [];
    }

    matchTargetTypeToLayoutAreaType(layoutAreaType: LayoutAreaType, targetType: TargetType): boolean {
        switch(layoutAreaType) {
            case LayoutAreaTypes.DOCUMENT_TARGET:
                return targetType === Target.DOCUMENT;
            case LayoutAreaTypes.SPAN_TARGET:
                return targetType === Target.SPAN;
            default:
                return false;
        }
    }

    checkDisabledStatus(actionElement: DenormalizedActionElement, layoutAreaType: LayoutAreaType): boolean {
        return this.props.document.annotationConditions?.find(
            (c: AnnotationEnableConditionResult) => {
                return !c.required &&
                    c.annotationID === actionElement.annotationDefinition.id &&
                    this.matchTargetTypeToLayoutAreaType(layoutAreaType,
                        c.targetType)
            }
        ) != null
    }

    mapLayoutElementsToComponent = (element: LayoutElementType,
                                    documentData: Dictionary<string, string>,
                                    layoutAreaType: LayoutAreaType,
                                    key: string): any => {
        const nonInteractiveComponent = createIllustrationComponent(element, documentData, key);
        if(nonInteractiveComponent === null) {
            const actionElement: DenormalizedActionElement = (element: any);
            switch ((element.type: any)) {
                case NormalizedActionElements.BOOLEAN_BUTTON_GROUP:
                case ActionElements.BOOLEAN_BUTTON_GROUP: {
                    return <BooleanButtonGroup localize={this.props.localize}
                                               projectID={this.props.project.id}
                                               documentID={this.props.document.documentID}
                                               annotations={this.props.document.annotations}
                                               setAnnotationValue={this.props.setAnnotationValue}
                                               element={actionElement}
                                               validationErrors={this.getValidationErrorsForComponent(actionElement)}
                                               disabled={this.checkDisabledStatus(actionElement, layoutAreaType)}
                                               key={key}
                                               keyValue={key}/>
                }
                case NormalizedActionElements.TAG_SET_BUTTON_GROUP:
                case ActionElements.TAG_SET_BUTTON_GROUP: {
                    return <TagSetButtonGroup localize={this.props.localize}
                                              projectID={this.props.project.id}
                                              documentID={this.props.document.documentID}
                                              annotations={this.props.document.annotations}
                                              setAnnotationValue={this.props.setAnnotationValue}
                                              element={actionElement}
                                              validationErrors={this.getValidationErrorsForComponent(actionElement)}
                                              disabled={this.checkDisabledStatus(actionElement, layoutAreaType)}
                                              key={key}
                                              keyValue={key}/>
                }
                case NormalizedActionElements.TAG_SET_DROPDOWN:
                case ActionElements.TAG_SET_DROPDOWN: {
                    return <DropdownInput localize={this.props.localize}
                                projectID={this.props.project.id}
                                documentID={this.props.document.documentID}
                                annotations={this.props.document.annotations}
                                setAnnotationValue={this.props.setAnnotationValue}
                                element={actionElement}
                                validationErrors={this.getValidationErrorsForComponent(actionElement)}
                                disabled={this.checkDisabledStatus(actionElement, layoutAreaType)}
                                key={key}
                                keyValue={key}/>
                }
                case NormalizedActionElements.OPEN_TEXT_INPUT:
                case ActionElements.OPEN_TEXT_INPUT: {
                    return <OpenTextInput localize={this.props.localize}
                                projectID={this.props.project.id}
                                documentID={this.props.document.documentID}
                                annotations={this.props.document.annotations}
                                setAnnotationValue={this.props.setAnnotationValue}
                                element={actionElement}
                                validationErrors={this.getValidationErrorsForComponent(actionElement)}
                                disabled={this.checkDisabledStatus(actionElement, layoutAreaType)}
                                documentData={documentData}
                                key={key}
                                keyValue={key}/>
                   }
                case NormalizedActionElements.OPEN_NUMBER_INPUT:
                case ActionElements.OPEN_NUMBER_INPUT: {
                    return <OpenNumberInput localize={this.props.localize}
                                            projectID={this.props.project.id}
                                            documentID={this.props.document.documentID}
                                            annotations={this.props.document.annotations}
                                            setAnnotationValue={this.props.setAnnotationValue}
                                            element={actionElement}
                                            validationErrors={this.getValidationErrorsForComponent(actionElement)}
                                            disabled={this.checkDisabledStatus(actionElement, layoutAreaType)}
                                            key={key}
                                            keyValue={key}/>
                }
                case NormalizedActionElements.CLOSED_NUMBER_SLIDER:
                case ActionElements.CLOSED_NUMBER_SLIDER: {
                    return <ClosedNumberSlider localize={this.props.localize}
                                               projectID={this.props.project.id}
                                               documentID={this.props.document.documentID}
                                               annotations={this.props.document.annotations}
                                               setAnnotationValue={this.props.setAnnotationValue}
                                               element={actionElement}
                                               validationErrors={this.getValidationErrorsForComponent(actionElement)}
                                               disabled={this.checkDisabledStatus(actionElement, layoutAreaType)}
                                               key={key}
                                               keyValue={key}/>
                }
                case NormalizedActionElements.NUMBER_RANGE_SLIDER:
                case ActionElements.NUMBER_RANGE_SLIDER: {
                    return <NumberRangeSlider  localize={this.props.localize}
                                               projectID={this.props.project.id}
                                               documentID={this.props.document.documentID}
                                               annotations={this.props.document.annotations}
                                               setAnnotationValue={this.props.setAnnotationValue}
                                               element={actionElement}
                                               validationErrors={this.getValidationErrorsForComponent(actionElement)}
                                               disabled={this.checkDisabledStatus(actionElement, layoutAreaType)}
                                               key={key}
                                               keyValue={key}/>
                }
                case NormalizedActionElements.OPEN_TAG_CHIP_INPUT:
                case ActionElements.OPEN_TAG_CHIP_INPUT: {
                    return <OpenTagInput    localize={this.props.localize}
                                            projectID={this.props.project.id}
                                            documentID={this.props.document.documentID}
                                            annotations={this.props.document.annotations}
                                            setAnnotationValue={this.props.setAnnotationValue}
                                            element={actionElement}
                                            validationErrors={this.getValidationErrorsForComponent(actionElement)}
                                            disabled={this.checkDisabledStatus(actionElement, layoutAreaType)}
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

    createRow(layoutAreaType: LayoutAreaType, document: AnnotationDocumentInState, row: Row,
              rowIndex: number, key: string) {
        let cssClass = this.props.classes[layoutAreaType];
        return <Grid container spacing={2} className={classNames(this.props.classes.row, cssClass)}
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
                        console.log("child", child);
                        return this.mapLayoutElementsToComponent(child, document.documentData, layoutAreaType,
                            `${key}Row${rowIndex}Column${columnIndex}Element${index}`)
                    })}
                </Grid>]
            })}
        </Grid>;
    }

    render() {
        const project = this.props.project;
        if(!project.layout) {
            return null;
        }
        const document = this.props.document;
        let documentContent = [];
        if(LayoutAreaTypes.DOCUMENT_TARGET in project.layout.layoutAreas) {
            documentContent.push(
                // $FlowIgnore Symbol problem
                project.layout.layoutAreas[LayoutAreaTypes.DOCUMENT_TARGET].rows.map((r, rowIndex) => {
                    return this.createRow(LayoutAreaTypes.DOCUMENT_TARGET, document, r, rowIndex,
                        `project${project.id}Document${document.documentID}LayoutDocumentTarget`);
                })
            );
        }
        if(documentContent.length === 0) {
            return null;
        }
        return <div className={this.props.classes.wrapper}>
            <Card className={this.props.classes.card} raised={false}>
                { documentContent.length > 0 && [
                        <CardHeader title={this.props.localize("card.documentInteractionTitle")}
                                    key={`${project.id}Document${document.documentID}DocCardTitle`}/>,
                        <CardContent className={this.props.classes.cardTabContent}
                                     key={`${project.id}Document${document.documentID}DocCardContent`}>
                            {documentContent}
                        </CardContent>
                    ]
                }
            </Card>
        </div>;
    }
}

export default withLocalization(withStyles(style)(AnnotateDocumentCard));
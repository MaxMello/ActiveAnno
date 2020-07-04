// @flow
import * as React from "react";
import {Component} from "react";
import {Typography, withStyles} from "@material-ui/core";
import {withLocalization} from "react-localize";
import type {
    Dictionary,
    UserIdentifier,
    WithLocalizationComponentProps,
    WithStylesComponentProps
} from "../../types/Types";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
import CardHeader from "@material-ui/core/CardHeader";
import {AnnotationDefinition} from "../../constants/AnnotationDefinition";
import type {
    AnnotationDefinition as
        AnnotationDefinitionType
} from "../../types/annotationdefinition/AnnotationDefinition";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import {formatByMoment} from "../../helper/Helper";
import {AnnotationResultCreatorTypes} from "../../types/document/annotation/AnnotationResultCreator";
import {getAnnotationDefinitionsFromLayout} from "../helper/layoutToAnnotationDefinitions";
import {Target} from "../../redux/annotate/annotationData";
import type {DocumentTargetAnnotation, ValueToProbability} from "../../types/document/annotation/Annotation";

import type {AnnotateProject} from "../../types/annotate/DTOTypes";
import type {AnalyzedAnnotationResult} from "../../types/manage/AnalyzeProjectResultsTypes";

type AnnotationResultCardProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    annotationResult: AnalyzedAnnotationResult,
    annotateProject: AnnotateProject,
    userNames: Dictionary<UserIdentifier, string>
};

const style: Function = (theme: Object): Object => {
    return ({
        card: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1
        },
        panel: {
            backgroundColor: 'white',
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            flexGrow: 1,
            fontWeight: 400,
        },
        caption: theme.interactionCaption,
        booleanIcon: {
            paddingTop: theme.spacing(0.25)
        },
        chip: {
            marginLeft: theme.spacing(0.25),
            marginRight: theme.spacing(0.25)
        },
        annotationRow: {
            marginBottom: theme.spacing(0.25),
            marginTop: theme.spacing(0.25)
        },
        annotationLabel: {
            marginRight: theme.spacing(0.5)
        },
        customTooltip: {
            fontSize: theme.typography.body2.fontSize
        }
    });
};

/**
 * Display an annotation result similar to one in the FinishedAnnotationPanel, but standalone
 */
class AnalyzedAnnotationResultCard extends Component<AnnotationResultCardProps> {

    displayDocumentTargetAnnotation(annotation: DocumentTargetAnnotation,
                                    annotationDefinition: AnnotationDefinitionType) {
        switch(annotationDefinition.type) {
            case AnnotationDefinition.BooleanAnnotationDefinition:
                switch(annotation.values[0]?.value) {
                    case true:
                        return <Check fontSize={"small"} className={this.props.classes.booleanIcon}/>;
                    case false:
                        return <Close fontSize={"small"} className={this.props.classes.booleanIcon}/>;
                    default:
                        return <Typography>?</Typography>;
                }
            case AnnotationDefinition.ClosedNumberAnnotationDefinition:
            case AnnotationDefinition.OpenNumberAnnotationDefinition:
            case AnnotationDefinition.OpenTextAnnotationDefinition:
                return <Typography> { annotation.values[0]?.value?.toString() ?? "?" }</Typography>;
            case AnnotationDefinition.NumberRangeAnnotationDefinition:
                return <Typography>
                    {(annotation.values[0]?.value ?? "?")  + " - " + (annotation.values[1]?.value ?? "?")}
                </Typography>
            case AnnotationDefinition.TagSetAnnotationDefinition:
                return <div> {annotation.values.map((value: ValueToProbability, index: number) => {
                    return <Chip variant="outlined"
                                 size="small"
                                 className={this.props.classes.chip}
                                 label={annotationDefinition.options
                                     .filter(option => option.id === value.value)[0]?.name ?? "?"
                                 }
                                 key={`${annotationDefinition.id}Value${value.value}Index${index}`}/>;
                })}</div>;
            case AnnotationDefinition.OpenTagAnnotationDefinition:
                return <div> {annotation.values.map((value: ValueToProbability, index: number) => {
                    return <Chip variant="outlined"
                                 size="small"
                                 className={this.props.classes.chip}
                                 label={value.value}
                                 key={`${annotationDefinition.id}Value${value.value}Index${index}`}/>;
                })} </div>;
            default:
                return <Typography>?</Typography>;
        }
    }
    displayCreator(creator: any): string | React$Element<any> {
        switch(creator.type) {
            case AnnotationResultCreatorTypes.ANNOTATOR:
                return this.props.localize("annotationPanel.creator.annotator") + " " +
                    this.props.userNames[creator.identifier] ?? creator.identifier;
            case AnnotationResultCreatorTypes.CURATOR:
                return this.props.localize("annotationPanel.creator.curator") + " " +
                    this.props.userNames[creator.identifier] ?? creator.identifier;
            case AnnotationResultCreatorTypes.IMPORT:
                return this.props.localize("annotationPanel.creator.import") + " " +
                    this.props.userNames[creator.identifier] ?? creator.identifier;
            case AnnotationResultCreatorTypes.GENERATORS:
                return this.props.localize("annotationPanel.creator.generators");
            case AnnotationResultCreatorTypes.CONSENSUS:
                return this.props.localize("annotationPanel.creator.consensus");
            default:
                return "";
        }
    }

    render() {
        return <Card className={this.props.classes.card}>
            <CardHeader title={this.props.localize('annotationPanel.caption.annotation')}
                        subheader={
                            <span>
                                   {this.displayCreator(this.props.annotationResult.creator)}
                                {` (${formatByMoment(this.props.annotationResult.timestamp,
                                    this.props.localize('dateTimeFormatWithoutSeconds'))}${
                                    this.props.annotationResult.fullDuration ? (", " + 
                                        this.props.localize("annotationPanel.duration") +
                                            ": " + Math.round(this.props.annotationResult.fullDuration / 1000) +
                                        this.props.localize("unit.seconds")) : ""
                                })`}
                                    </span>
                        }/>
            <CardContent className={this.props.classes.cardContent}>
                {getAnnotationDefinitionsFromLayout(this.props.annotateProject.layout)[Target.DOCUMENT]
                    .map((a: AnnotationDefinitionType) => {
                        return <Box display={"flex"} className={this.props.classes.annotationRow}
                                    key={`ar${this.props.annotationResult.annotationResultID}Annotation${a.id}Box`}>
                            <Typography className={this.props.classes.annotationLabel}>
                                {a.name}:
                            </Typography>
                            {
                                this.props.annotationResult.annotations[a.id]?.target === "document" ?
                                    this.displayDocumentTargetAnnotation(
                                        this.props.annotationResult.annotations[a.id], a) : null
                            }
                        </Box>;
                    })}
            </CardContent>
        </Card>
    }
}

export default withLocalization(withStyles(style)(AnalyzedAnnotationResultCard));
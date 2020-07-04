// @flow
import * as React from "react";
import {Component} from "react";
import {Button, Typography, withStyles} from "@material-ui/core";
import {withLocalization} from "react-localize";
import type {WithLocalizationComponentProps, WithStylesComponentProps} from "../../types/Types";
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import withWidth, {isWidthDown, WithWidth} from "@material-ui/core/withWidth";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
import SwipeableViews from "react-swipeable-views";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import {AnnotationDefinition} from "../../constants/AnnotationDefinition";
import type {
    AnnotationDefinition as
        AnnotationDefinitionType
} from "../../types/annotationdefinition/AnnotationDefinition";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import {formatByMoment} from "../../helper/Helper";
import type {AnnotationResultDTO} from "../../types/annotate/CurateTypes";
import type {AnnotationResultCreator} from "../../types/document/annotation/AnnotationResultCreator";
import {AnnotationResultCreatorTypes} from "../../types/document/annotation/AnnotationResultCreator";
import {getAnnotationDefinitionsFromLayout} from "../helper/layoutToAnnotationDefinitions";
import {Target} from "../../redux/annotate/annotationData";
import type {DocumentTargetAnnotation, ValueToProbability} from "../../types/document/annotation/Annotation";
import {AcceptAnnotationResultActions, CurationDataActions} from "../../redux/annotate/curationData";
import {connect} from "react-redux";
import type {AnnotateProject} from "../../types/annotate/DTOTypes";
import Tooltip from "@material-ui/core/Tooltip";

type FinishedAnnotationPanelProps = WithStylesComponentProps & WithLocalizationComponentProps & WithWidth & {
    annotationResults: Array<AnnotationResultDTO>,
    activeProject: AnnotateProject,
    acceptExistingAnnotation: Function,
    copyExistingAnnotation: Function
};

type FinishedAnnotationPanelState = {|
    swipeIndex: number
|};

const style: Function = (theme: Object): Object => {
    return ({
        wrapper: {
            display: 'flex',
            justifyContent: 'center',
            width: `calc(100% - ${theme.spacing(2)}px)`,
            maxWidth: 1280,
            margin: '0 auto',
            [theme.breakpoints.down('xs')]: {
                width: '100%',
            }
        },
        gridItem: {
            display: "flex",
            flexGrow: 1
        },
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
        swipeableCard: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1)
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
 * Display all AnnotationResults for a document in a row of cards
 */
class FinishedAnnotationPanel extends Component<FinishedAnnotationPanelProps, FinishedAnnotationPanelState> {

    constructor(props) {
        super(props);
        this.state = {
            swipeIndex: 0
        };
        (this: any).handleChangeIndex = this.handleChangeIndex.bind(this);
    }

    handleChangeIndex(index) {
        this.setState({
            swipeIndex: index
        });
    }

    gridItem(numberOfAnnotations: number, index: number, isSwipeView: boolean,
             children: React$Element<typeof Component>) {
        return <Grid className={isSwipeView ? this.props.classes.swipeableCard : this.props.classes.gridItem}
                     item
                     key={`finishedAnnotationGridItem${index}`}
                     xs={12}
                     sm={numberOfAnnotations <= 1 ? 12 : 6}
                     md={numberOfAnnotations <= 1 ? 12 : (numberOfAnnotations === 2 ? 6 : 4)}
                     lg={numberOfAnnotations <= 1 ? 12 : (numberOfAnnotations === 2 ? 6 :
                         (numberOfAnnotations === 3 ? 4 : 3))}
                     xl={numberOfAnnotations <= 1 ? 12 : (numberOfAnnotations === 2 ? 6 :
                         (numberOfAnnotations === 3 ? 4 : 3))}>
            {children}
        </Grid>;
    }

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

    displayCreator(creator: AnnotationResultCreator): string | React$Element<any> {
        switch(creator.type) {
            case AnnotationResultCreatorTypes.ANNOTATOR:
                return this.props.localize("annotationPanel.creator.annotator") + " " + creator.displayName;
            case AnnotationResultCreatorTypes.CURATOR:
                return this.props.localize("annotationPanel.creator.curator") + " " + creator.displayName
            case AnnotationResultCreatorTypes.IMPORT:
                return this.props.localize("annotationPanel.creator.import") + " " + creator.displayName
            case AnnotationResultCreatorTypes.GENERATORS:
                return (<Tooltip title={creator.displayName} arrow disableFocusListener
                    classes={{tooltip: this.props.classes.customTooltip}}>
                    <span>{this.props.localize("annotationPanel.creator.generators")}</span>
                </Tooltip>);
            case AnnotationResultCreatorTypes.CONSENSUS:
                return this.props.localize("annotationPanel.creator.consensus") + " " + creator.displayName;
            default:
                return "";
        }
    }

    gridContent(annotationResults: Array<AnnotationResultDTO>, isSwipeView: boolean) {
        // We sort AnnotationResults in two ways: first we sort by creator name, such that the same creator will be
        // at the same place. But then we prefer Annotators to be first
        return annotationResults
            .sort((a, b) =>
                a.creator.displayName.localeCompare(b.creator.displayName)
            ).sort((a: AnnotationResultDTO, b: AnnotationResultDTO) => {
                    if (a.creator.type === AnnotationResultCreatorTypes.ANNOTATOR &&
                        a.creator.type !== AnnotationResultCreatorTypes.ANNOTATOR
                    ) {
                        return -1
                    } else if(a.creator.type === AnnotationResultCreatorTypes.ANNOTATOR &&
                        a.creator.type === AnnotationResultCreatorTypes.ANNOTATOR) {
                        return 0
                    } else {
                        return 1
                    }
                }
            ).map((d, index) => {
            return this.gridItem(annotationResults.length, index, isSwipeView,
                <Card className={this.props.classes.card}>
                    <CardHeader title={this.props.localize('annotationPanel.caption.annotation')}
                                subheader={
                                    <span>
                                   {this.displayCreator(d.creator)}
                                   {` (${formatByMoment(d.timestamp, 
                                        this.props.localize('dateTimeFormatWithoutSeconds'))}${d.interactionLog != null 
                                            ? (", " + this.props.localize("annotationPanel.duration") +
                                            ": " + Math.round(((d.interactionLog?.lastInteractionTimestamp ?? 0) -
                                                (d.interactionLog?.firstShownTimestamp ?? 0)) / 1000) +
                                            this.props.localize("unit.seconds")) : ""
                                    })`}
                                    </span>
                                }/>
                    <CardContent className={this.props.classes.cardContent}>
                        {getAnnotationDefinitionsFromLayout(d.usedProject?.layout ??
                                this.props.activeProject.layout)[Target.DOCUMENT]
                            .map((a: AnnotationDefinitionType) => {
                            return <Box display={"flex"} className={this.props.classes.annotationRow}
                                        key={`d${d.documentID}c${d.projectID}Annotation${a.id}Box`}>
                                <Typography className={this.props.classes.annotationLabel}>
                                {a.name}:
                            </Typography>
                            {
                                d.annotations[a.id]?.target === "document" ?
                                    this.displayDocumentTargetAnnotation(d.annotations[a.id], a) : null
                            }
                            </Box>;
                        })}
                    </CardContent>
                    <CardActions>
                        <Button size={"small"} color={"primary"} onClick={() => {
                            this.props.acceptExistingAnnotation(d);
                        }}>
                            {this.props.localize('annotationPanel.accept')}
                        </Button>
                        <Button size={"small"} onClick={() => {
                            this.props.copyExistingAnnotation(d);
                        }}>
                            {this.props.localize('annotationPanel.copy')}
                        </Button>
                    </CardActions>
                </Card>
            )
        })
    }

    render() {
        let annotationResults = this.props.annotationResults;
        return [<div className={this.props.classes.wrapper} key={`finishedAnnotationPanelWrapper1`}>
            {isWidthDown("xs", this.props.width) && annotationResults.length > 1 ?
                <SwipeableViews axis={'x'} enableMouseEvents={true} resistance={true} index={this.state.swipeIndex}
                                    onChangeIndex={this.handleChangeIndex}>
                          {this.gridContent(annotationResults, true)}
                    </SwipeableViews>
                :
                <Grid container className={this.props.classes.panel} spacing={2}>
                    {this.gridContent(annotationResults, false)}
                </Grid>
            }
        </div>, isWidthDown("xs", this.props.width) && annotationResults.length > 1 ?
            <div className={this.props.classes.wrapper}  key={`finishedAnnotationPanelWrapper2`}>
                <Typography variant="caption" display="block" className={this.props.classes.caption}>
                    {
                        this.props.localize('annotationPanel.caption.annotation')
                    } {
                        this.state.swipeIndex + 1}/{annotationResults.length
                    } {
                        this.props.localize('annotationPanel.caption.swipeInfo')
                    }
                </Typography>
            </div> : null];
    }
}

const mapDispatchToProps = (dispatch: Function): any => ({
    acceptExistingAnnotation: (annotatedDocument: AnnotationResultDTO) => {
        dispatch(AcceptAnnotationResultActions.start(annotatedDocument.projectID,
            annotatedDocument.documentID, annotatedDocument.id));
    },
    copyExistingAnnotation: (annotatedDocument: AnnotationResultDTO) => {
        dispatch(CurationDataActions.copyExistingAnnotation(annotatedDocument));
    }
});

export default withWidth()(connect(null, mapDispatchToProps)(withLocalization(
    withStyles(style)(FinishedAnnotationPanel))));
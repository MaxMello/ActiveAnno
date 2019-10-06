import React, {Component} from "react";
import {Button, Typography, withStyles} from "@material-ui/core";
import {withLocalization} from "react-localize";
import type {Dictionary, userIdentifier} from "../../types/Types";
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import withWidth, {isWidthDown} from "@material-ui/core/withWidth";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
import SwipeableViews from "react-swipeable-views";
import CardHeader from "@material-ui/core/CardHeader";
import {isArray} from "../helper/HelperFunctions";
import CardActions from "@material-ui/core/CardActions";
import type {UserInfo} from "../../types/PageSetupTypes";
import type {AnnotationResult} from "../../types/CurateTypes";
import {AnnotationType} from "../../constants/AnnotationType";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import {formatByMoment} from "../../helper/Helper";

type FinishedAnnotationPanelProps = {
    annotatedDocuments: Array<AnnotationResult>,
    userInfo: Dictionary<userIdentifier, UserInfo>,
    acceptExistingAnnotation: Function,
    copyExistingAnnotation: Function,
    giveFeedbackForAnnotation: Function
};

const style: Function = (theme: Object): Object => {
    return ({
        wrapper: {
            display: 'flex',
            justifyContent: 'center',
            width: `calc(100% - ${theme.spacing(4)}px)`,
            maxWidth: 1280,
            margin: '0 auto',
            [theme.breakpoints.down('xs')]: {
                width: '100%',
            },
            marginBottom: theme.spacing(1)
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
        }
    });
};

class FinishedAnnotationPanel extends Component<FinishedAnnotationPanelProps> {

    constructor(props) {
        super(props);
        this.state = {
            swipeIndex: 0
        };
        this.handleChangeIndex = this.handleChangeIndex.bind(this)
    }

    handleChangeIndex(index) {
        this.setState({
            swipeIndex: index
        });
    }

    gridItem(numberOfAnnotations: number, index: number, isSwipeView: boolean, children: Component) {
        return <Grid className={isSwipeView ? this.props.classes.swipeableCard : null}
                     item
                     key={`finishedAnnotationGridItem${index}`}
                     xs={12}
                     sm={numberOfAnnotations <= 1 ? 12 : 6}
                     md={numberOfAnnotations <= 1 ? 12 : (numberOfAnnotations === 2 ? 6 : 4)}
                     lg={numberOfAnnotations <= 1 ? 12 : (numberOfAnnotations === 2 ? 6 : (numberOfAnnotations === 3 ? 4 : 3))}
                     xl={numberOfAnnotations <= 1 ? 12 : (numberOfAnnotations === 2 ? 6 : (numberOfAnnotations === 3 ? 4 : 3))}>
            {children}
        </Grid>;
    }

    displayValue(value, annotation) {
        switch(typeof value) {
            case "undefined":
                return "?";
            case "object":
                if(isArray(value)) {
                    if(annotation.type === AnnotationType.NumberRangeAnnotation) {
                        return value[0] + " - " + value[1];
                    } else {
                        return value.map((v, index) => {
                            if (annotation.type === AnnotationType.PredefinedTagSetAnnotation) {
                                return <Chip variant="outlined"
                                             size="small"
                                             className={this.props.classes.chip}
                                             label={annotation.options.filter(option => option.id === v)[0].name}
                                             key={`${annotation.id}Value${v}Index${index}`}/>;
                            } else if (annotation.type === AnnotationType.OpenTagAnnotation) {
                                return <Chip variant="outlined"
                                             size="small"
                                             className={this.props.classes.chip}
                                             label={v}
                                             key={`${annotation.id}Value${v}Index${index}`}/>;
                            } else {
                                return value + index < value.length - 1 ? ", " : "";
                            }
                        });
                    }
                } else {
                    throw Error("Values should strings / primitives or arrays of those");
                }
            case "bigint":
                return value.toString();
            case "number":
                return value.toString();
            case "string":
                return value.toString();
            case "boolean":
                return value ? <Check fontSize={"small"} className={this.props.classes.booleanIcon}/> : <Close  fontSize={"small"} className={this.props.classes.booleanIcon}/>;
            default:
                return value.toString();
        }
    }

    getUserNameOrIdentifier(userInfo: Dictionary<userIdentifier, UserInfo>, creator) {
        return userInfo[creator.userIdentifier] ? (userInfo[creator.userIdentifier].userName ? userInfo[creator.userIdentifier].userName : creator.userIdentifier) : creator.userIdentifier
    }

    gridContent(annotatedDocuments, isSwipeView) {
        return annotatedDocuments.map((d, index) => {
            return this.gridItem(annotatedDocuments.length, index, isSwipeView,
                <Card className={this.props.classes.card}>
                    <CardHeader title={this.props.localize('annotationPanel.caption.annotation')}
                                subheader={
                                    `${d.creator.map(c => this.getUserNameOrIdentifier(this.props.userInfo, c)).join(", ")} (${formatByMoment(d.timestamp, this.props.localize('dateTimeFormat'))})`
                                }/>
                    <CardContent className={this.props.classes.cardContent}>
                        {Object.keys(d.documentAnnotations).map(a => {
                            return <Box display={"flex"} className={this.props.classes.annotationRow} key={`d${d.documentID}c${d.configurationID}Annotation${a}Box`}>
                                <Typography className={this.props.classes.annotationLabel}>
                                {d.usedConfig.annotations.annotationMap[a].name}:
                            </Typography>
                            <Typography>
                                {this.displayValue(d.documentAnnotations[a].value, d.usedConfig.annotations.annotationMap[a])}
                            </Typography>
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
                        {/*
                            <Button size={"small"} onClick={() => {
                                window.alert("Feedback feature not yet implemented!");
                                this.props.giveFeedbackForAnnotation(d);
                            }}>
                                {this.props.localize('annotationPanel.feedback')}
                            </Button>
                        */}
                    </CardActions>
                </Card>
            )
        })
    }

    render() {
        let annotatedDocuments = this.props.annotatedDocuments;
        return [<div className={this.props.classes.wrapper} key={`finishedAnnotationPanelWrapper1`}>
            {isWidthDown("xs", this.props.width) && annotatedDocuments.length > 1 ?
                <SwipeableViews axis={'x'} enableMouseEvents={true} resistance={true} index={this.state.swipeIndex}
                                    onChangeIndex={this.handleChangeIndex}>
                          {this.gridContent(annotatedDocuments, true)}
                    </SwipeableViews>
                :
                <Grid container className={this.props.classes.panel} spacing={2}>
                    {this.gridContent(annotatedDocuments)}
                </Grid>
            }
        </div>, isWidthDown("xs", this.props.width) && annotatedDocuments.length > 1 ?
            <div className={this.props.classes.wrapper}  key={`finishedAnnotationPanelWrapper2`}>
                <Typography variant="caption" display="block" className={this.props.classes.caption}>
                    {this.props.localize('annotationPanel.caption.annotation')} {this.state.swipeIndex + 1}/{annotatedDocuments.length} {this.props.localize('annotationPanel.caption.swipeInfo')}
                </Typography>
            </div> : null];
    }
}

export default withWidth()(withLocalization(withStyles(style)(FinishedAnnotationPanel)));
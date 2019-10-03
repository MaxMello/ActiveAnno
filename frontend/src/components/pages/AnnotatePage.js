// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withLocalization} from "react-localize";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {Button, OutlinedInput, Typography} from "@material-ui/core";
import {connect} from "react-redux";
import {AnnotationConfigActions} from "../../redux/annotationConfig";
import Refresh from "@material-ui/icons/Refresh";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import IconButton from "@material-ui/core/IconButton";
import {AnnotationDataActions, Target} from "../../redux/annotationData";
import AnnotateDocumentCard from "../elements/interaction/AnnotateDocumentCard";
import Hidden from "@material-ui/core/Hidden";
import DefaultPopover from "../elements/DefaultPopover";
import Box from "@material-ui/core/Box";
import Check from "@material-ui/icons/Check";
import OverflowMenuItem from "../elements/OverflowMenuItem";
import Fab from "@material-ui/core/Fab";
import type {ValidationError} from "../helper/ValidateAnnotations";
import {validateAnnotations} from "../helper/ValidateAnnotations";
import {AnnotationAction} from "../../redux/annotation";
import Grid from "@material-ui/core/Grid";
import DocumentDataPanel from "../elements/illustration/DocumentDataPanel";
import type {AnnotationConfigFull, AnnotationConfigState, AnnotationDataState, Span} from "../../types/AnnotationTypes";
import type {
    annotationID,
    Dictionary,
    WithLocalizationComponentProps,
    WithStylesComponentProps
} from "../../types/Types";
import FetchStatus from "../../api/FetchStatus";

type AnnotationProps = WithLocalizationComponentProps & WithStylesComponentProps & {
    annotationConfig: AnnotationConfigState,
    annotationData: AnnotationDataState
};

const style: Function = (theme: Object): Object => ({
    root: {
        marginTop: 64,
        padding: 0,
        width: '100%'
    },
    firstRow: {
        display: 'flex',
        width: '100%',
        flexWrap: 'nowrap',
        [theme.breakpoints.up('md')]: {
            justifyContent: 'center'
        }
    },
    firstRowContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 1280,
        margin: theme.spacing(2),
        flexWrap: 'nowrap',
        flexGrow: 1,
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'start',
            flexWrap: 'nowrap',
            marginBottom: 0
        }
    },
    formControl: {
        [theme.breakpoints.down('sm')]: {
            minWidth: 40,
            maxWidth: 'inherit',
            flexGrow: 1
        },
        [theme.breakpoints.up('md')]: {
            minWidth: 160,
            marginRight: theme.spacing(2),
        }
    },
    label: {
        transform: "translate(13px, 13px) scale(1)"
    },
    input: {
        padding: '12px 16px',
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    contentBody: {
        display: 'flex',
        margin: theme.spacing(2),
        alignItems: 'center'
    },
    grow: {
        flexGrow: 1,
    },
    descriptionButton: {},
    refreshButton: {
        marginLeft: theme.spacing(2),
        marginRight: 0,
        [theme.breakpoints.down('sm')]: {
            marginLeft: 0
        }
    },
    description: {
        flexGrow: 1
    },
    popoverContent: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
    bottomWhitespace: {
        height: theme.spacing(7),
        [theme.breakpoints.up('md')]: {
            height: theme.spacing(9),
        },
        width: '100%'
    },
    fab: {
        bottom: theme.spacing(2),
        right: theme.spacing(3),
        margin: 0,
        top: 'auto',
        left: 'auto',
        position: 'fixed',
        [theme.breakpoints.up('md')]: {
            bottom: theme.spacing(2),
            right: theme.spacing(5),
        }
    },
    noDocuments: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: theme.spacing(8)
    },
    noDocumentsTextRow: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
    },
    noDocumentsButtonRow: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
    },
    noDocumentsButton: {
        margin: theme.spacing(2)
    }
});

class AnnotatePage extends Component<AnnotationProps> {

    constructor(props) {
        super(props);
        this.onConfigurationChange = this.onConfigurationChange.bind(this);
        this.finishDocument = this.finishDocument.bind(this);
    }

    componentWillReceiveProps(nextProps: AnnotationProps) {
        Object.values(nextProps.annotationConfig.configs).sort(function (a, b) {
                return b.priority - a.priority
            }
        ).forEach((c, index) => {
            if (index === 0 && !this.props.annotationConfig.activeConfigID) {
                this.props.loadConfig(c.id);
                this.props.setConfigActive(c.id);
            }
        });
        if (nextProps.annotationConfig.configs && nextProps.annotationConfig.activeConfigID
            && nextProps.annotationConfig.configs[nextProps.annotationConfig.activeConfigID].annotations) {
            // Have active config
            const activeConfig = nextProps.annotationConfig.configs[nextProps.annotationConfig.activeConfigID];
            const documentsForActiveConfig = nextProps.annotationData.documents[activeConfig.id] ? nextProps.annotationData.documents[activeConfig.id] : {};
            const nonFinishedDocuments = Object.values(documentsForActiveConfig).filter(d => !d.finished);
            if(nonFinishedDocuments.length === 0 && nextProps.annotationData.fetchStatus !== FetchStatus.ACTIVE
                 && nextProps.annotationData.fetchStatus !== FetchStatus.ERROR) {
                this.props.triggerRefresh();
            }
        }
    }

    componentDidMount() {
        this.props.startRefreshing();
        this.props.forceRefresh();
    }

    componentWillUnmount() {
        this.props.stopRefreshing();
    }

    onConfigurationChange(event) {
        if (event.target.value) {
            this.props.loadConfig(event.target.value);
            this.props.setConfigActive(event.target.value);
        }
    }

    finishDocument() {
        const validationErrors = validateAnnotations(this.props.annotationConfig.configs[this.props.annotationConfig.activeConfigID],
            this.props.annotationData.documents[this.props.annotationConfig.activeConfigID][this.props.annotationData.activeDocumentID],
            this.props.localize);
        if (Object.keys(validationErrors).length === 0) {
            this.props.sendDocument(this.props.annotationConfig.activeConfigID, this.props.annotationData.activeDocumentID);
        } else {
            this.props.reportValidationErrors(this.props.annotationConfig.activeConfigID, this.props.annotationData.activeDocumentID, validationErrors);
        }
    }

    static getInitialTarget(annotations): string {
        if (Object.values(annotations).flatMap(a => a.targets).flatMap(a => a.type).includes(Target.DOCUMENT)) {
            return Target.DOCUMENT;
        } else if (Object.values(annotations).flatMap(a => a.targets).flatMap(a => a.type).includes(Target.SPAN)) {
            return Target.SPAN;
        } else {
            return null;
        }
    }

    componentDidUpdate() {
        if (this.props.annotationData.autoValidate) {
            const validationErrors = validateAnnotations(this.props.annotationConfig.configs[this.props.annotationConfig.activeConfigID],
                this.props.annotationData.documents[this.props.annotationConfig.activeConfigID][this.props.annotationData.activeDocumentID],
                this.props.localize);
            if (JSON.stringify(this.props.annotationData.documents[this.props.annotationConfig.activeConfigID][this.props.annotationData.activeDocumentID].validationErrors) !== JSON.stringify(validationErrors)) {
                this.props.reportValidationErrors(this.props.annotationConfig.activeConfigID, this.props.annotationData.activeDocumentID, validationErrors);
            }
        }
    }

    render() {
        const configList = Object.values(this.props.annotationConfig.configs).sort(function (a, b) {
                return a.priority - b.priority
            }
        ).map(c => {
            return <OverflowMenuItem value={c.id} key={`annotateConfigItem${c.id}`}>{c.name}</OverflowMenuItem>
        });
        let activeConfig: AnnotationConfigFull = null;
        let documentDataPanel: DocumentDataPanel = null;
        let documentCard: AnnotateDocumentCard = null;
        if (this.props.annotationConfig.configs && this.props.annotationConfig.activeConfigID
            && this.props.annotationConfig.configs[this.props.annotationConfig.activeConfigID].annotations) { // Make sure full config is loaded
            activeConfig = this.props.annotationConfig.configs[this.props.annotationConfig.activeConfigID];
            const documentsForActiveConfig = this.props.annotationData.documents[activeConfig.id] ? this.props.annotationData.documents[activeConfig.id] : {};
            const nonFinishedDocuments = Object.values(documentsForActiveConfig).filter(d => !d.finished);
            if (this.props.annotationData.activeDocumentID && documentsForActiveConfig[this.props.annotationData.activeDocumentID] &&
                !documentsForActiveConfig[this.props.annotationData.activeDocumentID].finished) {
                const activeDocument = this.props.annotationData.documents[activeConfig.id][this.props.annotationData.activeDocumentID];
                documentDataPanel = <DocumentDataPanel config={activeConfig}
                                                       document={activeDocument}
                                                       key={`documentDataPanel${activeConfig.id}Document${activeDocument.documentID}`}/>;
                documentCard = <AnnotateDocumentCard
                    config={activeConfig}
                    document={activeDocument}
                    currentTarget={this.props.annotationData.currentTarget}
                    setDocumentAnnotationValue={this.props.setDocumentAnnotationValue}
                    setSpanAnnotationValue={this.props.setSpanAnnotationValue}
                    setCurrentTarget={this.props.setCurrentTarget}
                    key={`documentCardConfig${activeConfig.id}Document${activeDocument.documentID}`}
                />;
            } else if (nonFinishedDocuments.length > 0) {
                const toBeActiveDocument = nonFinishedDocuments[0];
                console.log("No active document, set following document active", toBeActiveDocument);
                this.props.setDocumentActive(this.props.annotationConfig.activeConfigID,
                    toBeActiveDocument.documentID,
                    AnnotatePage.getInitialTarget(activeConfig.annotations.annotationMap));
            } else {
                documentCard = <Grid container className={this.props.classes.noDocuments}>
                    <Grid item xs={12} className={this.props.classes.noDocumentsTextRow}>
                        <Typography>No more documents for this project are available.</Typography>
                    </Grid>
                    <Grid item xs={12} className={this.props.classes.noDocumentsButtonRow}>
                        <Button className={this.props.classes.noDocumentsButton}>
                            Retry
                        </Button>
                        <Button color={"primary"} variant={"outlined"} className={this.props.classes.noDocumentsButton}>
                            Next project
                        </Button>
                    </Grid>
                </Grid>;
            }
        } else {
            console.log("Don't have active config");
        }
        return <div className={this.props.classes.root}>
            <div className={this.props.classes.firstRow}>
                <div className={this.props.classes.firstRowContent}>
                    <FormControl className={this.props.classes.formControl} variant="outlined">
                        <InputLabel htmlFor="annotateConfig"
                                    classes={{root: this.props.classes.label}}>Project</InputLabel>
                        <Select value={this.props.annotationConfig.activeConfigID}
                                onChange={this.onConfigurationChange}
                                input={<OutlinedInput labelWidth={50} name="configurationID" id="annotateConfig"
                                                      classes={{input: this.props.classes.input}}/>}>
                            {configList}
                        </Select>
                    </FormControl>
                    <Hidden smDown>
                        <Typography variant={'body2'} color={'secondary'} className={this.props.classes.description}>
                            {activeConfig ? activeConfig.description : ""}
                        </Typography>
                    </Hidden>
                    <Hidden mdUp>
                        <DefaultPopover trigger={"CLICK"} targets={
                            <IconButton
                                color="secondary"
                                className={this.props.classes.descriptionButton}>
                                <InfoOutlined/>
                            </IconButton>
                        } content={
                            <Box className={this.props.classes.popoverContent}>
                                {activeConfig ? activeConfig.description : ""}
                            </Box>
                        } keyValue={"configDescriptionPopover"}/>
                    </Hidden>
                    <IconButton
                        color="secondary"
                        onClick={() => {
                            this.props.forceRefresh();
                        }}
                        className={this.props.classes.refreshButton}>
                        <Refresh/>
                    </IconButton>
                </div>
            </div>
            {documentDataPanel}
            {documentCard}
            <div className={this.props.classes.bottomWhitespace}/>
            <Hidden smDown>
                <Fab color="primary" aria-label="Finished" onClick={this.finishDocument}
                     className={this.props.classes.fab}>
                    <Check/>
                </Fab>
            </Hidden>
            <Hidden mdUp>
                <Fab color="primary" size="small" aria-label="Finished" onClick={this.finishDocument}
                     className={this.props.classes.fab}>
                    <Check/>
                </Fab>
            </Hidden>

        </div>
    }
}

const mapStateToProps = (state: AppState): Object => ({
    annotationConfig: state.annotationConfig,
    annotationData: state.annotationData
});

const mapDispatchToProps = (dispatch: Function): Object => {
    return ({
        loadConfig: (configID: string) => {
            dispatch(AnnotationConfigActions.start(configID));
        },
        setConfigActive: (configID: string) => {
            dispatch(AnnotationConfigActions.setActive(configID));
        },
        setDocumentActive: (configurationID: string, documentID: string, currentTarget: string) => {
            dispatch(AnnotationDataActions.setActive(configurationID, documentID, currentTarget));
        },
        setCurrentTarget: (currentTarget: string) => {
            dispatch(AnnotationDataActions.setCurrentTarget(currentTarget));
        },
        setDocumentAnnotationValue: (configurationID: string, documentID: string, annotationID: string, value: any) => {
            dispatch(AnnotationDataActions.setDocumentValue(configurationID, documentID, annotationID, value));
        },
        setSpanAnnotationValue: (configurationID: string, documentID: string, annotationID: string, value: any, spans: Array<Span>) => {
            dispatch(AnnotationDataActions.setSpanValue(configurationID, documentID, annotationID, spans, value));
        },
        sendDocument: (configurationID: string, documentID: string) => {
            dispatch(AnnotationDataActions.initializeSending(configurationID, documentID));
        },
        reportValidationErrors: (configurationID, documentID, validationErrors: Dictionary<annotationID, Array<ValidationError>>) => {
            dispatch(AnnotationDataActions.reportValidationErrors(configurationID, documentID, validationErrors));
        },
        startRefreshing: () => {
            dispatch(AnnotationAction.startRefreshing());
        },
        stopRefreshing: () => {
            dispatch(AnnotationAction.stopRefreshing());
        },
        forceRefresh: () => {
            dispatch(AnnotationAction.forceRefresh());
        },
        triggerRefresh: () => {
            dispatch(AnnotationAction.triggerRefresh());
        }
    });
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization(withStyles(style)(AnnotatePage)));
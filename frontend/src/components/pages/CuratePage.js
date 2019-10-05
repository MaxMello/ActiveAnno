// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withLocalization} from "react-localize";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {Button, OutlinedInput, Typography} from "@material-ui/core";
import {connect} from "react-redux";
import Refresh from "@material-ui/icons/Refresh";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import IconButton from "@material-ui/core/IconButton";
import {Target} from "../../redux/annotationData";
import AnnotateDocumentCard from "../elements/interaction/AnnotateDocumentCard";
import Hidden from "@material-ui/core/Hidden";
import DefaultPopover from "../elements/DefaultPopover";
import Box from "@material-ui/core/Box";
import Check from "@material-ui/icons/Check";
import OverflowMenuItem from "../elements/OverflowMenuItem";
import Fab from "@material-ui/core/Fab";
import type {ValidationError} from "../helper/ValidateAnnotations";
import {validateAnnotations} from "../helper/ValidateAnnotations";
import Grid from "@material-ui/core/Grid";
import DocumentDataPanel from "../elements/illustration/DocumentDataPanel";
import type {AnnotationConfigFull, Span} from "../../types/AnnotationTypes";
import type {AnnotationResult, CurationConfigState, CurationDataState} from "../../types/CurateTypes";
import FinishedAnnotationPanel from "../elements/FinishedAnnotationPanel";
import type {annotationID, AppState, Dictionary, userIdentifier} from "../../types/Types";
import {CurationDataActions} from "../../redux/curationData";
import {CurationAction} from "../../redux/curation";
import {CurationConfigActions} from "../../redux/curationConfig";
import type {UserInfo} from "../../types/PageSetupTypes";
import FetchStatus from "../../api/FetchStatus";

type CurationProps = {
    curationConfig: CurationConfigState,
    curationData: CurationDataState,
    userInfo: Dictionary<userIdentifier, UserInfo>,
    acceptExistingAnnotation: Function,
    copyExistingAnnotation: Function,
    giveFeedbackForAnnotation: Function
};

const style: Function = (theme: Object): Object => ({
    root: theme.pageRoot,
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
    popoverContent: theme.defaultPopoverContent,
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

class CuratePage extends Component<CurationProps> {

    constructor(props) {
        super(props);
        this.onConfigurationChange = this.onConfigurationChange.bind(this);
        this.finishDocument = this.finishDocument.bind(this);
    }

    componentWillReceiveProps(nextProps: CurationProps) {
        Object.values(nextProps.curationConfig.configs).sort(function (a, b) {
                return b.priority - a.priority
            }
        ).forEach((c, index) => {
            if (index === 0 && !this.props.curationConfig.activeConfigID) {
                this.props.loadConfig(c.id);
                this.props.setConfigActive(c.id);
            }
        });
        if (nextProps.curationConfig.configs && nextProps.curationConfig.activeConfigID
            && nextProps.curationConfig.configs[nextProps.curationConfig.activeConfigID].annotations) {
            // Have active config
            const activeConfig = nextProps.curationConfig.configs[nextProps.curationConfig.activeConfigID];
            const documentsForActiveConfig = nextProps.curationData.documents[activeConfig.id] ? nextProps.curationData.documents[activeConfig.id] : {};
            const nonFinishedDocuments = Object.values(documentsForActiveConfig).filter(d => !d.finished);
            if(nonFinishedDocuments.length === 0 && nextProps.curationData.fetchStatus !== FetchStatus.ACTIVE
                && nextProps.curationData.fetchStatus !== FetchStatus.ERROR) {
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
        const validationErrors = validateAnnotations(this.props.curationConfig.configs[this.props.curationConfig.activeConfigID],
            this.props.curationData.documents[this.props.curationConfig.activeConfigID][this.props.curationData.activeDocumentID],
            this.props.localize);
        if (Object.keys(validationErrors).length === 0) {
            this.props.sendDocument(this.props.curationConfig.activeConfigID, this.props.curationData.activeDocumentID);
        } else {
            this.props.reportValidationErrors(this.props.curationConfig.activeConfigID, this.props.curationData.activeDocumentID, validationErrors);
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
        if (this.props.curationData.autoValidate) {
            const validationErrors = validateAnnotations(this.props.curationConfig.configs[this.props.curationConfig.activeConfigID],
                this.props.curationData.documents[this.props.curationConfig.activeConfigID][this.props.curationData.activeDocumentID],
                this.props.localize);
            if (JSON.stringify(this.props.curationData.documents[this.props.curationConfig.activeConfigID][this.props.curationData.activeDocumentID].validationErrors) !== JSON.stringify(validationErrors)) {
                this.props.reportValidationErrors(this.props.curationConfig.activeConfigID, this.props.curationData.activeDocumentID, validationErrors);
            }
        }
    }

    render() {
        const configList = Object.values(this.props.curationConfig.configs).sort(function (a, b) {
                return a.priority - b.priority
            }
        ).map(c => {
            return <OverflowMenuItem value={c.id} key={`curationConfigItem${c.id}`}>{c.name}</OverflowMenuItem>
        });
        let activeConfig: AnnotationConfigFull = null;
        let documentDataPanel: DocumentDataPanel = null;
        let finishedAnnotationsPanel: Array<FinishedAnnotationPanel> = null;
        let documentCard: AnnotateDocumentCard = null;
        if (this.props.curationConfig.configs && this.props.curationConfig.activeConfigID
            && this.props.curationConfig.configs[this.props.curationConfig.activeConfigID].annotations) { // Make sure full config is loaded
            activeConfig = this.props.curationConfig.configs[this.props.curationConfig.activeConfigID];
            const documentsForActiveConfig = this.props.curationData.documents[activeConfig.id] ? this.props.curationData.documents[activeConfig.id] : {};
            const nonFinishedDocuments = Object.values(documentsForActiveConfig).filter(d => !d.finished);
            if (this.props.curationData.activeDocumentID && documentsForActiveConfig[this.props.curationData.activeDocumentID] &&
                !documentsForActiveConfig[this.props.curationData.activeDocumentID].finished) {
                const activeDocument = this.props.curationData.documents[activeConfig.id][this.props.curationData.activeDocumentID];
                documentDataPanel = <DocumentDataPanel config={activeConfig}
                                                       document={activeDocument}
                                                       key={`documentDataPanel${activeConfig.id}Document${activeDocument.documentID}`}/>;
                finishedAnnotationsPanel = <FinishedAnnotationPanel annotatedDocuments={activeDocument.annotations} userInfo={this.props.userInfo}
                                                                    acceptExistingAnnotation={this.props.acceptExistingAnnotation}
                                                                    copyExistingAnnotation={this.props.copyExistingAnnotation}
                                                                    giveFeedbackForAnnotation={this.props.giveFeedbackForAnnotation}
                />;

                documentCard = <AnnotateDocumentCard
                    config={activeConfig}
                    document={activeDocument}
                    currentTarget={this.props.curationData.currentTarget}
                    setDocumentAnnotationValue={this.props.setDocumentAnnotationValue}
                    setSpanAnnotationValue={this.props.setSpanAnnotationValue}
                    setCurrentTarget={this.props.setCurrentTarget}
                    key={`documentCardConfig${activeConfig.id}Document${activeDocument.documentID}`}
                />;
            } else if (nonFinishedDocuments.length > 0) {
                const toBeActiveDocument = nonFinishedDocuments[0];
                console.log("No active document, set following document active", toBeActiveDocument);
                this.props.setDocumentActive(this.props.curationConfig.activeConfigID,
                    toBeActiveDocument.documentID,
                    CuratePage.getInitialTarget(activeConfig.annotations.annotationMap));
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
                        <Select value={this.props.curationConfig.activeConfigID}
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
            {finishedAnnotationsPanel}
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
    curationConfig: state.curationConfig,
    curationData: state.curationData,
    userInfo: state.pageSetup.pageSetup.userInfo
});

const mapDispatchToProps = (dispatch: Function): Object => ({
    loadConfig: (configID: string) => {
        dispatch(CurationConfigActions.start(configID));
    },
    setConfigActive: (configID: string) => {
        dispatch(CurationConfigActions.setActive(configID));
    },
    setDocumentActive: (configurationID: string, documentID: string, currentTarget: string) => {
        dispatch(CurationDataActions.setActive(configurationID, documentID, currentTarget));
    },
    setCurrentTarget: (currentTarget: string) => {
        dispatch(CurationDataActions.setCurrentTarget(currentTarget));
    },
    setDocumentAnnotationValue: (configurationID: string, documentID: string, annotationID: string, value: any) => {
        dispatch(CurationDataActions.setDocumentValue(configurationID, documentID, annotationID, value));
    },
    setSpanAnnotationValue: (configurationID: string, documentID: string, annotationID: string, value: any, spans: Array<Span>) => {
        dispatch(CurationDataActions.setSpanValue(configurationID, documentID, annotationID, spans, value));
    },
    sendDocument: (configurationID: string, documentID: string) => {
        dispatch(CurationDataActions.initializeSending(configurationID, documentID));
    },
    reportValidationErrors: (configurationID, documentID, validationErrors: Dictionary<annotationID, Array<ValidationError>>) => {
        dispatch(CurationDataActions.reportValidationErrors(configurationID, documentID, validationErrors));
    },
    startRefreshing: () => {
        dispatch(CurationAction.startRefreshing());
    },
    stopRefreshing: () => {
        dispatch(CurationAction.stopRefreshing());
    },
    forceRefresh: () => {
        dispatch(CurationAction.forceRefresh());
    },
    triggerRefresh: () => {
        dispatch(CurationAction.triggerRefresh());
    },
    acceptExistingAnnotation: (annotatedDocument: AnnotationResult) => {
        dispatch(CurationDataActions.acceptExistingAnnotation(annotatedDocument.configurationID, annotatedDocument.documentID, annotatedDocument.id));
    },
    copyExistingAnnotation: (annotatedDocument: AnnotationResult) => {
        dispatch(CurationDataActions.copyExistingAnnotation(annotatedDocument));
    },
    giveFeedbackForAnnotation: (annotatedDocument: AnnotationResult) => {
        dispatch(CurationDataActions.giveFeedbackForAnnotation(annotatedDocument));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization(withStyles(style)(CuratePage)));
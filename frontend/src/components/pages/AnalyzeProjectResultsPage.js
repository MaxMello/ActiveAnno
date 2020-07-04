// @flow
import React from 'react';
import {withLocalization} from "react-localize";
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import type {AppState} from "../../types/redux/AppState";
import type {
    AnnotationID,
    Dictionary,
    ProjectID,
    UserIdentifier,
    WithLocalizationComponentProps,
    WithRouterComponentProps,
    WithStylesComponentProps
} from "../../types/Types";
import {makeStyles, Typography} from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Grid from "@material-ui/core/Grid";
import InputWrapper from "../elements/InputWrapper";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Link from '@material-ui/core/Link';
import type {
    AccuracyStatistics,
    AnalyzedDocument,
    AnalyzeProjectRequest,
    AnalyzeProjectResponse,
    PercentageWrapper,
    TopLevelStatistics
} from "../../types/manage/AnalyzeProjectResultsTypes";
import {AnalyzeProjectResultsActions} from "../../redux/manage/manage";
import {KeyboardDateTimePicker} from "@material-ui/pickers";
import {Moment} from "moment";
import FilterConditionInput from "../elements/FilterConditionInput";
import type {FilterCondition} from "../../types/manage/ManageTypes";
import Button from "@material-ui/core/Button";
import theme from "../theme/Theme";
import {Chart} from "react-google-charts";
import Select from "@material-ui/core/Select";
import OverflowMenuItem from "../elements/OverflowMenuItem";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import VirtualizedTable from "../elements/VirtualizedTable";
import DefaultPopover from "../elements/DefaultPopover";
import DocumentDataPanel from "../elements/illustration/DocumentDataPanel";
import {AnnotationResultCreatorTypes} from "../../types/document/annotation/AnnotationResultCreator";
import AnnotationResultCard from "../elements/AnnotationResultCard";

type AnalyzeProjectResultsPageProps =
    WithStylesComponentProps & WithRouterComponentProps & WithLocalizationComponentProps & {
    projectID: ProjectID,
    analyzeProjectRequest: ?AnalyzeProjectRequest,
    analyzeProjectResponse: ?AnalyzeProjectResponse,
    updateAnalyzeProjectRequest: Function,
    startRequest: Function
};

const useStyles = makeStyles(theme => ({
    root: {
        ...theme.pageRoot,
        display: 'flex',
        width: '100%',
        flexWrap: 'nowrap',
        [theme.breakpoints.up('md')]: {
            justifyContent: 'center'
        }
    },
    rootContent: {
        display: 'flex',
        maxWidth: 1280,
        justifyContent: 'center'
    },
    panel: {},
    panelDetails: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    expansionPanelSummary: {
        padding: theme.spacing(0, 2, 0, 2)
    },
    deleteFilterButton: {
        marginTop: theme.spacing(2)
    },
    errorMessage: {
        color: theme.palette.error.dark
    },
    virtTableGrid: {
        height: 500,
        width: "96%"
    },
    downloadButton: {
        margin: theme.spacing(1)
    }
}));

function getTopLevelStatisticsFullDurationChartData(topLevelStatistics: ?TopLevelStatistics,
                                                    userNames: ?Dictionary<UserIdentifier, string>,
                                                    localize: Function)
    : Array<any> {
    if(topLevelStatistics != null) {
        const returnData = [];
        const header = [
            localize("manage.results.chart.annotator"),
            localize("chart.time.seconds")
        ];
        returnData.push(header);
        if(topLevelStatistics.averageAnnotatorFullDuration !== "NaN"
            && Object.keys(topLevelStatistics.perAnnotatorAverageFullDuration).length > 1) {
            returnData.push([localize("manage.results.chart.average"),
                (topLevelStatistics.averageAnnotatorFullDuration / 1000.0)]);
        }
        for(let [name, time] of (Object.entries(topLevelStatistics.perAnnotatorAverageFullDuration): any)) {
            const userName = userNames?.[name] ?? name;
            returnData.push([userName + " (n=" + time.n + ")", time.average / 1000.0])
        }
        return returnData;
    } else {
        return [];
    }
}

function getTopLevelStatisticsInteractionDurationChartData(topLevelStatistics: ?TopLevelStatistics,
                                                           userNames: ?Dictionary<UserIdentifier, string>,
                                                           localize: Function)
    : Array<any> {
    if(topLevelStatistics != null) {
        const returnData = [];
        const header = [
            localize("manage.results.chart.annotator"),
            localize("chart.time.seconds")
        ];
        returnData.push(header);
        if(topLevelStatistics.averageAnnotatorInteractionDuration !== "NaN"
            && Object.keys(topLevelStatistics.perAnnotatorAverageInteractionDuration).length > 1) {
            returnData.push([localize("manage.results.chart.average"),
                topLevelStatistics.averageAnnotatorInteractionDuration / 1000.0]);
        }
        for(let [name, time] of (Object.entries(topLevelStatistics.perAnnotatorAverageInteractionDuration): any)) {
            const userName = userNames?.[name] ?? name;
            returnData.push([userName + " (n=" + time.n + ")", time.average / 1000.0])
        }
        return returnData;
    } else {
        return [];
    }
}

function getTopLevelStatisticsAgreementChartData(topLevelStatistics: ?TopLevelStatistics,
                                                 annotationNames: ?Dictionary<AnnotationID, string>,
                                                 localize: Function)
    : Array<any> {
    if(topLevelStatistics != null) {
        const returnData = [];
        const header = [
            localize("manage.results.chart.annotation"),
            localize("chart.percentage"),
            localize("chart.absolute")
        ];
        returnData.push(header);
        returnData.push([localize("manage.results.chart.allAnnotations") +
            " (n=" + topLevelStatistics.documentAccuracyStatistics.interAnnotatorAgreement.n + ")",
            (topLevelStatistics.documentAccuracyStatistics.interAnnotatorAgreement.percentage * 100),
            topLevelStatistics.documentAccuracyStatistics.interAnnotatorAgreement.absolute]);
        for(let [name, stats] of (Object.entries(topLevelStatistics.perAnnotationAccuracyStatistics): any)) {
            returnData.push([(annotationNames?.[name] ?? name) + " (n=" + stats.interAnnotatorAgreement.n + ")",
                (stats.interAnnotatorAgreement.percentage * 100), stats.interAnnotatorAgreement.absolute])
        }
        return returnData;
    } else {
        return [];
    }
}

function getTopLevelStatisticsAccuracyChartData(topLevelStatistics: ?TopLevelStatistics,
                                                 annotationNames: ?Dictionary<AnnotationID, string>,
                                                 userNames: ?Dictionary<UserIdentifier, string>,
                                                 localize: Function): Array<any> {
    if(topLevelStatistics != null) {
        const returnData = [];
        // Header
        const header = [
            localize("manage.results.chart.annotation"),
            localize("manage.results.chart.average")
        ];
        const annotatorsInOrder = Object.keys(topLevelStatistics.documentAccuracyStatistics.annotatorAccuracy).sort();
        for(let user of annotatorsInOrder) {
            header.push(userNames?.[user] ?? user);
        }
        if(topLevelStatistics.documentAccuracyStatistics.generatorAccuracy != null) {
            header.push(localize("manage.results.chart.generator"));
        }
        returnData.push(header);
        // All annotation / document level
        const allAnnotationData = [localize("manage.results.chart.allAnnotations"),
            (topLevelStatistics.documentAccuracyStatistics.averageAnnotatorAccuracy * 100)];
        for(let user of annotatorsInOrder) {
            const accuracy = ((topLevelStatistics.documentAccuracyStatistics.annotatorAccuracy[user]?.percentage ?? 0)
                * 100);
            allAnnotationData.push(accuracy);
        }
        if(topLevelStatistics.documentAccuracyStatistics.generatorAccuracy != null) {
            allAnnotationData.push(topLevelStatistics.documentAccuracyStatistics.generatorAccuracy.percentage * 100);
        }
        returnData.push(allAnnotationData);
        // Per annotation
        for(let [name, stats] of (Object.entries(topLevelStatistics.perAnnotationAccuracyStatistics): any)) {
            const annotationData = [(annotationNames?.[name] ?? name),
                stats.averageAnnotatorAccuracy * 100];
            for(let user of annotatorsInOrder) {
                const accuracy = (stats.annotatorAccuracy[user].percentage ?? 0) * 100;
                annotationData.push(accuracy);
            }
            if(topLevelStatistics.documentAccuracyStatistics.generatorAccuracy != null) {
                annotationData.push((stats.generatorAccuracy.percentage ?? 0) * 100);
            }
            returnData.push(annotationData);
        }
        return returnData;
    } else {
        return [];
    }
}

function getTopLevelStatisticsAbsoluteCorrectnessChartData(topLevelStatistics: ?TopLevelStatistics,
                                                annotationNames: ?Dictionary<AnnotationID, string>,
                                                userNames: ?Dictionary<UserIdentifier, string>,
                                                localize: Function): Array<any> {
    if(topLevelStatistics != null) {
        const returnData = [];
        // Header
        const header = [
            localize("manage.results.chart.annotation")
        ];
        const annotatorsInOrder = Object.keys(topLevelStatistics.documentAccuracyStatistics.annotatorAccuracy).sort();
        for(let user of annotatorsInOrder) {
            header.push(userNames?.[user] ?? user);
        }
        if(topLevelStatistics.documentAccuracyStatistics.generatorAccuracy != null) {
            header.push(localize("manage.results.chart.generator"));
        }
        returnData.push(header);
        // All annotation / document level
        const allAnnotationData = [localize("manage.results.chart.allAnnotations")];
        for(let user of annotatorsInOrder) {
            const accuracy = (topLevelStatistics.documentAccuracyStatistics.annotatorAccuracy[user]?.absolute ?? 0);
            allAnnotationData.push(accuracy);
        }
        if(topLevelStatistics.documentAccuracyStatistics.generatorAccuracy != null) {
            allAnnotationData.push(topLevelStatistics.documentAccuracyStatistics.generatorAccuracy.absolute);
        }
        returnData.push(allAnnotationData);
        // Per annotation
        for(let [name, stats] of (Object.entries(topLevelStatistics.perAnnotationAccuracyStatistics): any)) {
            const annotationData = [(annotationNames?.[name] ?? name)];
            for(let user of annotatorsInOrder) {
                const accuracy = stats.annotatorAccuracy[user]?.absolute ?? 0;
                annotationData.push(accuracy);
            }
            if(topLevelStatistics.documentAccuracyStatistics.generatorAccuracy != null) {
                annotationData.push(stats.generatorAccuracy.absolute);
            }
            returnData.push(annotationData);
        }
        return returnData;
    } else {
        return [];
    }
}

function buildJSON(topLevelStatistics: TopLevelStatistics, userNames: Dictionary<UserIdentifier, string>,
                   annotationNames: Dictionary<AnnotationID, string>) {
    // Duration
    const statistics: any = {
        "Average full duration annotator average (s)": (topLevelStatistics.averageAnnotatorFullDuration / 1000.0)
    }
    for(let [userIdentifier, duration] of
        (Object.entries(topLevelStatistics.perAnnotatorAverageFullDuration): any)) {
        const userName = userNames[userIdentifier] ?? userIdentifier;
        statistics["Average full duration " + userName + " (s)"] = (duration.average / 1000.0);
        statistics["Average full duration " + userName + " n samples"] = duration.n;
    }
    statistics["Interaction duration average (s)"] = (topLevelStatistics.averageAnnotatorInteractionDuration / 1000.0)
    for(let [userIdentifier, duration] of
        (Object.entries(topLevelStatistics.perAnnotatorAverageInteractionDuration): any)) {
        const userName = userNames[userIdentifier] ?? userIdentifier;
        statistics["Average interaction duration " + userName + " (s)"] = (duration.average / 1000.0);
        statistics["Average interaction duration " + userName + " (n samples)"] = duration.n;
    }
    // Agreement
    statistics["Inter annotator agreement all annotations (%)"] = topLevelStatistics.documentAccuracyStatistics
        .interAnnotatorAgreement.percentage * 100;
    statistics["Inter annotator agreement all annotations (absolute value)"] = (topLevelStatistics
        .documentAccuracyStatistics.interAnnotatorAgreement.absolute);
    statistics["Inter annotator agreement all annotations (n samples)"] = topLevelStatistics.documentAccuracyStatistics
        .interAnnotatorAgreement.n;
    for(let [annotationID, accStats] of (Object.entries(topLevelStatistics.perAnnotationAccuracyStatistics): any)) {
        const annotationName = annotationNames[annotationID] ?? annotationID;
        statistics["Inter annotator agreement " + annotationName + " (%)"] = (accStats.interAnnotatorAgreement
            .percentage * 100);
        statistics["Inter annotator agreement " + annotationName + " (absolute value)"] = (accStats
            .interAnnotatorAgreement.absolute);
        statistics["Inter annotator agreement " + annotationName + " (n samples)"] = (accStats
            .interAnnotatorAgreement.n);
    }
    // Accuracy
    statistics["Accuracy all annotations annotators average (%)"] = (topLevelStatistics.documentAccuracyStatistics
        .averageAnnotatorAccuracy * 100);
    for(let [userIdentifier, percentWrapper: PercentageWrapper] of
        (Object.entries(topLevelStatistics.documentAccuracyStatistics.annotatorAccuracy): any)) {
        const userName = userNames[userIdentifier] ?? userIdentifier;
        statistics["Accuracy all annotations " + userName + " (%)"] = (percentWrapper.percentage * 100);
        statistics["Accuracy all annotations " + userName + " (absolute value)"] = percentWrapper.absolute;
        statistics["Accuracy all annotations " + userName + " (n samples)"] = percentWrapper.n;
    }
    statistics["Accuracy all annotations Generator (%)"] = (topLevelStatistics.documentAccuracyStatistics
        .generatorAccuracy?.percentage ?? 0) * 100;
    statistics["Accuracy all annotations Generator (absolute value)"] = topLevelStatistics.documentAccuracyStatistics
        .generatorAccuracy?.absolute ?? 0;
    statistics["Accuracy all annotations Generator (n samples)"] = topLevelStatistics.documentAccuracyStatistics
        .generatorAccuracy?.n ?? 0;
    // Accuracy per annotation
    for(let [annotationID, accStats: AccuracyStatistics] of
        (Object.entries(topLevelStatistics.perAnnotationAccuracyStatistics): any)) {
        const annotationName = annotationNames[annotationID] ?? annotationID;
        statistics["Accuracy " + annotationName + " annotators average (%)"] =
            (accStats.averageAnnotatorAccuracy * 100);
        for(let [userIdentifier, percentWrapper: PercentageWrapper] of
            (Object.entries(accStats.annotatorAccuracy): any)) {
            const userName = userNames[userIdentifier] ?? userIdentifier;
            statistics["Accuracy " + annotationName + " " + userName + " (%)"] = (percentWrapper.percentage * 100);
            statistics["Accuracy " + annotationName + " " + userName + " (absolute value)"] = percentWrapper.absolute;
            statistics["Accuracy " + annotationName + " " + userName + " (n samples)"] = percentWrapper.n;
        }
        statistics["Accuracy " + annotationName + " Generator (%)"] =
            (accStats.generatorAccuracy?.percentage ?? 0) * 100;
        statistics["Accuracy " + annotationName + " Generator (absolute value)"] =
            accStats.generatorAccuracy?.absolute ?? 0;
        statistics["Accuracy " + annotationName + " Generator (n samples)"] =
            accStats.generatorAccuracy?.n ?? 0;
    }
    return statistics;
}

function buildCSV(topLevelStatistics: TopLevelStatistics, userNames: Dictionary<UserIdentifier, string>,
                  annotationNames: Dictionary<AnnotationID, string>) {
    const statistics = buildJSON(topLevelStatistics, userNames, annotationNames);
    // JSON TO CSV
    // based on: https://stackoverflow.com/a/31536517
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(statistics);
    let csv = [header.join(','), header.map(fieldName => JSON.stringify(statistics[fieldName], replacer)).join(',')];
    csv = csv.join('\r\n');
    return csv;
}

/**
 * The AnalyzeProjectResultsPage is a page to analyze annotation results for a project given some query parameters,
 * showing agreement, accuracy and annotation duration.
 */
function AnalyzeProjectResultsPage(props: AnalyzeProjectResultsPageProps) {
    const classes = useStyles();
    if(props.analyzeProjectRequest == null) {
        // Default request
        props.updateAnalyzeProjectRequest({
            projectID: props.projectID,
            annotators: [],
            curators: [],
            finalizedBefore: null,
            finalizedAfter: null,
            ignoreDocumentIDs: [],
            ignoreAnnotationResultIDs: [],
            additionalFilter: null
        });
    }
    const annotatorsInOrder = Object.keys(props.analyzeProjectResponse?.topLevelStatistics
        ?.documentAccuracyStatistics?.annotatorAccuracy ?? {}).sort();
    const documentLevelTableColumns = [
        {
            width: 350,
            label: props.localize("manage.results.table.documentID"),
            dataKey: 'documentID',
            align: 'left'
        },
        {
            width: 250,
            label: props.localize("manage.results.table.generatorCorrect"),
            dataKey: 'generatorCorrect'
        }
    ]

    annotatorsInOrder.forEach(annotator => documentLevelTableColumns.push({
        width: 250,
        label: props.analyzeProjectResponse?.userNames?.[annotator] ?? annotator + " "
            + props.localize("manage.results.table.annotatorCorrect"),
        dataKey: annotator
    }));
    documentLevelTableColumns.push({
        width: 250,
        label: props.localize("manage.results.table.annotatorsAgree"),
        dataKey: 'annotatorsAgree'
    })

    const documentLevelTableRows = props.analyzeProjectResponse?.analyzedDocuments?.map((doc: AnalyzedDocument) => {
        const perAnnotatorCorrectness: any = Object.fromEntries(annotatorsInOrder.map(annotator => {
            const corr = doc.documentStatistics.annotatorCorrectness[annotator]
            const annotationResult = doc.analyzedAnnotationResults.filter((r: any) => {
                return r.creator.type === AnnotationResultCreatorTypes.ANNOTATOR && r.creator.identifier === annotator;
            })[0];
            const annotatorPopover = annotationResult == null ? (corr ? "✓" : "✕") : (
                <DefaultPopover trigger={"CLICK"}
                     targets={<Link href="#"
                                    onClick={(event) => event.preventDefault()}
                                    color="inherit">
                         {corr ? "✓" : "✕"}
                     </Link>}
                     content={
                         <AnnotationResultCard annotationResult={annotationResult}
                                               userNames={props.analyzeProjectResponse?.userNames ?? {}}
                                               annotateProject={props.analyzeProjectResponse?.annotateProject}/>
                     } keyValue={`generatorRow${doc.documentID}`}/>
            )
            return [annotator, (corr === null ? props.localize("manage.results.table.na") : annotatorPopover)]
        }));
        
        const generatorAR = doc.analyzedAnnotationResults
            .filter(r => {
                return r.creator.type === AnnotationResultCreatorTypes.GENERATORS;
            })[0];
        const generatorPopover = generatorAR == null ? (doc.documentStatistics.generatorCorrect === null ?
            props.localize("manage.results.table.na") : (doc.documentStatistics.generatorCorrect ? "✓" : "✕")) : (
            <DefaultPopover trigger={"CLICK"}
                            targets={<Link href="#"
                                           onClick={(event) => event.preventDefault()}
                                           color="inherit">
                                {doc.documentStatistics.generatorCorrect === null ? 
                                    props.localize("manage.results.table.na") : (
                                    doc.documentStatistics.generatorCorrect ? "✓" : "✕")}
                            </Link>}
                            content={
                                <AnnotationResultCard annotationResult={generatorAR}
                                                      userNames={props.analyzeProjectResponse?.userNames ?? {}}
                                                      annotateProject={props.analyzeProjectResponse?.annotateProject}/>
                            } keyValue={`generatorRow${doc.documentID}`}/>
        )

        return {
            "documentID": <DefaultPopover trigger={"CLICK"}
                                          targets={<Link href="#"
                                                   onClick={(event) => event.preventDefault()}
                                                   color="inherit">
                                              {doc.documentID}
                                            </Link>}
                  content={
                      props.analyzeProjectResponse?.annotateProject ?
                      <DocumentDataPanel project={props.analyzeProjectResponse?.annotateProject}
                                         document={doc}/> : ""
                  } keyValue={`documentRow${doc.documentID}`}/>,
            "generatorCorrect": generatorPopover,
            ...perAnnotatorCorrectness,
            "annotatorsAgree": doc.documentStatistics.annotatorsAgree ? "✓" : "✕"
        }
    }) ?? [];

    const [expanded, setExpanded] = React.useState(true);
    return <div className={classes.root}>
        <Grid container spacing={4} className={classes.rootContent}>
            <Grid item xs={12}>
                <ExpansionPanel defaultExpanded={expanded} className={classes.panel}
                                onChange={(_, expanded) => {
                                    setExpanded(expanded)
                                }}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} classes={{
                        root: classes.expansionPanelSummary
                    }}>
                        <Typography variant={"h5"}> {props.localize("manage.results.filterBox")} </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails classes={{root: classes.panelDetails}}>
                        {props.analyzeProjectRequest != null &&
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={6}>
                                    <InputWrapper name={props.localize("manage.results.filter.annotators.name")}
                                                  caption={props.localize("manage.results.filter.annotators.caption")}
                                                  keyValue={"filterAnnotatorsInput"} disabled={false}>
                                        <Autocomplete
                                            key={`filterAnnotatorsInputSelect`}
                                            fullWidth
                                            freeSolo={true}
                                            value={props.analyzeProjectRequest?.annotators ?? []}
                                            multiple={true}
                                            disableCloseOnSelect={false}
                                            className={classes.defaultFormControl}
                                            autoHighlight={false}
                                            options={[]}
                                            getOptionLabel={(option: string) => {
                                                return option
                                            }}
                                            onChange={(_, value: Array<string>) => {
                                                props.updateAnalyzeProjectRequest({
                                                    ...props.analyzeProjectRequest,
                                                    annotators: value
                                                });
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                />
                                            )}
                                        />
                                    </InputWrapper>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <InputWrapper name={props.localize("manage.results.filter.curators.name")}
                                                  caption={props.localize("manage.results.filter.curators.caption")}
                                                  keyValue={"filterCuratorsInput"} disabled={false}>
                                        <Autocomplete
                                            key={`filterCuratorsInputSelect`}
                                            fullWidth
                                            freeSolo={true}
                                            value={props.analyzeProjectRequest?.curators ?? []}
                                            multiple={true}
                                            disableCloseOnSelect={false}
                                            className={classes.defaultFormControl}
                                            autoHighlight={false}
                                            options={[]}
                                            getOptionLabel={(option: string) => {
                                                return option
                                            }}
                                            onChange={(_, value: Array<string>) => {
                                                props.updateAnalyzeProjectRequest({
                                                    ...props.analyzeProjectRequest,
                                                    curators: value
                                                });
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                />
                                            )}
                                        />
                                    </InputWrapper>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <KeyboardDateTimePicker
                                        label={props.localize("manage.results.filter.finalizedAfter.name")}
                                        className={classes.defaultFormControl}
                                        fullWidth
                                        value={props.analyzeProjectRequest?.finalizedAfter}
                                        ampm={false}
                                        emptyLabel={props.localize("daterange.start.empty")}
                                        format={props.localize("dateTimeFormat")}
                                        inputVariant={"outlined"}
                                        clearable={true}
                                        autoOk={true}
                                        invalidDateMessage={props.localize("daterange.invalid.msg")}
                                        invalidLabel={props.localize("daterange.invalid.label")}
                                        okLabel={props.localize("daterange.dialog.ok")}
                                        clearLabel={props.localize("daterange.dialog.clear")}
                                        cancelLabel={props.localize("daterange.dialog.cancel")}
                                        onChange={(date: ?Moment) => {
                                            props.updateAnalyzeProjectRequest({
                                                ...props.analyzeProjectRequest,
                                                finalizedAfter: date?.valueOf() ?? null
                                            });
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <KeyboardDateTimePicker
                                        label={props.localize("manage.results.filter.finalizedBefore.name")}
                                        className={classes.defaultFormControl}
                                        fullWidth
                                        value={props.analyzeProjectRequest?.finalizedBefore}
                                        ampm={false}
                                        emptyLabel={props.localize("daterange.end.empty")}
                                        format={props.localize("dateTimeFormat")}
                                        inputVariant={"outlined"}
                                        clearable={true}
                                        autoOk={true}
                                        invalidDateMessage={props.localize("daterange.invalid.msg")}
                                        invalidLabel={props.localize("daterange.invalid.label")}
                                        okLabel={props.localize("daterange.dialog.ok")}
                                        clearLabel={props.localize("daterange.dialog.clear")}
                                        cancelLabel={props.localize("daterange.dialog.cancel")}
                                        onChange={(date: ?Moment) => {
                                            props.updateAnalyzeProjectRequest({
                                                ...props.analyzeProjectRequest,
                                                finalizedBefore: date?.valueOf() ?? null
                                            });
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <InputWrapper name={props.localize("manage.results.filter.ignoreDocuments.name")}
                                                  caption={props.localize(
                                                      "manage.results.filter.ignoreDocuments.caption"
                                                  )}
                                                  keyValue={"filterIgnoreDocumentsInput"} disabled={false}>
                                        <Autocomplete
                                            key={`filterIgnoreDocumentsInputSelect`}
                                            fullWidth
                                            freeSolo={true}
                                            value={props.analyzeProjectRequest?.ignoreDocumentIDs ?? []}
                                            multiple={true}
                                            disableCloseOnSelect={false}
                                            className={classes.defaultFormControl}
                                            autoHighlight={false}
                                            options={[]}
                                            getOptionLabel={(option: string) => {
                                                return option
                                            }}
                                            onChange={(_, value: Array<string>) => {
                                                props.updateAnalyzeProjectRequest({
                                                    ...props.analyzeProjectRequest,
                                                    ignoreDocumentIDs: value
                                                });
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                />
                                            )}
                                        />
                                    </InputWrapper>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <InputWrapper
                                        name={props.localize("manage.results.filter.ignoreAnnotationResults.name")}
                                        caption={props.localize(
                                            "manage.results.filter.ignoreAnnotationResults.caption"
                                        )}
                                        keyValue={"filterIgnoreAnnotationResultsInput"} disabled={false}>
                                        <Autocomplete
                                            key={`filterIgnoreAnnotationResultsInputSelect`}
                                            fullWidth
                                            freeSolo={true}
                                            value={props.analyzeProjectRequest?.ignoreAnnotationResultIDs ?? []}
                                            multiple={true}
                                            disableCloseOnSelect={false}
                                            className={classes.defaultFormControl}
                                            autoHighlight={false}
                                            options={[]}
                                            getOptionLabel={(option: string) => {
                                                return option
                                            }}
                                            onChange={(_, value: Array<string>) => {
                                                props.updateAnalyzeProjectRequest({
                                                    ...props.analyzeProjectRequest,
                                                    ignoreAnnotationResultIDs: value
                                                });
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                />
                                            )}
                                        />
                                    </InputWrapper>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <InputWrapper
                                        name={props.localize(
                                            "manage.results.filter.handlingPolicyType.name")}
                                        caption={props.localize(
                                            "manage.results.filter.handlingPolicyType.caption"
                                        )}
                                        keyValue={"filterIhandlingPolicyTypeInput"}
                                        disabled={false}>
                                        <Select fullWidth
                                                variant={"outlined"}
                                                value={props.analyzeProjectRequest
                                            ?.generatedAnnotationResultHandlingPolicyType ?? ""}
                                                onChange={e => props.updateAnalyzeProjectRequest({
                                                    ...props.analyzeProjectRequest,
                                                    generatedAnnotationResultHandlingPolicyType:
                                                        e.target.value === "" ? null : e.target.value
                                                })}>
                                            <OverflowMenuItem value={""}>
                                                {props.localize(
                                                    'manage.results.filter.handlingPolicyType.null')
                                                }
                                            </OverflowMenuItem>
                                            <OverflowMenuItem value={"Ignore"}>
                                                {props.localize(
                                                    'manage.results.filter.handlingPolicyType.ignore')
                                                }
                                            </OverflowMenuItem>
                                            <OverflowMenuItem value={"Preselection"}>
                                                {props.localize(
                                                    'manage.results.filter.handlingPolicyType.preselection')
                                                }
                                            </OverflowMenuItem>
                                            <OverflowMenuItem value={"GeneratorAsAnnotator"}>
                                                {props.localize(
                                                    'manage.results.filter.handlingPolicyType.generatorAsAnnotator')
                                                }
                                            </OverflowMenuItem>
                                        </Select>
                                    </InputWrapper>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <InputWrapper
                                        name={props.localize(
                                            "manage.results.filter.onlySubset.name")}
                                        caption={props.localize(
                                            "manage.results.filter.onlySubset.caption"
                                        )}
                                        keyValue={"filterOnlySubsetCheckboxes"}
                                        disabled={false}>
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={props.analyzeProjectRequest?.onlyGeneratorIncorrect
                                                        ?? false}
                                                    onChange={(e) => {
                                                        props.updateAnalyzeProjectRequest({
                                                            ...props.analyzeProjectRequest,
                                                            onlyGeneratorIncorrect: e.target.checked
                                                        })
                                                    }}
                                                    name="onlyGeneratorIncorrect"
                                                    color="primary"
                                                />
                                            }
                                            label={props.localize(
                                                'manage.results.filter.onlyGeneratorIncorrect.name')}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={props.analyzeProjectRequest?.onlyAnnotatorDisagreement
                                                    ?? false}
                                                    onChange={(e) => {
                                                        props.updateAnalyzeProjectRequest({
                                                            ...props.analyzeProjectRequest,
                                                            onlyAnnotatorDisagreement: e.target.checked
                                                        })
                                                    }}
                                                    name="onlyAnnotatorDisagreement"
                                                    color="primary"
                                                />
                                            }
                                            label={props.localize(
                                                'manage.results.filter.onlyAnnotatorDisagreement.name')}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={props.analyzeProjectRequest?.onlyAnyAnnotatorIncorrect
                                                    ?? false}
                                                    onChange={(e) => {
                                                        props.updateAnalyzeProjectRequest({
                                                            ...props.analyzeProjectRequest,
                                                            onlyAnyAnnotatorIncorrect: e.target.checked
                                                        })
                                                    }}
                                                    name="onlyAnyAnnotatorIncorrect"
                                                    color="primary"
                                                />
                                            }
                                            label={props.localize(
                                                'manage.results.filter.onlyAnyAnnotatorIncorrect.name')
                                            }
                                        />
                                    </FormGroup>
                                    </InputWrapper>
                                </Grid>
                                <Grid item xs={12}>
                                    { props.analyzeProjectRequest?.additionalFilter != null ?
                                        <FilterConditionInput localize={props.localize}
                                                              filter={props.analyzeProjectRequest?.additionalFilter}
                                                              updateFilter={(filterCondition: ?FilterCondition) => {
                                                                  props.updateAnalyzeProjectRequest({
                                                                      ...props.analyzeProjectRequest,
                                                                      additionalFilter: filterCondition
                                                                  });
                                                              }}
                                        />
                                        : <Button fullWidth
                                                  onClick={() => {
                                                      props.updateAnalyzeProjectRequest({
                                                          ...props.analyzeProjectRequest,
                                                          additionalFilter: {}
                                                      });
                                                  }}
                                            >{props.localize("manage.results.filter.add")}
                                        </Button>
                                    }
                                    { props.analyzeProjectRequest?.additionalFilter != null ?
                                        <Button fullWidth
                                                className={classes.deleteFilterButton}
                                            onClick={() => {
                                                props.updateAnalyzeProjectRequest({
                                                    ...props.analyzeProjectRequest,
                                                    additionalFilter: null
                                                });
                                        }}>
                                            {props.localize("manage.results.filter.remove")}
                                        </Button>
                                        : null
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <Button className={classes.startRequestButton}
                                            color={"primary"}
                                            onClick={() => {
                                                props.startRequest(props.analyzeProjectRequest);
                                            }}>
                                        {props.localize("manage.results.startRequest")}
                                    </Button>
                                </Grid>
                            </Grid>
                        }
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Grid>
            { props.analyzeProjectResponse?.errorMessage &&
                <Grid item xs={12}>
                    <Typography variant={"body1"} className={classes.errorMessage}>
                    {props.localize("manage.results.errorMessage")}{props.analyzeProjectResponse?.errorMessage ?? ""}
                    </Typography>
                </Grid>
            }
            { props.analyzeProjectResponse?.topLevelStatistics != null &&
                <Grid item xs={12}>
                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={6}>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>{props.localize("chart.loading")}</div>}
                                data={getTopLevelStatisticsFullDurationChartData(
                                    props.analyzeProjectResponse?.topLevelStatistics,
                                    props.analyzeProjectResponse?.userNames,
                                    props.localize
                                )}
                                options={{
                                    chart: {
                                        title: props.localize("manage.results.chart.fullDuration"),
                                        subtitle: props.localize("manage.results.chart.fullDuration.subtitle")
                                    },
                                    chartArea: { width: '50%' },
                                    hAxis: {
                                        title: props.localize("chart.time.seconds"),
                                        minValue: 0
                                    },
                                    bars: 'horizontal',
                                    vAxis: {
                                        title: props.localize("manage.results.chart.annotator")
                                    },
                                    colors: [theme.palette.primary.main, theme.palette.primary.dark,
                                        theme.palette.primary.light]
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>{props.localize("chart.loading")}</div>}
                                data={getTopLevelStatisticsInteractionDurationChartData(
                                    props.analyzeProjectResponse?.topLevelStatistics,
                                    props.analyzeProjectResponse?.userNames,
                                    props.localize
                                )}
                                options={{
                                    chart: {
                                        title: props.localize("manage.results.chart.interactionDuration"),
                                        subtitle: props.localize("manage.results.chart.interactionDuration.subtitle")
                                    },
                                    chartArea: { width: '50%' },
                                    hAxis: {
                                        title: props.localize("chart.time.seconds"),
                                        minValue: 0
                                    },
                                    bars: 'horizontal',
                                    vAxis: {
                                        title: props.localize("manage.results.chart.annotator")
                                    },
                                    colors: [theme.palette.primary.main, theme.palette.primary.dark,
                                        theme.palette.primary.light]
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Chart
                                width={'100%'}
                                height={'600px'}
                                chartType="Bar"
                                loader={<div>{props.localize("chart.loading")}</div>}
                                data={getTopLevelStatisticsAgreementChartData(
                                    props.analyzeProjectResponse?.topLevelStatistics,
                                    props.analyzeProjectResponse?.annotationNames,
                                    props.localize
                                )}
                                options={{
                                    chart: {
                                        title: props.localize("manage.results.chart.agreement"),
                                        subtitle: props.localize("manage.results.chart.agreement.subtitle")
                                    },
                                    chartArea: { width: '50%' },
                                    colors: [theme.palette.primary.main, theme.palette.primary.dark,
                                        theme.palette.primary.light],
                                    bars: 'horizontal',
                                    vAxis: {
                                        title: props.localize("manage.results.chart.annotation")
                                    },
                                    series: {
                                        "0": { axis: "percentage"},
                                        "1": { axis: "absolute"}
                                    },
                                    axes: {
                                        x: {
                                            percentage: {
                                                label: props.localize("chart.percentage"),
                                                minValue: 0,
                                                maxValue: 100,
                                                side: "top"
                                            },
                                            absolute: {
                                                label: props.localize("chart.absolute")
                                            }
                                        }
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Chart
                                width={'100%'}
                                height={'600px'}
                                chartType="Bar"
                                loader={<div>{props.localize("chart.loading")}</div>}
                                data={getTopLevelStatisticsAccuracyChartData(
                                    props.analyzeProjectResponse?.topLevelStatistics,
                                    props.analyzeProjectResponse?.annotationNames,
                                    props.analyzeProjectResponse?.userNames,
                                    props.localize
                                )}
                                options={{
                                    chart: {
                                        title: props.localize("manage.results.chart.accuracy"),
                                        subtitle: props.localize("manage.results.chart.accuracy.subtitle")
                                    },
                                    chartArea: { width: '50%' },
                                    colors: [theme.palette.primary.main, theme.palette.primary.dark,
                                        theme.palette.primary.light, theme.palette.secondary.main,
                                        theme.palette.secondary.dark, theme.palette.secondary.light],
                                    bars: 'horizontal',
                                    hAxis: {
                                        title: props.localize("chart.percentage"),
                                        minValue: 0,
                                        maxValue: 100
                                    },
                                    vAxis: {
                                        title: props.localize("manage.results.chart.annotation")
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Chart
                                width={'100%'}
                                height={'600px'}
                                chartType="Bar"
                                loader={<div>{props.localize("chart.loading")}</div>}
                                data={getTopLevelStatisticsAbsoluteCorrectnessChartData(
                                    props.analyzeProjectResponse?.topLevelStatistics,
                                    props.analyzeProjectResponse?.annotationNames,
                                    props.analyzeProjectResponse?.userNames,
                                    props.localize
                                )}
                                options={{
                                    chart: {
                                        title: props.localize("manage.results.chart.correctness"),
                                        subtitle: props.localize("manage.results.chart.correctness.subtitle")
                                    },
                                    chartArea: { width: '50%' },
                                    colors: [theme.palette.primary.main, theme.palette.primary.dark,
                                        theme.palette.primary.light, theme.palette.secondary.main,
                                        theme.palette.secondary.dark, theme.palette.secondary.light],
                                    bars: 'horizontal',
                                    hAxis: {
                                        title: props.localize("manage.results.char.absoluteCorrect"),
                                        minValue: 0
                                    },
                                    vAxis: {
                                        title: props.localize("manage.results.chart.annotation")
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            }
            {
                props.analyzeProjectResponse?.analyzedDocuments &&
                <Grid item xs={12}>
                    <ExpansionPanel defaultExpanded={true} className={classes.expansionPanel}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography variant="body1">{
                                props.localize('manage.results.table.documentStatistics')
                            }</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.virtTableGrid}>
                            <VirtualizedTable
                                rowCount={documentLevelTableRows.length}
                                rowGetter={({ index }) => documentLevelTableRows[index] ?? null}
                                columns={documentLevelTableColumns}
                            />
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Grid>
            }
            {
                props.analyzeProjectResponse?.topLevelStatistics && <Grid item xs={12}>
                    <Button color={"primary"}
                            variant={"contained"}
                            className={classes.downloadButton}
                            onClick={() => {
                                const csv = buildCSV(props.analyzeProjectResponse?.topLevelStatistics,
                                props.analyzeProjectResponse?.userNames ?? {},
                                props.analyzeProjectResponse?.annotationNames ?? {});
                                let csvContent = "data:text/csv;charset=utf-8," + csv;
                                const encodedUri = encodeURI(csvContent);
                                window.open(encodedUri);
                            }}>
                        {props.localize("manage.results.downloadCsv")}
                    </Button>
                    <Button color={"primary"}
                            className={classes.downloadButton}
                            variant={"contained"}
                            onClick={() => {
                                let json = buildJSON(props.analyzeProjectResponse?.topLevelStatistics,
                                    props.analyzeProjectResponse?.userNames ?? {},
                                    props.analyzeProjectResponse?.annotationNames ?? {});
                                json = JSON.stringify(json);
                                let jsonContent = "data:application/json;charset=utf-8," + json;
                                const encodedUri = encodeURI(jsonContent);
                                window.open(encodedUri);
                            }}>
                        {props.localize("manage.results.downloadJson")}
                    </Button>
                </Grid>
            }
        </Grid>
    </div>;
}

const mapStateToProps = (state: AppState, ownProps: AnalyzeProjectResultsPageProps): Object => {
    const projectID: ProjectID = ownProps.match.params.id;
    return {
        projectID: projectID,
        analyzeProjectRequest: state.manage.projectAnalysis[projectID]?.analyzeProjectRequest,
        analyzeProjectResponse: state.manage.projectAnalysis[projectID]?.analyzeProjectResponse,
    };
};

const mapDispatchToProps = (dispatch: Function): Object => ({
    updateAnalyzeProjectRequest: (analyzeProjectRequest: AnalyzeProjectRequest) => {
        dispatch(AnalyzeProjectResultsActions.updateRequest(analyzeProjectRequest));
    },
    startRequest: (analyzeProjectRequest: AnalyzeProjectRequest) => {
        dispatch(AnalyzeProjectResultsActions.startRequest(analyzeProjectRequest));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withLocalization((AnalyzeProjectResultsPage))));

// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import {withLocalization} from "react-localize";
import {Link, withRouter} from "react-router-dom";
import type {
    AnnotationID,
    Dictionary,
    ProjectID,
    WithLocalizationComponentProps,
    WithRouterComponentProps,
    WithStylesComponentProps
} from "../../types/Types";
import type {ManageListProject, ManageProject, NewManageProject} from "../../types/manage/ManageTypes";
import {connect} from "react-redux";
import {GenerateAnnotationsActions, ManageProjectListActions, UploadDocumentsActions} from "../../redux/manage/manage";
import Grid from "@material-ui/core/Grid";
import type {AppState} from "../../types/redux/AppState";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import type {AnnotationDefinition} from "../../types/annotationdefinition/AnnotationDefinition";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import {
    LoadAnnotationDefinitionsActions,
    LoadAnnotationGeneratorsActions,
    UpdateAnnotationGeneratorActions
} from "../../redux/manage/manageAnnotationDefinitions";
import CircularProgress from "@material-ui/core/CircularProgress";
import type {ManageProjectInState} from "../../types/redux/ManageState";
import FetchStatus from "../../api/helper/FetchStatus";
import {Check, ErrorOutline} from "@material-ui/icons";
import type {
    AnnotationGenerator,
    AnnotationGeneratorInStore
} from "../../types/annotationdefinition/AnnotationGenerator";

type ContentProps = WithStylesComponentProps & WithRouterComponentProps & WithLocalizationComponentProps & {
    projects: Dictionary<ProjectID, ManageListProject | ManageProject>,
    annotationDefinitions: Dictionary<AnnotationID, AnnotationDefinition>,
    newProject: NewManageProject,
    newAnnotationDefinition: AnnotationDefinition,
    loadProjectList: Function,
    uploadDocumentsForProject: Function,
    loadAnnotationDefinitions: Function,
    loadAnnotationGenerators: Function,
    updateGenerator: Function,
    generateAnnotations: Function,
    annotationGenerators: Dictionary<string, AnnotationGenerator>
};

const style: Function = (theme: Object): Object => ({
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
        margin: theme.spacing(1)
    },
    link: theme.link,
    saveIcon: {
        color: theme.palette.secondary.main
    },
    uploadIcon: {
        color: theme.palette.secondary.main,
    },
    listText: {
        marginRight: theme.spacing(4)
    },
    fileUpload: {
        display: "none"
    },
    projectCard: {
        marginBottom: theme.spacing(2)
    }
});

class ManagePage extends Component<ContentProps> {

    componentDidMount() {
        this.props.loadProjectList();
        this.props.loadAnnotationDefinitions();
        this.props.loadAnnotationGenerators();
    }

    render() {
        return <div className={this.props.classes.root}>
            <Grid container spacing={4} className={this.props.classes.rootContent}>
                <Grid item xs={12}>
                <ExpansionPanel defaultExpanded={false}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography variant={'h4'}>
                            {this.props.localize('annotationDefinition.panelTitle')}
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Card className={this.props.classes.projectCard} variant={"outlined"}>
                                    <CardActionArea>
                                        <Link to={`/manage/new_annotationDefinition`}
                                              className={this.props.classes.link}>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    {this.props.localize("annotationDefinition.new") + " "
                                                        + this.props.newAnnotationDefinition.name}
                                                </Typography>
                                            </CardContent>
                                        </Link>
                                    </CardActionArea>
                                    <CardActions>
                                        <Link to={`/manage/new_annotationDefinition`}
                                              className={this.props.classes.link}>
                                            <Button size="small" color="primary">
                                                {this.props.localize('annotationDefinition.edit')}
                                            </Button>
                                        </Link>
                                    </CardActions>
                                </Card>
                                {
                                    (Object.values(this.props.annotationDefinitions): any).map(
                                        (annotationDefinition: AnnotationDefinition) => {
                                            return <Card className={this.props.classes.projectCard}
                                                         key={`annotationDefinitionCard${annotationDefinition.id}`}
                                                         variant={"outlined"}>
                                                <CardActionArea>
                                                    <Link to={`/manage/annotationDefinition/${annotationDefinition.id}`}
                                                          className={this.props.classes.link}>
                                                        <CardContent>
                                                            <Typography gutterBottom variant="h5" component="h2">
                                                                {annotationDefinition.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary"
                                                                        component="p">
                                                                ID: {annotationDefinition.id}
                                                            </Typography>
                                                        </CardContent>
                                                    </Link>
                                                </CardActionArea>
                                                <CardActions>
                                                    <Link to={`/manage/annotationDefinition/${annotationDefinition.id}`}
                                                          className={this.props.classes.link}>
                                                        <Button size="small" color="primary">
                                                            {this.props.localize('annotationDefinition.edit')}
                                                        </Button>
                                                    </Link>
                                                </CardActions>
                                            </Card>
                                        })
                                }
                            </Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                </Grid>
                <Grid item xs={12}>
                    <ExpansionPanel defaultExpanded={false}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography variant={'h4'}>
                                {this.props.localize('manage.projects')}
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <Card className={this.props.classes.projectCard} variant={"outlined"}>
                                        <CardActionArea>
                                            <Link to={`/manage/new_project`} className={this.props.classes.link}>
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="h2">
                                                        {this.props.localize(
                                                            "manage.project.new")} {this.props.newProject.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" component="p">
                                                        {this.props.newProject.description}
                                                    </Typography>
                                                </CardContent>
                                            </Link>
                                        </CardActionArea>
                                        <CardActions>
                                            <Link to={`/manage/new_project`} className={this.props.classes.link}>
                                                <Button size="small" color="primary">
                                                    {this.props.localize('manage.project.edit')}
                                                </Button>
                                            </Link>
                                        </CardActions>
                                    </Card>
                                    {
                                        (Object.values(this.props.projects): any).map(
                                            (project: (ManageListProject | ManageProjectInState)) => {
                                                return <Card className={this.props.classes.projectCard}
                                                             key={`projectCard${project.id}`}
                                                             variant={"outlined"}>
                                                    <CardActionArea>
                                                        <Link to={`/manage/project/${project.id}`}
                                                              className={this.props.classes.link}>
                                                            <CardContent>
                                                                <Typography gutterBottom variant="h5" component="h2">
                                                                    {this.props
                                                                        .localize("manage.project")} {project.name}
                                                                </Typography>
                                                                <Typography variant="body2" color="textSecondary"
                                                                            component="p">
                                                                    {project.description}
                                                                </Typography>
                                                            </CardContent>
                                                        </Link>
                                                    </CardActionArea>
                                                    <CardActions>
                                                        <Link to={`/manage/project/${project.id}`}
                                                              className={this.props.classes.link}>
                                                            <Button size="small" color="primary">
                                                                {this.props.localize('manage.project.edit')}
                                                            </Button>
                                                        </Link>
                                                        <Button size="small" color="primary">
                                                            <label htmlFor={`uploadJson${project.id}`}>
                                                                {this.props.localize('manage.project.uploadDocuments')}
                                                                <input multiple={false}
                                                                       className={this.props.classes.fileUpload}
                                                                       type={'file'} accept={".json"}
                                                                       id={`uploadJson${project.id}`}
                                                                       name={`uploadJson${project.id}`}
                                                                       onChange={(e) => {
                                                       try {
                                                           const fileReader = new FileReader();
                                                           fileReader.onload = (e: any) => {
                                                               try {
                                                                   const result = JSON.parse(e.target.result);
                                                                   this.props.uploadDocumentsForProject(project.id,
                                                                       result);
                                                               } catch (e) {
                                                                   window.alert("Invalid file");
                                                               }
                                                           }
                                                           fileReader.readAsText(e.target.files[0]);
                                                       } catch (e) {
                                                           window.alert("Invalid file");
                                                       }
                                                                       }}/>
                                                            </label>
                                                        </Button>
                                                        <Link to={`/manage/analyzeProjectResults/${project.id}`}
                                                              className={this.props.classes.link}>
                                                            <Button size="small" color="primary">
                                                                {this.props.localize('manage.project.analyze')}
                                                            </Button>
                                                        </Link>
                                                        <Button size="small" color="secondary" onClick={() => {
                                                            this.props.generateAnnotations(project)
                                                        }}> { project.generateAnnotationsFetchStatus === FetchStatus.ACTIVE ? <CircularProgress size={20}/> :
                                                            (project.generateAnnotationsFetchStatus === FetchStatus.SUCCESS ? <Check/> :
                                                                (project.generateAnnotationsFetchStatus === FetchStatus.ERROR ? <ErrorOutline/> : null))}
                                                            {this.props.localize('manage.project.generateAnnotations')}
                                                            {project.numberUpdatedDocuments !== undefined ? " ("
                                                                + this.props.localize('manage.project.generateAnnotations.updated')
                                                                + ": " + project.numberUpdatedDocuments + ")" : null}
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            })
                                    }
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Grid>
                <Grid item xs={12}>
                    <ExpansionPanel defaultExpanded={false}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography variant={'h4'}>
                                {this.props.localize('annotationGenerator.panelTitle')}
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    {
                                        (Object.values(this.props.annotationGenerators): any).map(
                                            (annotationGenerator: AnnotationGeneratorInStore) => {
                                                return <Card className={this.props.classes.projectCard}
                                                             key={`annotationGeneratorCard${annotationGenerator.id}`}
                                                             variant={"outlined"}>
                                                    <CardActionArea>
                                                        <CardContent>
                                                            <Typography gutterBottom variant="h5" component="h2">
                                                                {annotationGenerator.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary"
                                                                        component="p">
                                                                ID: {annotationGenerator.id}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary"
                                                                        component="p">
                                                                {annotationGenerator.description}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary"
                                                                        component="p">
                                                                Annotation Definition ID: {annotationGenerator.annotationDefinitionID}
                                                            </Typography>
                                                            {(annotationGenerator.versions?.length ?? 0) > 0 &&
                                                                <Grid container spacing={1} style={{marginTop: 12}}>
                                                                    {annotationGenerator.versions.map(v => <Grid item xs={12} style={{marginLeft: 12}}>
                                                                        <Typography variant="body2" color="textSecondary"
                                                                                    component="p">
                                                                            Version: {v.updateResponse?.version ?? "?"}
                                                                        </Typography>
                                                                        <Typography variant="body2" color="textSecondary"
                                                                                    component="p">
                                                                            Update State: {v.updateState}
                                                                        </Typography>
                                                                        <Typography variant="body2" color="textSecondary"
                                                                                    component="p">
                                                                            n={v.updateResponse?.numberOfExamples ?? "?"}
                                                                        </Typography>
                                                                    </Grid>)}
                                                                </Grid>
                                                            }
                                                        </CardContent>
                                                    </CardActionArea>
                                                    <CardActions>
                                                        <Button size="small" color="secondary" onClick={() => {
                                                            this.props.updateGenerator(annotationGenerator)
                                                        }}> { annotationGenerator.updateFetchStatus === FetchStatus.ACTIVE ? <CircularProgress size={20}/> :
                                                            (annotationGenerator.updateFetchStatus === FetchStatus.SUCCESS ? <Check/> :
                                                                (annotationGenerator.updateFetchStatus === FetchStatus.ERROR ? <ErrorOutline/> : null))}
                                                            {this.props.localize('annotationGenerators.update')}
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            })
                                    }
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Grid>
            </Grid>
        </div>
    }
}
const mapStateToProps = (state: AppState): Object => ({
    projects: state.manage.projects,
    newProject: state.manage.newProject,
    annotationDefinitions: state.manage.annotationDefinitions,
    newAnnotationDefinition: state.manage.newAnnotationDefinition,
    annotationGenerators: state.manage.annotationGenerators
});

const mapDispatchToProps = (dispatch: Function) : Object => {
    return ({
        loadProjectList: () => {
            dispatch(ManageProjectListActions.start());
        },
        uploadDocumentsForProject(projectID: ProjectID, json: any) {
            dispatch(UploadDocumentsActions.start(projectID, json));
        },
        loadAnnotationDefinitions: () => {
            dispatch(LoadAnnotationDefinitionsActions.start());
        },
        loadAnnotationGenerators: () => {
            dispatch(LoadAnnotationGeneratorsActions.start());
        },
        updateGenerator: (annotationGenerator: AnnotationGenerator) => {
            dispatch(UpdateAnnotationGeneratorActions.start(annotationGenerator));
        },
        generateAnnotations: (project: ManageProject) => {
            dispatch(GenerateAnnotationsActions.start(project));
        }
    });
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withLocalization(withStyles(style)
    (ManagePage))));
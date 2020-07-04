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
import {ManageProjectListActions, UploadDocumentsActions} from "../../redux/manage/manage";
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
import {LoadAnnotationDefinitionsActions} from "../../redux/manage/manageAnnotationDefinitions";

type ContentProps = WithStylesComponentProps & WithRouterComponentProps & WithLocalizationComponentProps & {
    projects: Dictionary<ProjectID, ManageListProject | ManageProject>,
    annotationDefinitions: Dictionary<AnnotationID, AnnotationDefinition>,
    newProject: NewManageProject,
    newAnnotationDefinition: AnnotationDefinition,
    loadProjectList: Function,
    uploadDocumentsForProject: Function,
    loadAnnotationDefinitions: Function
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
                                            (project: (ManageListProject | ManageProject)) => {
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
    newAnnotationDefinition: state.manage.newAnnotationDefinition
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
        }
    });
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withLocalization(withStyles(style)
    (ManagePage))));
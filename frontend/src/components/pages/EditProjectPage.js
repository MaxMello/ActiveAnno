// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {OutlinedInput, Typography} from '@material-ui/core';
import {withLocalization} from "react-localize";
import type {
    AnnotationID,
    Dictionary,
    UserIdentifier,
    WithLocalizationComponentProps,
    WithRouterComponentProps,
    WithStylesComponentProps
} from "../../types/Types";
import type {ManageProject, ProjectStoreResponseInState} from "../../types/manage/ManageTypes";
import {
    CreateProjectActions,
    EditProjectActions,
    ManageProjectActions,
    SaveProjectActions
} from "../../redux/manage/manage";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import Stepper from "@material-ui/core/Stepper";
import StepButton from "@material-ui/core/StepButton";
import Step from "@material-ui/core/Step";
import Grid from "@material-ui/core/Grid";
import SaveIcon from "@material-ui/icons/Save";
import Hidden from "@material-ui/core/Hidden";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import OverflowMenuItem from "../elements/OverflowMenuItem";
import BasicProperties from "../elements/project/BasicProperties";
import type {UserInfo} from "../../types/pagesetup/PageSetupTypes";
import AnnotationsStep from "../elements/project/AnnotationsStep";
import FilterAndSortStep from "../elements/project/FilterAndSortStep";
import ExportStep from "../elements/project/ExportStep";
import DocumentMappingStep from "../elements/project/DocumentMappingStep";
import LayoutStep from "../elements/project/LayoutStep";
import type {AppState} from "../../types/redux/AppState";
import Button from "@material-ui/core/Button";
import FetchStatus from "../../api/helper/FetchStatus";
import type {ManageProjectInState, NewManageProjectInState} from "../../types/redux/ManageState";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import type {AnnotationDefinition} from "../../types/annotationdefinition/AnnotationDefinition";
import {LoadAnnotationDefinitionsActions} from "../../redux/manage/manageAnnotationDefinitions";


type EditProjectPageProps = WithStylesComponentProps & WithRouterComponentProps & WithLocalizationComponentProps & {
    project: NewManageProjectInState | ManageProjectInState,
    isNewProject: boolean,
    currentStep: number,
    loadProject: Function,
    userInfo: Dictionary<UserIdentifier, UserInfo>,
    updateProjectValue: Function,
    userIdentifier: string,
    updateProject: Function,
    createProject: Function,
    annotationDefinitions: Dictionary<AnnotationID, AnnotationDefinition>,
    loadAnnotationDefinitions: Function
};

const style: Function = (theme: Object): Object => ({
    root: theme.pageRoot,
    stepper: {
        flexGrow: 1
    },
    formControl: theme.defaultFullWidthFormControl,
    label: {
        transform: "translate(13px, 13px) scale(1)"
    },
    link: theme.link,
    iconInButton: {
        marginRight: 4
    }
});

type ProjectStep = {
   index: number,
   name: string
};

type EditProjectPageState = {|
    showSnackbar: boolean
|};

function formatStoreMessage(projectStoreResponse: ?ProjectStoreResponseInState) {
    if(projectStoreResponse == null) {
        return null;
    } else {
        return <div>
            <Typography>{projectStoreResponse.message}</Typography>
            {Object.keys(projectStoreResponse.errors).length > 0 && (Object.values(projectStoreResponse.errors): any)
                .map(validationError => {
                    return <Typography key={`validationError${validationError.key}`}>
                        {validationError.message}
                    </Typography>
                }
            )}
        </div>
    }
}

class EditProjectPage extends Component<EditProjectPageProps, EditProjectPageState> {

    constructor(props: EditProjectPageProps) {
        super(props);
        this.state = {
            showSnackbar: false
        };
        (this: any).routeStep = this.routeStep.bind(this);
    }

    steps: Array<ProjectStep> = [{
        index: 0,
        name: this.props.localize('project.step.basics')
    }, {
        index: 1,
        name: this.props.localize('project.step.filter')
    }, {
        index: 2,
        name: this.props.localize('project.step.inputMapping')
    }, {
        index: 3,
        name: this.props.localize('project.step.annotations')
    }, {
        index: 4,
        name: this.props.localize('project.step.layout')
    }, {
        index: 5,
        name: this.props.localize('project.step.export')
    }];

    componentWillReceiveProps(nextProps: EditProjectPageProps, nextContext: *) {
        if(this.props.project.projectStoreResponse !== nextProps.project.projectStoreResponse) {
            this.setState({
                ...this.state,
                showSnackbar: true
            })
        }
    }

    componentDidMount() {
        if(!this.props.isNewProject && this.props.project && this.props.project.id
            && !this.props.project.userRoles) {
            // Load project from backend if not a new one and wasn't loaded already
            this.props.loadProject(this.props.project.id);
        }
        this.props.loadAnnotationDefinitions();
    }

    routeStep(destination: number) {
        this.props.history.push(this.props.isNewProject ? `/manage/new_project/${destination + 1}`:
            `/manage/project/${(this.props.project.id: any)}/${destination + 1}`)
    }

    renderStep() {
        const project = this.props.project;
        switch(this.props.currentStep) {
            case 0: return <BasicProperties id={project.id} name={project.name} description={project.description}
                                            priority={project.priority} active={project.active}
                                            userRoles={project.userRoles ? project.userRoles : {}}
                                            policy={project.policy ? project.policy : {}}
                                            updateProjectValue={this.props.updateProjectValue}
                                            isNewProject={this.props.isNewProject} userInfo={this.props.userInfo}
                                            userIdentifier={this.props.userIdentifier}/>;
            case 1: return <FilterAndSortStep id={project.id} updateProjectValue={this.props.updateProjectValue}
                                              filter={project.filter} sort={project.sort}
                                              isNewProject={this.props.isNewProject}/>;
            case 2: return <DocumentMappingStep id={project.id} updateProjectValue={this.props.updateProjectValue}
                                                inputMapping={project.inputMapping}
                                                isNewProject={this.props.isNewProject} project={project}/>;
            case 3: return <AnnotationsStep id={project.id} updateProjectValue={this.props.updateProjectValue}
                                            project={project}
                                            isNewProject={this.props.isNewProject}
                                            annotationSchema={project.annotationSchema}
                                            annotationDefinitions={this.props.annotationDefinitions}
            />;
            case 4: return <LayoutStep id={project.id} updateProjectValue={this.props.updateProjectValue}
                                       annotationDefinitions={this.props.annotationDefinitions}
                                       isNewProject={this.props.isNewProject} project={project}/>;
            case 5: return <ExportStep id={project.id} updateProjectValue={this.props.updateProjectValue}
                                       isNewProject={this.props.isNewProject} export={project.export}/>;
            default: return null;
        }
    }

    render() {
        return <div className={this.props.classes.root}>
            <Grid container spacing={4}>
                <Grid item xs={8} sm={8} md={10} lg={10}>
                    <Typography variant={'h5'}>
                        {Object.keys(this.props.project).length > 0 ? this.props.project.name
                            ? this.props.project.name : this.props.localize('manage.editNewProject')
                            : this.props.localize("manage.createNewProject")}
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
                    <Button size="small" color="primary" variant={"contained"} fullWidth
                            disabled={FetchStatus.ACTIVE === this.props.project.fetchStatus}
                            onClick={() => {
                        if(this.props.isNewProject) {
                            this.props.createProject(this.props.project);
                        } else {
                            this.props.updateProject(this.props.project)
                        }
                    }}>
                        {this.props.project.fetchStatus === FetchStatus.ACTIVE ? <CircularProgress color={"secondary"}
                                size={18} className={this.props.classes.iconInButton}/> :
                            <SaveIcon fontSize={"small"} className={this.props.classes.iconInButton}/>} {this.props
                                    .localize('manage.project.save')}
                    </Button>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    <Hidden only={'xs'}>
                    <Stepper alternativeLabel nonLinear activeStep={this.props.currentStep}
                             className={this.props.classes.stepper}>
                        {
                            this.steps.map(s => <Step key={`step${s.index}`} ><StepButton onClick={() =>
                                this.routeStep(s.index)}>{s.name}</StepButton></Step>)
                        }
                    </Stepper>
                    </Hidden>
                    <Hidden only={['sm', 'md', 'lg', 'xl']}>
                        <FormControl className={this.props.classes.formControl} variant="outlined">
                            <InputLabel htmlFor="selectProjectStep"
                                        classes={{root: this.props.classes.label}}>
                                {this.props.localize('project.steps')}
                            </InputLabel>
                            <Select value={this.props.currentStep}
                                    onChange={e => this.routeStep(e.target.value)}
                                    input={<OutlinedInput labelWidth={50} name="projectID" id="selectProjectStep"
                                                          classes={{input: this.props.classes.input}}/>}>
                                {this.steps.map(s => {
                                    return <OverflowMenuItem value={s.index} key={`manageProjectStep${s.index}`}>
                                        {s.name}
                                    </OverflowMenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Hidden>
                </Grid>
            </Grid>
            {this.props.project.userRoles && this.renderStep()}
            {this.state.showSnackbar && this.props.project.projectStoreResponse && <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={true}
                autoHideDuration={6000}
                onClose={(event, reason?: string) => {
                    if (reason === 'clickaway') {
                        return;
                    }
                    this.setState({
                        ...this.state,
                        showSnackbar: false
                    })
                }}>
                {this.props.project.projectStoreResponse?.success === true ? (
                    Object.keys(this.props.project.projectStoreResponse?.errors ?? {}).length === 0 ?
                        <Alert severity={"success"}>
                            {formatStoreMessage(this.props.project.projectStoreResponse)}
                        </Alert>
                     :
                        <Alert severity={"warning"}>
                            {formatStoreMessage(this.props.project.projectStoreResponse)}
                        </Alert>)
                    : 
                    <Alert severity={"error"}>
                        {formatStoreMessage(this.props.project.projectStoreResponse)}
                    </Alert>
                }
            </Snackbar>
            }
        </div>
    }
}

const mapStateToProps = (state: AppState, ownProps: EditProjectPageProps): Object => ({
    project: ownProps.location.pathname.startsWith('/manage/new_project')
        ? state.manage.newProject : (ownProps.match.params.id ? state.manage.projects[ownProps.match.params.id] : null),
    isNewProject: ownProps.location.pathname.startsWith('/manage/new_project'),
    currentStep: ownProps.match.params.step ? ownProps.match.params.step - 1 : 0,
    userInfo: state.pageSetup.pageSetup?.userInfo,
    userIdentifier: state.authentication.username,
    annotationDefinitions: state.manage.annotationDefinitions
});

const mapDispatchToProps = (dispatch: Function) : Object => {
    return ({
        loadProject: (projectID: string) => {
            dispatch(ManageProjectActions.start(projectID));
        },
        updateProjectValue: (projectID: string, keys: Array<string>, value: any) => {
            dispatch(EditProjectActions.updateProjectValue(projectID,keys, value));
        },
        updateProject: (project: ManageProject) => {
            dispatch(SaveProjectActions.start(project));
        },
        createProject: (project: ManageProject) => {
            dispatch(CreateProjectActions.start(project));
        },
        loadAnnotationDefinitions: () => {
            dispatch(LoadAnnotationDefinitionsActions.start());
        }
    });
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(withLocalization(withStyles(style)(EditProjectPage)))
);
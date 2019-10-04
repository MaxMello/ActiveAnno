// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {OutlinedInput, Typography} from '@material-ui/core';
import {withLocalization} from "react-localize";
import type {
    AppState, Dictionary, userIdentifier,
    WithLocalizationComponentProps,
    WithRouterComponentProps,
    WithStylesComponentProps
} from "../../types/Types";
import type {ManageConfigFull, NewManageConfig} from "../../types/ManageTypes";
import {EditProjectActions, ManageConfigActions} from "../../redux/manage";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import Stepper from "@material-ui/core/Stepper";
import StepButton from "@material-ui/core/StepButton";
import Step from "@material-ui/core/Step";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import OverflowMenuItem from "../elements/OverflowMenuItem";
import BasicProperties from "../elements/project/BasicProperties";
import type {UserInfo} from "../../types/PageSetupTypes";
import AnnotationsStep from "../elements/project/AnnotationsStep";
import FilterAndSortStep from "../elements/project/FilterAndSortStep";
import ExportStep from "../elements/project/ExportStep";


type EditProjectPageProps = WithStylesComponentProps & WithRouterComponentProps & WithLocalizationComponentProps & {
    config: NewManageConfig | ManageConfigFull,
    isNewConfig: boolean,
    currentStep: number,
    loadConfig: Function,
    userInfo: Dictionary<userIdentifier, UserInfo>,
    updateConfigValue: Function,
    userIdentifier: string
};

const style: Function = (theme: Object): Object => ({
    root: {
        padding: '2vh',
        width: '100%',
        marginTop: 64,
    },
    stepper: {
        flexGrow: 1
    },
    stepperContainer: {
        marginBottom: theme.spacing(2)
    },
    formControl: {
        marginTop: theme.spacing(2),
        width: '100%',
        flexGrow: 1
    },
    label: {
        transform: "translate(13px, 13px) scale(1)"
    },
    link: theme.link
});

type ProjectStep = {
   index: number,
   name: string
};

class EditProjectPage extends Component<EditProjectPageProps> {

    constructor(props: EditProjectPageProps) {
        super(props);
        this.routeStep = this.routeStep.bind(this);
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

    componentDidMount() {
        if(!this.props.isNewConfig && this.props.config && this.props.config.id && !this.props.config.needsSyncing) {
            // Load config from backend if not a new one and was not altered in frontend already
            this.props.loadConfig(this.props.config.id);
        }
    }

    routeStep(destination: number) {
        this.props.history.push(this.props.isNewConfig ? `/manage/new_project/${destination + 1}`: `/manage/project/${this.props.config.id}/${destination + 1}`)
    }

    renderStep() {
        const config = this.props.config;
        switch(this.props.currentStep) {
            case 0: return <BasicProperties id={config.id} name={config.name} description={config.description}
                                            priority={config.priority} active={config.active}
                                            userRoles={config.userRoles ? config.userRoles : {}}
                                            policy={config.policy ? config.policy : {}}
                                            updateConfigValue={this.props.updateConfigValue}
                                            isNewConfig={this.props.isNewConfig} userInfo={this.props.userInfo} userIdentifier={this.props.userIdentifier}/>;
            case 1: return <FilterAndSortStep id={config.id} updateConfigValue={this.props.updateConfigValue} filter={config.filter} sort={config.sort}
                                              isNewConfig={this.props.isNewConfig}/>;
            case 3: return <AnnotationsStep id={config.id} updateConfigValue={this.props.updateConfigValue}
                                            isNewConfig={this.props.isNewConfig} annotations={config.annotations}/>;
            case 5: return <ExportStep id={config.id} updateConfigValue={this.props.updateConfigValue}
                                       isNewConfig={this.props.isNewConfig} export={config.export}/>;
        }
    }

    render() {
        console.log(this.props.history, this.props.location, this.props.match);
        return <div className={this.props.classes.root}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant={'h5'}>
                        {Object.keys(this.props.config).length > 0 ? this.props.config.name ? this.props.config.name : this.props.localize('manage.editNewProject') : this.props.localize("manage.createNewProject")}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container className={this.props.classes.stepperContainer}>
                <Grid item xs={12}>
                    <Hidden only={'xs'}>
                    <Stepper alternativeLabel nonLinear activeStep={this.props.currentStep} className={this.props.classes.stepper}>
                        {
                            this.steps.map(s => <Step key={`step${s.index}`} ><StepButton onClick={() => this.routeStep(s.index)}>{s.name}</StepButton></Step>)
                        }
                    </Stepper>
                    </Hidden>
                    <Hidden only={['sm', 'md', 'lg', 'xl']}>
                        <FormControl className={this.props.classes.formControl} variant="outlined">
                            <InputLabel htmlFor="selectProjectStep"
                                        classes={{root: this.props.classes.label}}>{this.props.localize('project.steps')}</InputLabel>
                            <Select value={this.props.currentStep}
                                    onChange={e => this.routeStep(e.target.value)}
                                    input={<OutlinedInput labelWidth={50} name="configurationID" id="selectProjectStep"
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
            {this.renderStep()}
        </div>
    }
}

const mapStateToProps = (state: AppState, ownProps: EditProjectPageProps): Object => ({
    config: ownProps.location.pathname.startsWith('/manage/new_project') ? state.manage.newConfig : (ownProps.match.params.id ? state.manage.configs[ownProps.match.params.id] : null),
    isNewConfig: ownProps.location.pathname.startsWith('/manage/new_project'),
    currentStep: ownProps.match.params.step ? ownProps.match.params.step - 1 : 0,
    userInfo: state.pageSetup.pageSetup.userInfo,
    userIdentifier: state.authentication.username
});

const mapDispatchToProps = (dispatch: Function) : Object => {
    return ({
        loadConfig: (configID: string) => {
            dispatch(ManageConfigActions.start(configID));
        },
        updateConfigValue: (configID: string, keys: Array<string>, value: any) => {
            dispatch(EditProjectActions.updateConfigValue(configID,keys, value));
        }
    });
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withLocalization(withStyles(style)(EditProjectPage))));
// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import {withLocalization} from "react-localize";
import {Link, withRouter} from "react-router-dom";
import ListItemText from "@material-ui/core/ListItemText";
import type {
    AppState,
    Dictionary,
    WithLocalizationComponentProps,
    WithRouterComponentProps,
    WithStylesComponentProps
} from "../../types/Types";
import type {ManageConfigFull, ManageConfigMinimal, NewManageConfig} from "../../types/ManageTypes";
import {connect} from "react-redux";
import {Add, Assignment, Save, CloudUpload} from "@material-ui/icons";
import {
    CreateConfigActions,
    ManageConfigListActions,
    SaveConfigActions
} from "../../redux/manage";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";


type ContentProps = WithStylesComponentProps & WithRouterComponentProps & WithLocalizationComponentProps & {
    configs: Dictionary<string, ManageConfigMinimal | ManageConfigFull>,
    newConfig: NewManageConfig,
    loadConfigList: Function
};

const style: Function = (theme: Object): Object => ({
    root: theme.pageRoot,
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
    }
});

class ManagePage extends Component<ContentProps> {

    constructor(props: ContentProps, context: *): void {
        super(props, context);
        this.saveConfig = this.saveConfig.bind(this);
        this.uploadDocuments = this.uploadDocuments.bind(this);
    }

    saveConfig(configID: string, isNewConfig: boolean) {
        if(isNewConfig) {
            console.log("CREATE CONFIG", this.props.newConfig);
            this.props.createConfig(this.props.newConfig);
        } else {
            console.log("SAVE CONFIG", this.props.configs[configID]);
            this.props.updateConfig(this.props.configs[configID])
        }
    }

    uploadDocuments() {

    }

    componentDidMount() {
        this.props.loadConfigList();
    }

    listItemForProjectConfig(icon: Component, linkTo: string, primary: string, secondary: string, config: ManageConfigFull, isNewConfig: boolean) {
        return <Grid container spacing={4}><Grid item xs={1}>
            <Link to={linkTo} className={this.props.classes.link} key={`projectConfigLinkTo${linkTo}`}><IconButton>
                    {icon}
                </IconButton>
            </Link>
                </Grid>
            <Grid item xs={9}>
                    <Link to={linkTo} className={this.props.classes.link} key={`projectConfigLinkTo${linkTo}`}>
                        <ListItemText
                            className={this.props.classes.listText}
                            primary={primary}
                            secondary={secondary}
                        />
                    </Link>
            </Grid>
            <Grid item xs={1}>
                {(false && (!isNewConfig && config && config.filter === null)) ?
                            <IconButton>
                                <label htmlFor={`uploadJson${config.id}`}>
                                    <CloudUpload className={this.props.classes.uploadIcon}/>
                                    <input className={this.props.classes.fileUpload} multiple={false}
                                        type={'file'} accept={".json"} id={`uploadJson${config.id}`} name={`uploadJson${config.id}`}
                                           onChange={(e) => {
                                                console.log(e);
                                           }}/>
                                </label>
                            </IconButton>
                        : null}
            </Grid>
            <Grid item xs={1}>
                {((isNewConfig || (config && config.needsSyncing)) && this.validateConfig(config)) ?
                                <IconButton edge="end" onClick={() => {
                                    this.saveConfig(config ? config.id : "", isNewConfig)
                                }}>
                                <Save className={this.props.classes.saveIcon}/>
                             </IconButton>
                : null}
            </Grid>
        </Grid>
    }

    validateConfig(config: ManageConfigFull) {
        return config && config.id && config.id.length > 0 && config.name && config.name.length > 0
    }

    render() {
        const projectConfigs = Object.values(this.props.configs).map(c => {
            return this.listItemForProjectConfig(<Assignment/>,`/manage/project/${c.id}`, c.name, `${c.id}`, c, false)
        });
        projectConfigs.unshift(this.listItemForProjectConfig(Object.keys(this.props.newConfig).length > 0 ? <Assignment/> : <Add/>, "/manage/new_project",
            Object.keys(this.props.newConfig).length > 0 ? this.props.newConfig.name ? this.props.newConfig.name : this.props.localize('manage.editNewProject') : this.props.localize("manage.createNewProject"),
            `${this.props.newConfig.id ? this.props.newConfig.id : ""}`, this.props.newConfig, true));
        
        return <div className={this.props.classes.root}>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant={'body1'}>
                        {this.props.localize('manage.body')}
                    </Typography>
                </Grid>
            <Grid item xs={12}>
                    {projectConfigs}
            </Grid>
            </Grid>
        </div>
    }
}
const mapStateToProps = (state: AppState): Object => ({
    configs: state.manage.configs,
    newConfig: state.manage.newConfig
});

const mapDispatchToProps = (dispatch: Function) : Object => {
    return ({
        loadConfigList: () => {
            dispatch(ManageConfigListActions.start());
        },
        updateConfig: (config: ManageConfigFull) => {
            dispatch(SaveConfigActions.start(config));
        },
        createConfig: (config: ManageConfigFull) => {
            dispatch(CreateConfigActions.start(config));
        }
    });
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withLocalization(withStyles(style)(ManagePage))));
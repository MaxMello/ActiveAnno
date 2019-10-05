// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import {withLocalization} from "react-localize";
import {Link, withRouter} from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
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
import {Add, Assignment} from "@material-ui/icons";
import {ManageConfigListActions} from "../../redux/manage";


type ContentProps = WithStylesComponentProps & WithRouterComponentProps & WithLocalizationComponentProps & {
    configs: Dictionary<string, ManageConfigMinimal | ManageConfigFull>,
    newConfig: NewManageConfig,
    loadConfigList: Function
};

const style: Function = (theme: Object): Object => ({
    root: theme.pageRoot,
    link: theme.link
});

class ManagePage extends Component<ContentProps> {

    componentDidMount() {
        this.props.loadConfigList();
    }

    listItemForProjectConfig(icon: Component, linkTo: string, primary: string, secondary: string) {
        return <Link to={linkTo} className={this.props.classes.link} key={`projectConfigLinkTo${linkTo}`}>
            <ListItem>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText
                    primary={primary}
                    secondary={secondary}
                />
            </ListItem>
        </Link>
    }

    render() {
        const projectConfigs = Object.values(this.props.configs).map(c => {
            return this.listItemForProjectConfig(<Assignment/>,`/manage/project/${c.id}`, c.name, `${c.id} - ${c.description}`)
        })
        projectConfigs.unshift(this.listItemForProjectConfig(Object.keys(this.props.newConfig).length > 0 ? <Assignment/> : <Add/>, "/manage/new_project",
            Object.keys(this.props.newConfig).length > 0 ? this.props.newConfig.name ? this.props.newConfig.name : this.props.localize('manage.editNewProject') : this.props.localize("manage.createNewProject"),
            `${this.props.newConfig.id ? this.props.newConfig.id : ""}${this.props.newConfig.id && this.props.newConfig.description ? " - " : ""}${this.props.newConfig.description ? this.props.newConfig.description: ""}`));
        
        return <div className={this.props.classes.root}>
                    <Typography variant={'body1'}>
                        {this.props.localize('manage.body')}
                    </Typography>
                    {projectConfigs}
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
        }
    });
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withLocalization(withStyles(style)(ManagePage))));
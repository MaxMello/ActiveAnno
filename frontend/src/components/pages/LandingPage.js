// @flow
import React, {Component} from 'react';
import type {AppState} from '../../types/Types';
import {withStyles} from '@material-ui/core/styles';
import {Badge, Typography} from '@material-ui/core';
import {withLocalization} from "react-localize";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import CommentOutlined from "@material-ui/icons/CommentOutlined";
import Visibility from "@material-ui/icons/Visibility";
import Build from "@material-ui/icons/Build";
import Search from "@material-ui/icons/Search";
import Assignment from "@material-ui/icons/Assignment";


import ListItemText from "@material-ui/core/ListItemText";
import {Pages} from "../../redux/pageSetup";


type ContentProps = {
    history: Object,
    jwt: Object,
    pages: Object
};

const style: Function = (theme: Object): Object => ({
    root: {
        padding: '2vh',
        marginTop: 64,
    },
    link: theme.link
});

class LandingPage extends Component<ContentProps> {

    componentDidMount() {
        if(!this.props.jwt) {
            this.props.history.push('/login')
        }
    }

    loggedOutContent() {
        return <Typography variant={'body1'}>
            {this.props.localize('landing.loggedOut')}
        </Typography>;
    }

    emptyContent() {
        return <Typography variant={'body1'}>
            {this.props.localize('landing.empty')}
        </Typography>;
    }

    listItemForPage(icon: Component, linkTo: string, primary: string, secondary: string) {
        return <Link to={linkTo} className={this.props.classes.link} key={`listItem${linkTo}`}>
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

    overviewContent() {
        const pages = [];
        for (let [key, value] of Object.entries(this.props.pages)) {
            if(key === Pages.ANNOTATE) {
                pages.push(this.listItemForPage(<Badge badgeContent={value.badgeCount ? value.badgeCount : 0} color="secondary" showZero={false} max={99}>
                    <CommentOutlined/>
                </Badge>, "/annotate", this.props.localize('annotate.name'), this.props.localize('annotate.description')))
            } else if(key === Pages.CURATE) {
                pages.push(this.listItemForPage(<Badge badgeContent={value.badgeCount ? value.badgeCount : 0} color="secondary" showZero={false} max={99}>
                    <Visibility/>
                </Badge>, "/curate", this.props.localize('curate.name'), this.props.localize('curate.description')))
            } else if(key === Pages.MANAGE) {
                pages.push(this.listItemForPage(<Assignment/>, "/manage", this.props.localize('manage.name'), this.props.localize('manage.description')))
            } else if(key === Pages.ADMIN) {
                pages.push(this.listItemForPage(<Build/>, "/admin", this.props.localize('admin.name'), this.props.localize('admin.description')))
            } else if(key === Pages.SEARCH) {
                pages.push(this.listItemForPage(<Search/>, "/search", this.props.localize('search.name'), this.props.localize('search.description')))
            }
        }

        return <div>
            <Typography variant={'body1'}>
                {this.props.localize('landing.welcome')}
            </Typography>
            <List>
                {pages}
            </List>
        </div>;
    }

    render() {
        let content;
        if(!this.props.jwt) {
            content = this.loggedOutContent()
        } else if(this.props.pages.length === 0) {
            content = this.emptyContent()
        } else {
            content = this.overviewContent()
        }
        return <div className={this.props.classes.root}>
                    {content}
        </div>
    }
}

const mapStateToProps = (state: AppState): Object => ({
    jwt: state.authentication.jwt,
    pages: state.pageSetup.pageSetup ? state.pageSetup.pageSetup.pages : {},
});

export default connect(mapStateToProps)(withRouter(withLocalization(withStyles(style)(LandingPage))));
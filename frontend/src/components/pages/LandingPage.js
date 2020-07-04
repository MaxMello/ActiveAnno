// @flow
import React, {Component} from 'react';
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
import type {AppState} from "../../types/redux/AppState";
import type {
    Dictionary,
    ReactRouterHistory,
    WithLocalizationComponentProps,
    WithStylesComponentProps
} from "../../types/Types";
import type {Page} from "../../types/pagesetup/PageSetupTypes";
import type {JWT} from "../../types/AuthenticationTypes";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import type {ApplicationState} from "../../types/redux/ApplicationState";
import {LanguageActions} from "../../redux/application";
import Grid from "@material-ui/core/Grid";
import * as moment from "moment";


type LandingPageProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    history: ReactRouterHistory,
    jwt: JWT,
    pages: Dictionary<string, Page>,
    application: ApplicationState,
    selectLanguage: Function
};

const style: Function = (theme: Object): Object => ({
    root: theme.pageRoot,
    link: theme.link,
    defaultFormControl: theme.defaultFormControl,
});

class LandingPage extends Component<LandingPageProps> {

    componentDidMount() {
        if(!this.props.jwt) {
            this.props.history.push('/user')
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

    listItemForPage(icon: React$Element<typeof Component>, linkTo: string, primary: string, secondary: string) {
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
        for (let [key: string, value: Page] of Object.entries(this.props.pages)) {
            if(key === Pages.ANNOTATE) {
                pages.push(this.listItemForPage(<Badge badgeContent={(value: any)?.badgeCount ?? 0}
                                                       color="secondary" showZero={false} max={999}>
                    <CommentOutlined/>
                </Badge>, "/annotate", this.props.localize('annotate.name'),
                    this.props.localize('annotate.description')))
            } else if(key === Pages.CURATE) {
                pages.push(this.listItemForPage(<Badge badgeContent={(value: any)?.badgeCount ?? 0}
                                                       color="secondary" showZero={false} max={999}>
                    <Visibility/>
                </Badge>, "/curate", this.props.localize('curate.name'), this.props.localize('curate.description')))
            } else if(key === Pages.MANAGE) {
                pages.push(this.listItemForPage(<Assignment/>, "/manage", this.props.localize('manage.name'),
                    this.props.localize('manage.description')))
            } else if(key === Pages.ADMIN) {
                pages.push(this.listItemForPage(<Build/>, "/admin", this.props.localize('admin.name'),
                    this.props.localize('admin.description')))
            } else if(key === Pages.SEARCH) {
                pages.push(this.listItemForPage(<Search/>, "/search", this.props.localize('search.name'),
                    this.props.localize('search.description')))
            }
        }

        return <div>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant={'body1'}>
                        {this.props.localize('landing.welcome')}
                    </Typography>
                </Grid>
            </Grid>
            <List>
                {pages}
            </List>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <FormControl className={this.props.classes.defaultFormControl}
                                 key={`LanguageSelectFC`}>
                        <InputLabel id="LanguageSelectInputLabel">{this.props.localize(`language`)}</InputLabel>
                        <Select
                            autoWidth={true}
                            value={this.props.application.language.selected}
                            onChange={(e) => {
                                this.props.selectLanguage(e.target.value);
                                moment.locale(e.target.value);
                            }}
                        >
                            {this.props.application.language.available.map((opt, index) => {
                                return <MenuItem value={opt}
                                                 key={`LanguageOption${opt}`}>
                                    {this.props.localize(`language.${opt}`)}
                                </MenuItem>;
                            })}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
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
    application: state.application
});

const mapDispatchToProps = (dispatch: Function): Object => ({
    selectLanguage: (language: string) => {
        dispatch(LanguageActions.select(language));
    },
});
export default connect(mapStateToProps,
    mapDispatchToProps)(withRouter(withLocalization(withStyles(style)(LandingPage))));
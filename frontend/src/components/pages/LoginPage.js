// @flow
import React, {Component} from 'react';
import type {AppState} from '../../types/Types';
import {withStyles} from '@material-ui/core/styles';
import {withLocalization} from "react-localize";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import {AuthenticationActions} from "../../redux/authentication";
import {connect} from 'react-redux';
import LogoutForm from "../elements/LogoutForm";
import LoginForm from "../elements/LoginForm";
import {withRouter} from "react-router-dom";
import {GlobalActions} from "../../redux/GlobalActions";
import {userCredentials} from "../../types/TypeCreators";

type ContentProps = {
    viewState: number,
    history: Object,
    match: Object,
    pages: Object,
    username: string,
    fetchStatus: number
};

const ViewState = {
    SHOW_LOGIN: 1,
    SHOW_LOGOUT: 2
};

const style: Function = (theme: Object): Object => ({
    root: {
        padding: '2vh',
        marginTop: 64
    },
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
});

class LoginPage extends Component<ContentProps> {

    componentWillReceiveProps(nextProps: ContentProps) {
        if(nextProps.viewState === ViewState.SHOW_LOGOUT && nextProps.match.params.origin && nextProps.match.params.origin in nextProps.pages) {
            nextProps.history.push("/" + nextProps.match.params.origin)
        }
    }

    render() {
        let content;
        if(this.props.viewState === ViewState.SHOW_LOGIN) {
            content = <LoginForm username={this.props.username}
                                 onClick={this.props.handleLogin}
                                 fetchStatus={this.props.fetchStatus}
            />;
        } else if(this.props.viewState === ViewState.SHOW_LOGOUT) {
            content = <LogoutForm username={this.props.username}
                                  onClick={this.props.handleLogout}
            />;
        }
        return <Container component="main" maxWidth="xs" className={this.props.classes.root}>
            <CssBaseline />
            <div className={this.props.classes.paper}>
                {content}
            </div>
        </Container>;
    }
}

const mapStateToProps = (state: AppState): Object => ({
    viewState: state.authentication.jwt ? ViewState.SHOW_LOGOUT : ViewState.SHOW_LOGIN,
    fetchStatus: state.authentication.fetchStatus,
    username: state.authentication.username,
    pages: state.pageSetup.pageSetup ? state.pageSetup.pageSetup.pages : {}
});

const mapDispatchToProps = (dispatch: Function): Object => ({
    handleLogin: (username: string, password: string) => {
        dispatch(AuthenticationActions.start(userCredentials(username, password)));
    },
    handleLogout: () => {
        dispatch(GlobalActions.logout());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withLocalization(withStyles(style)(LoginPage))));

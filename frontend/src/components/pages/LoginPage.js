// @flow
import React from 'react';
import {withLocalization} from "react-localize";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import {AuthenticationActions} from "../../redux/authentication";
import {connect} from 'react-redux';
import LogoutForm from "../elements/LogoutForm";
import LoginForm from "../elements/LoginForm";
import {withRouter} from "react-router-dom";
import {GlobalActions} from "../../redux/GlobalActions";
import type {UserCredentials} from "../../types/AuthenticationTypes";
import type {AppState} from "../../types/redux/AppState";
import type {
    WithLocalizationComponentProps,
    WithRouterComponentProps,
    WithStylesComponentProps
} from "../../types/Types";
import {makeStyles} from "@material-ui/core";

type LoginPageProps = WithStylesComponentProps & WithRouterComponentProps & WithLocalizationComponentProps & {
    viewState: number,
    pages: Object,
    username: string,
    fetchStatus: number,
    handleLogin: Function,
    handleLogout: Function
};

const ViewState = {
    SHOW_LOGIN: 1,
    SHOW_LOGOUT: 2
};

const useStyles = makeStyles(theme => ({
    root: theme.pageRoot,
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
}));

function LoginPage(props: LoginPageProps) {
    const classes = useStyles();

    const handleRedirect = () => {
        props.history.push("/");
    };

    let content;
    if(props.viewState === ViewState.SHOW_LOGIN) {
        content = <LoginForm username={props.username}
                             onClick={props.handleLogin}
                             handleRedirect={handleRedirect}
                             fetchStatus={props.fetchStatus}
        />;
    } else if(props.viewState === ViewState.SHOW_LOGOUT) {
        content = <LogoutForm username={props.username}
                              onClick={props.handleLogout}
        />;
    }
    return <Container component="main" maxWidth="xs" className={classes.root}>
        <CssBaseline />
        <div className={classes.paper}>
            {content}
        </div>
    </Container>;
}

const mapStateToProps = (state: AppState): Object => ({
    viewState: state.authentication.jwt ? ViewState.SHOW_LOGOUT : ViewState.SHOW_LOGIN,
    fetchStatus: state.authentication.fetchStatus,
    username: state.authentication.username,
    pages: state.pageSetup.pageSetup ? state.pageSetup.pageSetup.pages : {}
});

const userCredentials = (username: string, password: string): UserCredentials => {
    return {
        username,
        password
    }
};

const mapDispatchToProps = (dispatch: Function): Object => ({
    handleLogin: (username: string, password: string) => {
        dispatch(AuthenticationActions.start(userCredentials(username, password)));
    },
    handleLogout: () => {
        dispatch(GlobalActions.logout());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withLocalization((LoginPage))));

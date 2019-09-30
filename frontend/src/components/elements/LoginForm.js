// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import TextField from "@material-ui/core/TextField";
import FetchStatus from "../../api/FetchStatus";
import {withLocalization} from "react-localize";
import type {WithStylesComponentProps} from "../../types/Types";

type LoginFormProps = WithStylesComponentProps & {
    username: string,
    onClick: Function,
    fetchStatus: number
};

type LoginFormState = {
    username: string,
    password: string
}

const style: Function = (theme: Object): Object => ({
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    avatarSuccess: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.success.main
    },
    avatarError: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.error.main
    },
    textSuccess: {
        color: theme.palette.success.main
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    progress: {
        margin: theme.spacing(4),
    }
});

class LoginForm extends Component<LoginFormProps, LoginFormState> {

    constructor(props) {
        super(props);
        this.state = {
            username: props.username ? props.username : "",
            password: ""
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleLogin = () => {
        this.props.onClick(this.state.username, this.state.password);
    };

    handleUsernameChange = (e) => {
        this.setState({
            ...this.state,
            username: e.target.value
        })
    };

    handlePasswordChange = (e) => {
        this.setState({
            ...this.state,
            password: e.target.value
        })
    };

    loginView = (isLoading: boolean) => {
        return <form className={this.props.classes.form} noValidate key={"loginForm.form"}>
            <TextField
                variant="outlined"
                margin="normal"
                ref="username"
                required
                fullWidth
                id="username"
                label={this.props.localize('login.username')}
                name="username"
                autoFocus
                value={this.state.username}
                onChange={this.handleUsernameChange}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                ref="password"
                id="password"
                name="password"
                label={this.props.localize('login.password')}
                type="password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
            />
            <Button
                onClick={this.handleLogin}
                fullWidth
                disabled={isLoading}
                variant="contained"
                color="primary"
                className={this.props.classes.submit}>
                {this.props.localize('login.signIn')}
            </Button>
        </form>;
    };


    render() {
        let content;
        if (this.props.fetchStatus === FetchStatus.ACTIVE) {
            content = this.loginView(true);
        } else if (this.props.fetchStatus === FetchStatus.SUCCESS) {
            content = null;
        } else {
            content = this.loginView(false);
        }
        let headline;
        let avatarClass;
        if (this.props.fetchStatus === FetchStatus.SUCCESS) {
            headline = <Typography component="h1" variant="h5" className={this.props.classes.textSuccess} key={"loginForm.headline"}>
                {this.props.localize('login.success')}
            </Typography>;
            avatarClass = this.props.classes.avatarSuccess;
        } else if (this.props.fetchStatus === FetchStatus.ERROR) {
            headline = <Typography component="h1" variant="h5" color={"error"} key={"loginForm.headline"}>
                {this.props.localize('login.error')}
            </Typography>;
            avatarClass = this.props.classes.avatarError;
        } else {
            headline = <Typography component="h1" variant="h5" key={"loginForm.headline"}>
                {this.props.localize('login.signIn')}
            </Typography>;
            avatarClass = this.props.classes.avatar;
        }
        return ([
                <Avatar className={avatarClass} key={"loginForm.avatar"}>
                    <LockOutlinedIcon />
                </Avatar>,
                headline,
                content]
        )
    }
}

export default withLocalization(withStyles(style)(LoginForm));
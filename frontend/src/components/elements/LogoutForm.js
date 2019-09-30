// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import Button from "@material-ui/core/Button";
import LockOpenOutlinedIcon from "@material-ui/icons/LockOpenOutlined";
import Avatar from "@material-ui/core/Avatar";
import {withLocalization} from "react-localize";

type ContentProps = {
    username: string,
    onClick: Function
};

const style: Function = (theme: Object): Object => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    logout: {
        margin: theme.spacing(3, 0, 2),
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    }
});

class LogoutForm extends Component<ContentProps> {
    render() {
        return ([
                <Avatar className={this.props.classes.avatar} key={"logoutForm.avatar"}>
                    <LockOpenOutlinedIcon/>
                </Avatar>,
                <Typography variant="h5" key={"logoutForm.greeting"}>
                    {this.props.localize('login.greeting')} {this.props.username ? this.props.username : this.props.localize('login.defaultUserName')}!
                </Typography>,
                <form className={this.props.classes.form} noValidate key={"logoutForm.form"}>
                    <Button
                        onClick={this.props.onClick}
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={this.props.classes.logout}>
                        {this.props.localize('login.signOut')}
                    </Button>
                </form>
            ]
        )
    }
}

export default withLocalization(withStyles(style)(LogoutForm));
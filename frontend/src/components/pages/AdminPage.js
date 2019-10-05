// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import {withLocalization} from "react-localize";


type ContentProps = {
    history: Array<string>
};

const style: Function = (theme: Object): Object => ({
    root: theme.pageRoot
});

class AdminPage extends Component<ContentProps> {

    render() {
        return <div className={this.props.classes.root}>
                    <Typography variant={'body1'}>
                        {this.props.localize('admin.body')}
                    </Typography>
                </div>
    }
}

export default withLocalization(withStyles(style)(AdminPage));
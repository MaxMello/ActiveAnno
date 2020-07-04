// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import {withLocalization} from "react-localize";
import type {WithLocalizationComponentProps, WithStylesComponentProps} from "../../types/Types";


type AdminPageProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    history: Array<string>
};

const style: Function = (theme: Object): Object => ({
    root: theme.pageRoot
});

class AdminPage extends Component<AdminPageProps> {

    render() {
        return <div className={this.props.classes.root}>
                    <Typography variant={'body1'}>
                        {this.props.localize('admin.body')}
                    </Typography>
                </div>
    }
}

export default withLocalization(withStyles(style)(AdminPage));
// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withLocalization} from "react-localize";
import type {
    WithLocalizationComponentProps,
    WithStylesComponentProps
} from "../../../types/Types";
import {Grid} from "@material-ui/core";
import InteractionComponentWrapper from "../interaction/InteractionComponentWrapper";
import type {InputMapping} from "../../../types/ManageTypes";
import TextField from "@material-ui/core/TextField";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChipInput from "material-ui-chip-input";


type DocumentMappingStepProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    id: string,
    updateConfigValue: Function,
    isNewConfig: boolean,
    inputMapping: InputMapping
};

const style: Function = (theme: Object): Object => ({
    defaultFormControl: theme.defaultFormControl,
    chipInput: theme.defaultChipInput
});


class DocumentMappingStep extends Component<DocumentMappingStepProps> {

    render() {
        let currentMetaData = this.props.inputMapping.metaData;
        return <Grid container spacing={4}>
            <Grid item xs={12}>
                <InteractionComponentWrapper name={this.props.localize('project.inputMapping.documentText.name')}
                                             caption={ this.props.localize('project.inputMapping.documentText.caption')}>
                    <TextField
                        value={this.props.inputMapping.documentText.key}
                        onChange={(e) => {
                            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["inputMapping", "documentText", "key"], e.target.value);
                        }}
                        className={this.props.classes.defaultFormControl}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                </InteractionComponentWrapper>
            </Grid>
            <Grid item xs={12}>
                <InteractionComponentWrapper name={this.props.localize('project.inputMapping.metaData.name')}
                                             caption={ this.props.localize('project.inputMapping.metaData.caption')}>
                    <MuiThemeProvider><ChipInput
                        className={this.props.classes.chipInput}
                        value={currentMetaData.map(m => m.key)}
                        onAdd={(chip) => {
                            chip = chip.trim();
                            currentMetaData.push({
                                key: chip,
                                id: chip.replace(".", "_")
                            });
                            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["inputMapping", "metaData"], currentMetaData);
                        }}
                        onDelete={(chip) => {
                            currentMetaData = currentMetaData.filter(c => c.key !== chip);
                            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["inputMapping", "metaData"], currentMetaData);
                        }}
                        allowDuplicates={false}
                        fullWidth={true}
                        newChipKeyCodes={[13, 9]}
                    /></MuiThemeProvider>
                </InteractionComponentWrapper>
            </Grid>
        </Grid>;
    }

}

export default withLocalization(withStyles(style)(DocumentMappingStep));
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
import type {InputMapping, ManageConfigFull} from "../../../types/ManageTypes";
import TextField from "@material-ui/core/TextField";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChipInput from "material-ui-chip-input";
import type {Layout, LayoutArea} from "../../../types/LayoutConfigTypes";
import {LayoutAreaTypes} from "../../../constants/LayoutAreaTypes";
import {generateExampleDocument} from "./LayoutStep";


type DocumentMappingStepProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    id: string,
    updateConfigValue: Function,
    isNewConfig: boolean,
    inputMapping: InputMapping,
    layout: Layout,
    config: ManageConfigFull
};

const style: Function = (theme: Object): Object => ({
    defaultFormControl: theme.defaultFormControl,
    chipInput: theme.defaultChipInput
});

function buildLayoutCommonArea(inputMapping: InputMapping): LayoutArea {
    return {
        id: LayoutAreaTypes.COMMON,
        rows: [
            {
                cols: (inputMapping.metaData.map(m => {
                    return {
                        width: {
                            xs: 12,
                            sm: 6,
                            md: 6,
                            lg: 4,
                            xl: 3
                        },
                        children: [
                            {
                                type: "Text",
                                text: `${m.id}: `
                            },
                            {
                                type: "TextMetaData",
                                id: m.id
                            }
                        ]
                    }
                }).concat(
                    {
                        width: {
                            xs: 12
                        },
                        children: [
                            {
                                type: "DocumentText",
                                label: "Document text"
                            }
                        ]
                    }
                ))
            }
        ]
    };
}


class DocumentMappingStep extends Component<DocumentMappingStepProps> {


    updateLayoutCommonArea() {
        const area = buildLayoutCommonArea(this.props.inputMapping);
        this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["layout", "layoutAreas", LayoutAreaTypes.COMMON], area);
        this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["layout", "exampleDocument"], generateExampleDocument(this.props.config, this.props.localize));
    }
    

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
                                id: chip.replaceAll(".", "_")
                            });
                            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["inputMapping", "metaData"], currentMetaData);
                            this.updateLayoutCommonArea();
                        }}
                        onDelete={(chip) => {
                            currentMetaData = currentMetaData.filter(c => c.key !== chip);
                            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["inputMapping", "metaData"], currentMetaData);
                            this.updateLayoutCommonArea();
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
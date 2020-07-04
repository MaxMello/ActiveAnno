// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withLocalization} from "react-localize";
import type {WithLocalizationComponentProps, WithStylesComponentProps} from "../../../types/Types";
import {Grid} from "@material-ui/core";
import type {InputMapping, ManageProject} from "../../../types/manage/ManageTypes";
import TextField from "@material-ui/core/TextField";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChipInput from "material-ui-chip-input";
import {LayoutAreaTypes} from "../../../constants/LayoutAreaTypes";
import {generateExampleDocument} from "./LayoutStep";
import type {Layout, LayoutArea} from "../../../types/project/layout/Layout";
import InputWrapper from "../InputWrapper";


type DocumentMappingStepProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    id: string,
    updateProjectValue: Function,
    isNewProject: boolean,
    inputMapping: InputMapping,
    layout: Layout,
    project: ManageProject
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
                            sm: 12,
                            md: 6,
                            lg: 6,
                            xl: 6
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
        this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id, ["layout", "layoutAreas",
            LayoutAreaTypes.COMMON], area);
        this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id, ["layout", "exampleDocument"],
            generateExampleDocument(this.props.project, this.props.localize));
    }
    

    render() {
        let currentMetaData = this.props.inputMapping.metaData;
        return <Grid container spacing={4}>
            <Grid item xs={12}>
                <InputWrapper name={this.props.localize('project.inputMapping.documentText.name')}
                                             caption={ this.props.localize('project.inputMapping.documentText.caption')}
                                             disabled={false}
                                             keyValue={"ICWDocumentMapping1"}>
                    <TextField
                        value={this.props.inputMapping.documentText.key}
                        onChange={(e) => {
                            this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
                                ["inputMapping", "documentText", "key"], e.target.value);
                            this.updateLayoutCommonArea();
                        }}
                        className={this.props.classes.defaultFormControl}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                </InputWrapper>
            </Grid>
            <Grid item xs={12}>
                <InputWrapper name={this.props.localize('project.inputMapping.metaData.name')}
                                             caption={ this.props.localize('project.inputMapping.metaData.caption')}
                                             disabled={false}
                                             keyValue={"ICWDocumentMapping2"}
                >
                    <MuiThemeProvider><ChipInput
                        className={this.props.classes.chipInput}
                        value={currentMetaData.map(m => m.key)}
                        onAdd={(chip) => {
                            const chipTrimmed = chip.trim();
                            currentMetaData.push({
                                key: chipTrimmed,
                                id: chipTrimmed.replace(/\./g, "_")
                            });
                            this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
                                ["inputMapping", "metaData"], currentMetaData);
                            this.updateLayoutCommonArea();
                        }}
                        onDelete={(chip) => {
                            currentMetaData = currentMetaData.filter(c => c.key !== chip);
                            this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
                                ["inputMapping", "metaData"], currentMetaData);
                            this.updateLayoutCommonArea();
                        }}
                        allowDuplicates={false}
                        fullWidth={true}
                        newChipKeyCodes={[13, 9]}
                    /></MuiThemeProvider>
                </InputWrapper>
            </Grid>
        </Grid>;
    }
}

export default withLocalization(withStyles(style)(DocumentMappingStep));
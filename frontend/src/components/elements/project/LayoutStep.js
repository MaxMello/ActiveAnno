// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withLocalization} from "react-localize";
import type {
    WithLocalizationComponentProps,
    WithStylesComponentProps
} from "../../../types/Types";
import {Grid} from "@material-ui/core";
import type {ManageConfigFull} from "../../../types/ManageTypes";
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import Typography from "@material-ui/core/Typography";
import { Target } from '../../../redux/annotationData';
import AnnotateDocumentCard from "../interaction/AnnotateDocumentCard";
import DocumentDataPanel from "../illustration/DocumentDataPanel";


type LayoutStepProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    id: string,
    updateConfigValue: Function,
    isNewConfig: boolean,
    config: ManageConfigFull
};

const style: Function = (theme: Object): Object => ({
    defaultFormControl: theme.defaultFormControl,
    chipInput: theme.defaultChipInput
});

const exampleDocument = {
    documentID: "EXAMPLE_DOCUMENT",
    spanAnnotations: {},
    documentAnnotations: {},
    documentData: {

    }
};

export function generateExampleDocument(config: ManageConfigFull, localize: Function) {
    exampleDocument.documentData = {};
    exampleDocument.documentData["DOCUMENT_TEXT"] = localize('project.layout.example.documentText');
    config.inputMapping.metaData.forEach(m => {
        exampleDocument.documentData[m.id] = `${m.key} ${localize('project.layout.example.metaData.example')}`;
    });
    return exampleDocument;
}

class LayoutStep extends Component<LayoutStepProps> {


    componentDidMount(): * {
        if(!this.props.config.layout.exampleDocument) {
            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["layout", "exampleDocument"], generateExampleDocument(this.props.config, this.props.localize));
        }
    }


    render() {
        const docEditor = <Editor
            value={this.props.config.layout.exampleDocument ? this.props.config.layout.exampleDocument.documentData : exampleDocument.documentData}
            onChange={(v) => {
                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["layout", "exampleDocument", "documentData"], v);
            }}
        />;

        const layoutEditor = <Editor
            value={this.props.config.layout.layoutAreas}
            onChange={() => {}}
        />;

        return <Grid container spacing={4}>
            <Grid item xs={12}>
                <Typography>
                    {this.props.localize("project.layout.description")}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {docEditor}
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    {this.props.localize("project.layout.example.description")}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <DocumentDataPanel config={this.props.config}
                                   document={this.props.config.layout.exampleDocument ? this.props.config.layout.exampleDocument : exampleDocument}/>
                <AnnotateDocumentCard
                    config={this.props.config}
                    document={this.props.config.layout.exampleDocument ? this.props.config.layout.exampleDocument : exampleDocument}
                    currentTarget={Target.DOCUMENT}
                    setDocumentAnnotationValue={() => {

                    }}
                    setSpanAnnotationValue={() => {

                    }}
                    setCurrentTarget={() => {

                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    {this.props.localize("project.layout.json.description")}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {layoutEditor}
            </Grid>
        </Grid>;
    }

}

export default withLocalization(withStyles(style)(LayoutStep));
// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withLocalization} from "react-localize";
import type {
    AnnotationID,
    Dictionary,
    WithLocalizationComponentProps,
    WithStylesComponentProps
} from "../../../types/Types";
import {Grid} from "@material-ui/core";
import type {ManageProject} from "../../../types/manage/ManageTypes";
import Typography from "@material-ui/core/Typography";
import AnnotateDocumentCard from "../interaction/AnnotateDocumentCard";
import DocumentDataPanel from "../illustration/DocumentDataPanel";
import Container from "@material-ui/core/Container";
import {LayoutAreaTypes} from "../../../constants/LayoutAreaTypes";
import {buildLayoutDocumentArea} from "./AnnotationsStep";
import type {AnnotationDefinitionInStore} from "../../../types/annotationdefinition/AnnotationDefinition";
import type {Column, LayoutArea, Row} from "../../../types/project/layout/Layout";

type LayoutStepProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    id: string,
    updateProjectValue: Function,
    isNewProject: boolean,
    project: ManageProject,
    annotationDefinitions: Dictionary<AnnotationID, AnnotationDefinitionInStore>
};

const style: Function = (theme: Object): Object => ({
    defaultFormControl: theme.defaultFormControl,
    chipInput: theme.defaultChipInput
});

const exampleDocument = {
    documentID: "EXAMPLE_DOCUMENT",
    annotations: {},
    documentData: {

    }
};

export function generateExampleDocument(project: ManageProject, localize: Function) {
    exampleDocument.documentData = {};
    exampleDocument.documentData["DOCUMENT_TEXT"] = localize('project.layout.example.documentText');
    project.inputMapping.metaData.forEach(m => {
        exampleDocument.documentData[m.id] = `${m.key} ${localize('project.layout.example.metaData.example')}`;
    });
    return exampleDocument;
}

class LayoutStep extends Component<LayoutStepProps> {

    constructor(props) {
        super(props);
        (this: any).layoutWasUpdated = this.layoutWasUpdated.bind(this);
    }

    layoutWasUpdated(): boolean {
        return (Object.values(this.props.project.layout.layoutAreas): any)
            .some((layoutArea: LayoutArea) => {
                return layoutArea.rows.some((row: Row) => {
                    return row.cols.some((col: Column) => {
                        return col.children.some((child: any) => {
                            return child.annotationDefinition != null
                        });
                    });
                });
            });
    }

    componentDidMount() {
        if(!this.props.project.layout.exampleDocument) {
            this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
                ["layout", "exampleDocument"], generateExampleDocument(this.props.project, this.props.localize));
        }
        if(!this.layoutWasUpdated()) {
            const layoutDocumentTargetArea = buildLayoutDocumentArea(this.props.project.annotationSchema.elements,
                this.props.annotationDefinitions);
            this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
                ["layout", "layoutAreas", LayoutAreaTypes.DOCUMENT_TARGET], layoutDocumentTargetArea);
        }
    }

    render() {

        return <Container component="main" maxWidth="lg">
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography>
                        {this.props.localize("project.layout.example.description")}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <DocumentDataPanel project={this.props.project}
                                       document={this.props.project.layout.exampleDocument ?
                                           this.props.project.layout.exampleDocument : exampleDocument}/>
                    {this.layoutWasUpdated() &&
                        <AnnotateDocumentCard
                        project={this.props.project}
                        document={this.props.project.layout.exampleDocument ?
                            this.props.project.layout.exampleDocument : exampleDocument}
                        setAnnotationValue={() => {

                        }}
                    />
                    }
                </Grid>
            </Grid>
        </Container>
    }

}

export default withLocalization(withStyles(style)(LayoutStep));
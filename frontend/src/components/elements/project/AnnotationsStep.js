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
import {Grid, OutlinedInput} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import OverflowMenuItem from "../OverflowMenuItem";
import {AnnotationDefinition} from "../../../constants/AnnotationDefinition";
import Button from "@material-ui/core/Button";
import type {ManageProject} from "../../../types/manage/ManageTypes";
import {LayoutAreaTypes} from "../../../constants/LayoutAreaTypes";
import {generateExampleDocument} from "./LayoutStep";
import type {LayoutArea} from "../../../types/project/layout/Layout";
import InputWrapper from "../InputWrapper";
import type {AnnotationSchema, AnnotationSchemaElement} from "../../../types/manage/AnnotationSchema";
import type {Target} from "../../../types/annotationdefinition/target/Target";
import type {AnnotationDefinitionInStore} from "../../../types/annotationdefinition/AnnotationDefinition";

type AnnotationsStepProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    id: string,
    updateProjectValue: Function,
    isNewProject: boolean,
    annotationSchema: AnnotationSchema,
    project: ManageProject,
    annotationDefinitions: Dictionary<AnnotationID, AnnotationDefinitionInStore>
};

type AnnotationsStepsState = {
    newSchemaElement: {
        annotationDefinitionID: string,
        target: Target
    }
};

const style: Function = (theme: Object): Object => ({
    ...theme.buttons,
    dropDown: theme.defaultDropDown,
    defaultFormControl: theme.defaultFormControl,
    buttonGroup: theme.defaultFullWidthButtonGroup,
    interactionCaption: theme.interactionCaption,
    chipInput: theme.defaultChipInput,
    buttonGrid: {
        display: "flex",
    },
    addButton: {
        alignSelf: "center",
        display: "flex"
    },
    deleteButton: {
        ...theme.errorButton,
        alignSelf: "center",
        display: "flex",
        ...{
            '&:hover': {
                ...theme.errorButtonSelected
            }
        }
    },
    addOptionButton: {
        alignSelf: "center"
    },
    deleteOptionButton: {
        ...theme.errorButton,
        ...{
            '&:hover': {
                ...theme.errorButtonSelected
            },
            alignSelf: "center"
        }
    },
    deleteButtonSelected: theme.errorButtonSelected,
    deleteGrid: {
        justifyContent: "flex-end",
        display: "flex"
    }
});

function buildActionElementForAnnotation(annotation: ?AnnotationDefinitionInStore) {
    if(annotation == null) {
        return null;
    } else if(annotation.type === AnnotationDefinition.TagSetAnnotationDefinition) {
        if(annotation.options.length > 5) {
            return {
                "type": "TagSetDropdown",
                "referenceAnnotationDefinitionID": annotation.id,
                "annotationDefinition": annotation
            }
        } else {
            return {
                "type": "TagSetButtonGroup",
                "referenceAnnotationDefinitionID": annotation.id,
                "annotationDefinition": annotation
            }
        }
    } else if(annotation.type === AnnotationDefinition.BooleanAnnotationDefinition) {
        return {
            "type": "BooleanButtonGroup",
            "referenceAnnotationDefinitionID": annotation.id,
            "annotationDefinition": annotation
        }
    } else if(annotation.type === AnnotationDefinition.OpenTextAnnotationDefinition) {
        return {
            "type": "OpenTextInput",
            "referenceAnnotationDefinitionID": annotation.id,
            "annotationDefinition": annotation
        }
    } else if(annotation.type === AnnotationDefinition.OpenTagAnnotationDefinition) {
        return {
            "type": "OpenTagChipInput",
            "referenceAnnotationDefinitionID": annotation.id,
            "annotationDefinition": annotation
        }
    } else if(annotation.type === AnnotationDefinition.ClosedNumberAnnotationDefinition) {
        return {
            "type": "ClosedNumberSlider",
            "referenceAnnotationDefinitionID": annotation.id,
            "annotationDefinition": annotation
        }
    } else if(annotation.type === AnnotationDefinition.OpenNumberAnnotationDefinition) {
        return {
            "type": "OpenNumberInput",
            "referenceAnnotationDefinitionID": annotation.id,
            "annotationDefinition": annotation
        }
    } else if(annotation.type === AnnotationDefinition.NumberRangeAnnotationDefinition) {
        return {
            "type": "NumberRangeSlider",
            "referenceAnnotationDefinitionID": annotation.id,
            "annotationDefinition": annotation
        }
    } else {
        return null;
    }
}

export function buildLayoutDocumentArea(elements: Array<AnnotationSchemaElement>,
                 annotationDefinitions: Dictionary<AnnotationID, AnnotationDefinitionInStore>): LayoutArea {
    return {
        id: LayoutAreaTypes.DOCUMENT_TARGET,
        rows: [
            {
                cols: elements.map(a => {
                    return {
                        width: {
                            xs: 12,
                            sm: 12,
                            md: 6,
                            lg: 6,
                            xl: 6
                        },
                        children: [
                            (buildActionElementForAnnotation(annotationDefinitions[a.annotationDefinitionID]): any)
                        ]
                    }
                })
            }
        ]
    };
}

class AnnotationsStep extends Component<AnnotationsStepProps, AnnotationsStepsState> {

    constructor(props) {
        super(props);
        this.state = {
            newSchemaElement: {
                annotationDefinitionID: "",
                target: {
                    type: "DocumentTarget"
                }
            }
        };
        (this: any).addAnnotation = this.addAnnotation.bind(this);
        (this: any).deleteAnnotation = this.deleteSchemaElement.bind(this);
        const layoutDocumentTargetArea = buildLayoutDocumentArea(this.props.annotationSchema.elements,
            this.props.annotationDefinitions);
        this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
            ["layout", "layoutAreas", LayoutAreaTypes.DOCUMENT_TARGET], layoutDocumentTargetArea);
        this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
            ["layout", "exampleDocument"], generateExampleDocument(this.props.project, this.props.localize));
    }

    addAnnotation() {
        if(this.state.newSchemaElement.annotationDefinitionID.length > 0) {
            if(!(this.props.annotationSchema.elements.map(element => element.annotationDefinitionID)
                .includes(this.state.newSchemaElement.annotationDefinitionID))) {
                const newList = [...this.props.annotationSchema.elements];
                newList.push(this.state.newSchemaElement);
                this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id, ["annotationSchema",
                    "elements"], newList);
                const layoutDocumentTargetArea = buildLayoutDocumentArea(newList, this.props.annotationDefinitions);
                this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
                    ["layout", "layoutAreas", LayoutAreaTypes.DOCUMENT_TARGET], layoutDocumentTargetArea);
                this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
                    ["layout", "exampleDocument"], generateExampleDocument(this.props.project, this.props.localize));
                this.setState({
                    ...this.state,
                    ...{
                        newSchemaElement: {
                            annotationDefinitionID: "",
                            target: {
                                type: "DocumentTarget"
                            }
                        }
                    }
                });
            } else {
                this.setState({
                    ...this.state,
                    ...{
                        newSchemaElement: {
                            annotationDefinitionID: "",
                            target: {
                                type: "DocumentTarget"
                            }
                        }
                    }
                });
            }
        }
    }

    deleteSchemaElement(id: string) {
        const newElements = this.props.annotationSchema.elements.filter(e => e.annotationDefinitionID !== id);
        this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
            ["annotationSchema", "elements"], newElements);
        const layoutDocumentTargetArea = buildLayoutDocumentArea(newElements, this.props.annotationDefinitions);
        this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
            ["layout", "layoutAreas", LayoutAreaTypes.DOCUMENT_TARGET], layoutDocumentTargetArea);
        this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id, ["layout", "exampleDocument"],
            generateExampleDocument(this.props.project, this.props.localize));
    }

    addElementView() {
        return <Grid item xs={12} key={`annotationSchemaElementNew`}>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={9}>
                    <InputWrapper
                        name={this.props.localize('project.annotationSchema.annotationID.new.name')}
                        caption={this.props.localize('project.annotationSchema.annotationID.new.caption')}
                        keyValue={`annotationSchemaElementIDInputNew`}>
                        <Select value={this.state.newSchemaElement.annotationDefinitionID}
                                fullWidth
                                className={this.props.classes.defaultFormControl}
                                onChange={event => {
                                    this.setState({
                                        ...this.state,
                                        newSchemaElement: {
                                            ...this.state.newSchemaElement,
                                            annotationDefinitionID: event.target.value
                                        }
                                    })
                                }}
                                input={<OutlinedInput labelWidth={50} name="annotationDefinitionID"
                                                      id="annotationDefinitionID"
                                                      classes={{input: this.props.classes.input}}/>}>
                            {(Object.values(this.props.annotationDefinitions): any)
                                .map((a: AnnotationDefinitionInStore) => {
                                return <OverflowMenuItem value={a.id} key={`annDefOptionAdd${a.id}`}>
                                    {a.name} ({a.id})
                                </OverflowMenuItem>
                            })}
                        </Select>
                    </InputWrapper>
                </Grid>
                <Grid item xs={12} sm={3} className={this.props.classes.buttonGrid}>
                    <Button
                        onClick={() => {
                            this.addAnnotation()
                        }}
                        fullWidth
                        variant="contained"
                        color={"primary"}
                        className={this.props.classes.addButton}
                        size="large">
                        {this.props.localize('project.annotationSchema.add.button')}
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    }

    render() {
        const existingAnnotationsView = this.props.annotationSchema.elements.map(a => {
            return <Grid item xs={12} key={`annotationSchemaElement${a.annotationDefinitionID}`}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={9}>
                        <InputWrapper
                            name={this.props.localize('project.annotationSchema.annotationID.name')}
                            caption={this.props.localize('project.annotationSchema.annotationID.caption')}
                            keyValue={`annotationSchemaElementIDInput${a.annotationDefinitionID}`}>
                            <Select value={a.annotationDefinitionID}
                                    fullWidth
                                    className={this.props.classes.defaultFormControl}
                                    onChange={event => {
                                        const newList = [...this.props.annotationSchema.elements];
                                        const objIndex = newList.findIndex(
                                            e => e.annotationDefinitionID === a.annotationDefinitionID);
                                        newList[objIndex] = {
                                            ...a,
                                            ...{
                                                annotationDefinitionID: event.target.value
                                            }
                                        }
                                        this.props.updateProjectValue(
                                            this.props.isNewProject ? null : this.props.id,
                                            ["annotationSchema", "elements"], newList);
                                    }}
                                    input={<OutlinedInput labelWidth={50} name="annotationDefinitionID"
                                                          id="annotationDefinitionID"
                                                          classes={{input: this.props.classes.input}}/>}>
                                {(Object.values(this.props.annotationDefinitions): any)
                                    .map((aD: AnnotationDefinitionInStore) => {
                                        return <OverflowMenuItem value={aD.id} key={`annDefOption${a.id}.${aD.id}`}>
                                            {aD.name} ({aD.id})
                                        </OverflowMenuItem>
                                    })}
                            </Select>
                        </InputWrapper>
                    </Grid>
                    <Grid item xs={12} sm={3} className={this.props.classes.buttonGrid}>
                        <Button
                            onClick={() => {
                                this.deleteSchemaElement(a.id)
                            }}
                            fullWidth
                            variant="contained"
                            className={this.props.classes.deleteButton}
                            size="large">
                            {this.props.localize('project.annotationSchema.delete.button')}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        });
        const addElementView = this.addElementView();
        return <Grid container spacing={4}>
            {
                existingAnnotationsView
            }
            {
                addElementView
            }
        </Grid>;
    }

}

export default withLocalization(withStyles(style)(AnnotationsStep));
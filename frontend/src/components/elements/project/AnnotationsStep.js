// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withLocalization} from "react-localize";
import type {
    WithLocalizationComponentProps,
    WithStylesComponentProps
} from "../../../types/Types";
import {Grid, OutlinedInput, Typography} from "@material-ui/core";
import InteractionComponentWrapper from "../interaction/InteractionComponentWrapper";
import Select from "@material-ui/core/Select";
import OverflowMenuItem from "../OverflowMenuItem";
import FormControl from "@material-ui/core/FormControl";
import type {Annotations, TagSetOption} from "../../../types/AnnotationConfigTypes";
import {AnnotationType, DefaultAnnotations} from "../../../constants/AnnotationType";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import {Check, Close} from "@material-ui/icons";
import {CaseBehavior} from "../../../constants/CaseBehavior";
import {isArray} from "../../helper/HelperFunctions";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChipInput from "material-ui-chip-input";

type AnnotationsStepProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    id: string,
    updateConfigValue: Function,
    isNewConfig: boolean,
    annotations: Annotations
};

const style: Function = (theme: Object): Object => ({
    dropDown: theme.defaultDropDown,
    defaultFormControl: theme.defaultFormControl,
    buttonGroup: theme.defaultFullWidthButtonGroup,
    toggleButton: theme.defaultFullWidthToggleButton,
    toggleButtonSelected: theme.defaultToggleButtonSelected,
    interactionCaption: theme.interactionCaption,
    chipInput: theme.defaultChipInput,
    buttonGrid: {
        display: "flex",
    },
    addButton: {
        alignSelf: "start",
        [theme.breakpoints.up('md')]: {
            marginTop: 36
        },
    },
    toggleButtonDisabled: theme.defaultToggleButtonDisabled,
    deleteButton: {
        ...theme.errorButton,
        ...{
            '&:hover': {
                ...theme.errorButtonSelected
            },
            [theme.breakpoints.down('xs')]: {
                width: '100% !important',
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

class AnnotationsStep extends Component<AnnotationsStepProps> {

    constructor(props) {
        super(props);
        this.state = {
            newAnnotation: {
                id: "",
                type: undefined
            },
            newTagSetOptions: {

            }
        };
        this.addAnnotation = this.addAnnotation.bind(this);
        this.deleteAnnotation = this.deleteAnnotation.bind(this);
    }

    addAnnotation() {
        if(this.state.newAnnotation.type !== undefined && this.state.newAnnotation.id.length > 0) {
            if(!(this.state.newAnnotation.id in this.props.annotations.annotationMap)) {
                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["annotations", "annotationMap", this.state.newAnnotation.id], {
                    ...DefaultAnnotations[this.state.newAnnotation.type],
                    ...{
                        id: this.state.newAnnotation.id,
                        name: this.state.newAnnotation.id,
                        shortName: this.state.newAnnotation.id
                    }
                });
                this.setState({
                    ...this.state,
                    ...{
                        newAnnotation: {
                            id: "",
                            type: undefined
                        }
                    }
                });
            } else {
                this.setState({
                    ...this.state,
                    ...{
                        newAnnotation: {
                            id: "",
                            type: this.state.newAnnotation.type
                        }
                    }
                });
            }
        }
    }

    deleteAnnotation(id: string) {
        const currentMap = this.props.annotations.annotationMap;
        delete currentMap[id];
        this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["annotations", "annotationMap"], currentMap);
    }

    canAddNewTagSetOption(annotationID): boolean {
        console.log("Add new tag set option", annotationID, this.state.newTagSetOptions);
        return this.state.newTagSetOptions[annotationID] &&
            this.state.newTagSetOptions[annotationID].id && this.state.newTagSetOptions[annotationID].id.length > 0 &&
            this.state.newTagSetOptions[annotationID].name && this.state.newTagSetOptions[annotationID].name.length > 0 &&
            this.state.newTagSetOptions[annotationID].shortName && this.state.newTagSetOptions[annotationID].shortName.length > 0;
    }

    addTagSetOption(annotationID: string) {
        if(this.canAddNewTagSetOption(annotationID)) {
            console.log("ABC", this.state.newTagSetOptions[annotationID].id, this.props.annotations.annotationMap[annotationID].options.map(o => o.id));
            if(!(this.props.annotations.annotationMap[annotationID].options.map(o => o.id)).includes(this.state.newTagSetOptions[annotationID].id)) {
                const currentOptions = this.props.annotations.annotationMap[annotationID].options;
                currentOptions.push({
                    id: this.state.newTagSetOptions[annotationID].id,
                    name: this.state.newTagSetOptions[annotationID].name,
                    shortName: this.state.newTagSetOptions[annotationID].shortName
                });
                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["annotations", "annotationMap", annotationID, "options"], currentOptions);
                this.setState({
                    ...this.state,
                    ...{
                        newTagSetOptions: {
                            ...this.state.newTagSetOptions,
                            [annotationID]: {
                                name: "",
                                shortName: "",
                                id: ""
                            }
                        }
                    }
                });
            } else {
                this.setState({
                    ...this.state,
                    ...{
                        newTagSetOptions: {
                            ...this.state.newTagSetOptions,
                            [annotationID]: {
                                ...this.state.newTagSetOptions[annotationID],
                                id: ""
                            }
                        }
                    }
                });
            }
        }
    }

    removeTagSetOption(annotationID: string, optionID: string) {
        let currentOptions = this.props.annotations.annotationMap[annotationID].options;
        currentOptions = currentOptions.filter(o => o !== optionID);
        this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["annotations", "annotationMap", annotationID, "options"], currentOptions);
    }

    addAnnotationView() {
        return [<Grid item xs={12} sm={6} md={5} lg={5} xl={5}>
            <InteractionComponentWrapper name={this.props.localize('project.annotations.add.type.name')}
                                         caption={this.props.localize('project.annotations.add.type.caption')}>
                <FormControl className={this.props.classes.dropDown} variant="outlined">
                    <Select value={this.state.newAnnotation.type}
                        onChange={e => {
                        this.setState({
                            ...this.state,
                            ...{
                                newAnnotation: {
                                    ...this.state.newAnnotation,
                                    type: e.target.value
                                }
                            }
                        })
                    }}
                            input={<OutlinedInput notched={false} labelWidth={50}/>}>
                        {
                            Object.values(AnnotationType).map(t => {
                                return <OverflowMenuItem value={t}>
                                    {this.props.localize(`project.annotations.type.${t}`)}
                                </OverflowMenuItem>
                            })
                        }

                    </Select>
                </FormControl>
            </InteractionComponentWrapper>
        </Grid>,
        <Grid item xs={12} sm={6} md={5} lg={5} xl={5}>
            <InteractionComponentWrapper name={this.props.localize('project.annotations.id.name')}
                                         caption={this.props.localize('project.annotations.id.caption')}>
                <TextField
                    value={this.state.newAnnotation.id}
                    onChange={e => {
                        this.setState({
                            ...this.state,
                            ...{
                                newAnnotation: {
                                    ...this.state.newAnnotation,
                                    id: e.target.value
                                }
                            }
                        })
                    }}
                    className={this.props.classes.defaultFormControl}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
            </InteractionComponentWrapper>
        </Grid>,
        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} className={this.props.classes.buttonGrid}>
                <Button
                    onClick={this.addAnnotation}
                    fullWidth
                    variant="contained"
                    disabled={this.state.newAnnotation.id.length === 0 || this.state.newAnnotation.type === undefined}
                    className={this.props.classes.addButton}
                    classes={{disabled: this.props.classes.toggleButtonDisabled}}
                    size="large"
                    color="primary">
                    {this.props.localize('project.annotations.add.button')}
                </Button>
        </Grid>];
    }

    renderAnnotationTypeSpecificInputs(annotation: any) {
        if(annotation.type === AnnotationType.PredefinedTagSetAnnotation) {
            return [
                this.addNumberInput(annotation, "minNumberOfTags"),
                this.addNumberInput(annotation, "maxNumberOfTags"),
                this.addTagSetOptionInput(annotation, "options")
            ];
        } else if(annotation.type === AnnotationType.BooleanAnnotation) {
            return this.addBooleanInput(annotation, "optional");
        } else if(annotation.type === AnnotationType.OpenTextAnnotation) {
            return [
                this.addNumberInput(annotation, "minLength"),
                this.addNumberInput(annotation, "maxLength"),
                this.addBooleanInput(annotation, "useDocumentTextAsDefault"),
                this.addBooleanInput(annotation, "optional")
            ];
        } else if(annotation.type === AnnotationType.OpenTagAnnotation) {
            return [
                this.addNumberInput(annotation, "minNumberOfTags"),
                this.addNumberInput(annotation, "maxNumberOfTags"),
                this.addBooleanInput(annotation, "trimWhitespace"),
                this.addBooleanInput(annotation, "useExistingValuesAsPredefinedTags"),
                this.addSelectInput(annotation, "caseBehavior", Object.values(CaseBehavior)),
                this.addTagInput(annotation, "predefinedTags")
            ];
        } else if(annotation.type === AnnotationType.ClosedNumberAnnotation) {
            return [
                this.addNumberInput(annotation, "min"),
                this.addNumberInput(annotation, "max"),
                this.addNumberInput(annotation, "step"),
                this.addBooleanInput(annotation, "optional")
            ];
        } else if(annotation.type === AnnotationType.OpenNumberAnnotation) {
            return [
                this.addNumberInput(annotation, "step"),
                this.addBooleanInput(annotation, "optional")
            ];
        } else if(annotation.type === AnnotationType.NumberRangeAnnotation) {
            return [
                this.addNumberInput(annotation, "min"),
                this.addNumberInput(annotation, "max"),
                this.addNumberInput(annotation, "step"),
                this.addBooleanInput(annotation, "optional")
            ];
        }
    }

    addNumberInput(annotation: any, key: string) {
        return <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
            <InteractionComponentWrapper name={this.props.localize(`project.annotations.${key}.name`)}
                                         caption={this.props.localize(`project.annotations.${key}.caption`)}>
                <TextField
                    value={this.props.annotations.annotationMap[annotation.id][key]}
                    onChange={(e) => {
                        this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["annotations", "annotationMap", annotation.id, key], e.target.value)
                    }}
                    type="number"
                    className={this.props.classes.defaultFormControl}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
            </InteractionComponentWrapper>
        </Grid>;
    }

    addBooleanInput(annotation: any, key: string) {
        return <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
            <InteractionComponentWrapper name={this.props.localize(`project.annotations.${key}.name`)}
                                         caption={this.props.localize(`project.annotations.${key}.caption`)}>
                <ToggleButtonGroup value={this.props.annotations.annotationMap[annotation.id][key]}
                                   exclusive
                                   className={this.props.classes.buttonGroup}
                                   onChange={(_, newValue) => {
                                       this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["annotations", "annotationMap", annotation.id, key], newValue)
                                   }
                                   }>
                    <ToggleButton value={true} className={this.props.classes.toggleButton} fullWidth
                                  classes={{selected: this.props.classes.toggleButtonSelected}}>
                        <Check/>
                        {this.props.localize('yes')}
                    </ToggleButton>
                    <ToggleButton value={false} className={this.props.classes.toggleButton} fullWidth
                                  classes={{selected: this.props.classes.toggleButtonSelected}}>
                        <Close/>
                        {this.props.localize('no')}
                    </ToggleButton>
                </ToggleButtonGroup>
            </InteractionComponentWrapper>
        </Grid>;
    }

    addTagInput(annotation: any, key: string) {
        let currentValues = this.props.annotations.annotationMap[annotation.id][key];
        return <Grid item xs={12} sm={6} md={6} lg={8} xl={3}> <InteractionComponentWrapper name={this.props.localize(`project.annotations.${key}.name`)}
                                            caption={this.props.localize(`project.annotations.${key}.caption`)}><MuiThemeProvider><ChipInput
            className={this.props.classes.chipInput}
            value={currentValues}
            onAdd={(chip) => {
                currentValues.push(chip);
                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["annotations", "annotationMap", annotation.id, key], currentValues);
            }}
            onDelete={(chip) => {
                currentValues = currentValues.filter(c => c !== chip);
                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["annotations", "annotationMap", annotation.id, key], currentValues);
            }}
            allowDuplicates={false}
            fullWidth={true}
            newChipKeyCodes={[13, 9]}
        /></MuiThemeProvider></InteractionComponentWrapper></Grid>;
    }

    addSelectInput(annotation: any, key: string, options: Array<string>) {
        return <Grid item xs={12} sm={6} md={6} lg={4} xl={3}> <InteractionComponentWrapper name={this.props.localize(`project.annotations.${key}.name`)}
                                            caption={this.props.localize(`project.annotations.${key}.caption`)}>
            <FormControl className={this.props.classes.defaultFormControl} variant="outlined" fullWidth>
                <Select value={ this.props.annotations.annotationMap[annotation.id][key] }
                        onChange={event => {
                            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["annotations", "annotationMap", annotation.id, key], event.target.value);
                        }}
                        input={<OutlinedInput notched={false} labelWidth={50}/>}>
                    {
                        options.map(o => {
                            return <OverflowMenuItem value={o}>
                                {this.props.localize(`project.annotations.${key}.${o}`)}
                            </OverflowMenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </InteractionComponentWrapper></Grid>;
    }

    addTagSetOptionInput(annotation: any, key: string) {
        return <Grid item xs={12}>
                <Grid container spacing={2}>
                {
                    annotation[key].map(option => {
                        return this.addSingleTagSetOptionInput(annotation, option, true);
                    })
                }
                {
                    this.addSingleTagSetOptionInput(annotation, undefined, false)
                }
                </Grid>
        </Grid>;
    }

    addSingleTagSetOptionInput(annotation: any, option: TagSetOption, existsAlready: boolean) {
        return <Grid item xs={12}>
            <ExpansionPanel defaultExpanded={true}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} className={this.props.classes.panelSummary} >
                <Typography>{existsAlready ? `${this.props.localize("project.annotations.tagSetOption")} ${option.name} (${option.id})` : this.props.localize("project.annotations.tagSetOption.add")}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={this.props.classes.panelDetails}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                        <InteractionComponentWrapper name={this.props.localize('project.annotations.tagSetOption.id.name')}
                                                     caption={this.props.localize('project.annotations.tagSetOption.id.caption')}>
                            <TextField
                                value={existsAlready ? option.id : (this.state.newTagSetOptions[annotation.id] ? this.state.newTagSetOptions[annotation.id].id : "")}
                                onChange={e => {
                                    if(existsAlready) {
                                        const currentOptions = annotation.options;
                                        const optIndex = currentOptions.findIndex((o => o.id === option.id));
                                        currentOptions[optIndex].id = e.target.value;
                                        this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["annotations", "annotationMap", annotation.id, "options"], currentOptions);
                                    } else {
                                        this.setState({
                                            ...this.state,
                                            ...{
                                                newTagSetOptions: {
                                                    ...this.state.newTagSetOptions,
                                                    [annotation.id]: {
                                                        ...this.state.newTagSetOptions[annotation.id],
                                                        id: e.target.value
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }}
                                className={this.props.classes.defaultFormControl}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        </InteractionComponentWrapper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                        <InteractionComponentWrapper name={this.props.localize('project.annotations.tagSetOption.name.name')}
                                                     caption={this.props.localize('project.annotations.tagSetOption.name.caption')}>
                            <TextField
                                value={existsAlready ? option.name : (this.state.newTagSetOptions[annotation.id] ? this.state.newTagSetOptions[annotation.id].name : "")}
                                onChange={event => {
                                    if(existsAlready) {
                                        const currentOptions = annotation.options;
                                        const optIndex = currentOptions.findIndex((o => o.id === option.id));
                                        currentOptions[optIndex].name = event.target.value;
                                        this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["annotations", "annotationMap", annotation.id, "options"], currentOptions);
                                    } else {
                                        this.setState({
                                            ...this.state,
                                            ...{
                                                newTagSetOptions: {
                                                    ...this.state.newTagSetOptions,
                                                    [annotation.id]: {
                                                        ...this.state.newTagSetOptions[annotation.id],
                                                        name: event.target.value
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }}
                                className={this.props.classes.defaultFormControl}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        </InteractionComponentWrapper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                        <InteractionComponentWrapper name={this.props.localize('project.annotations.tagSetOption.shortName.name')}
                                                     caption={this.props.localize('project.annotations.tagSetOption.shortName.caption')}>
                            <TextField
                                value={existsAlready ? option.shortName : (this.state.newTagSetOptions[annotation.id] ? this.state.newTagSetOptions[annotation.id].shortName : "")}
                                onChange={event => {
                                    if(existsAlready) {
                                        const currentOptions = annotation.options;
                                        const optIndex = currentOptions.findIndex((o => o.id === option.id));
                                        currentOptions[optIndex].shortName = event.target.value;
                                        this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["annotations", "annotationMap", annotation.id, "options"], currentOptions);
                                    } else {
                                        this.setState({
                                            ...this.state,
                                            ...{
                                                newTagSetOptions: {
                                                    ...this.state.newTagSetOptions,
                                                    [annotation.id]: {
                                                        ...this.state.newTagSetOptions[annotation.id],
                                                        shortName: event.target.value
                                                    }
                                                }
                                            }
                                        });
                                    }}}
                                className={this.props.classes.defaultFormControl}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        </InteractionComponentWrapper>
                    </Grid><
                    Grid item xs={12} sm={6} md={3} lg={3} xl={3} className={this.props.classes.buttonGrid}>
                        <Button
                            onClick={() => {
                                existsAlready ? this.removeTagSetOption(annotation.id, option.id) : this.addTagSetOption(annotation.id)
                            }}
                            fullWidth
                            variant="contained"
                            disabled={!existsAlready && !this.canAddNewTagSetOption(annotation.id)}
                            className={existsAlready ? this.props.classes.deleteOptionButton : this.props.classes.addOptionButton}
                            classes={{disabled: this.props.classes.toggleButtonDisabled}}
                            size="large"
                            color="primary">
                            {existsAlready ? this.props.localize('project.annotations.tagSetOption.remove.button') : this.props.localize('project.annotations.tagSetOption.add.button')}
                        </Button>
                </Grid>
            </Grid>
            </ExpansionPanelDetails>
        </ExpansionPanel>
        </Grid>
    }

    render() {
        console.log(this.props.annotations);
        const existingAnnotationsView = Object.values(this.props.annotations.annotationMap).map(a => {
            return <Grid item xs={12}>
                <ExpansionPanel defaultExpanded={true}  className={this.props.classes.panel}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} className={this.props.classes.panelSummary}>
                        <Typography>{a.id} ({this.props.localize(`project.annotations.type.${a.type}`)})</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={this.props.classes.panelDetails}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}><Typography variant="body2"
                                                           display="block">
                                {this.props.localize(`project.annotations.${a.type}.caption`)}
                            </Typography></Grid>
                            <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                                <InteractionComponentWrapper name={this.props.localize('project.annotations.name.name')}
                                                             caption={this.props.localize('project.annotations.name.caption')}>
                                    <TextField
                                        value={a.name}
                                        onChange={event => {
                                            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["annotations", "annotationMap", a.id, "name"], event.target.value)
                                        }}
                                        className={this.props.classes.defaultFormControl}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </InteractionComponentWrapper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                                <InteractionComponentWrapper name={this.props.localize('project.annotations.shortName.name')}
                                                             caption={this.props.localize('project.annotations.shortName.caption')}>
                                    <TextField
                                        value={a.shortName}
                                        onChange={event => {
                                            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["annotations", "annotationMap", a.id, "shortName"], event.target.value)
                                        }}
                                        className={this.props.classes.defaultFormControl}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </InteractionComponentWrapper>
                            </Grid>
                            {this.renderAnnotationTypeSpecificInputs(a)}
                            <Grid item xs={12} className={this.props.classes.deleteGrid}>
                                <Button
                                    onClick={() => {
                                        this.deleteAnnotation(a.id)
                                    }}
                                    variant="contained"
                                    className={this.props.classes.deleteButton}
                                    size="small">
                                    {this.props.localize('project.annotations.delete.button')}
                                </Button>
                            </Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Grid>
        });
        const addAnnotationView = this.addAnnotationView();
        return <Grid container spacing={4}>
            {
                existingAnnotationsView
            }
            <Grid item xs={12}>
                <ExpansionPanel defaultExpanded={true}  className={this.props.classes.panel}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} className={this.props.classes.panelSummary} >
                        <Typography>{this.props.localize("project.annotations.add.panelTitle")}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={this.props.classes.panelDetails}>
                        <Grid container spacing={4}>
                            {
                                addAnnotationView
                            }
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Grid>
        </Grid>;
    }

}

export default withLocalization(withStyles(style)(AnnotationsStep));
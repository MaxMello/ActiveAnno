// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withLocalization} from "react-localize";
import type {WithLocalizationComponentProps, WithStylesComponentProps} from "../../../types/Types";
import {Grid, OutlinedInput, Typography} from "@material-ui/core";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import {Check, Close} from "@material-ui/icons";
import type {FilterCondition, Sort} from "../../../types/manage/ManageTypes";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import OverflowMenuItem from "../OverflowMenuItem";
import TextField from "@material-ui/core/TextField";
import ChipInput from "material-ui-chip-input";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {isArray} from "../../helper/HelperFunctions";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import {colorButtonClasses} from "../colorButtonClasses";
import {
    ButtonColors,
    disabledFullWidthColorButton,
    fullWidthColorButton,
    selectedFullWidthColorButton
} from "../../../constants/ButtonColors";
import InputWrapper from "../InputWrapper";


type FilterAndSortStepProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    id: string,
    updateProjectValue: Function,
    isNewProject: boolean,
    filter?: FilterCondition,
    sort: Sort
};

type FilterAndSortStepState = {
    filterExpanded: boolean,
    sortExpanded: boolean
}

const style: Function = (theme: Object): Object => ({
    ...theme.buttons,
    buttonGroup: theme.defaultFullWidthButtonGroup,
    defaultFormControl: theme.defaultFormControl,
    chipInput: theme.defaultChipInput,
    primaryDisabledSelectedButton: theme.primaryDisabledSelectedButton
});

const ProjectType = {
    ONE_OFF: "ONE_OFF",
    CONTINUOUS: "CONTINUOUS"
};

const FilterConditionTypes = {
    EQ: "eq",
    NEQ: "neq",
    REGEX: "regex",
    GT: "gt",
    GTE: "gte",
    LT: "lt",
    LTE: "lte",
    EXISTS: "exists",
    IN: "in",
    NIN: "nin",
    ALL: "all",
    SIZE: "size",
    //NOT: "not",
    //OR: "or",
    //AND: "and"
};

const DataTypeOptions = {
    NULL: "NULL",
    STRING: "STRING",
    NUMBER: "NUMBER",
    BOOLEAN: "BOOLEAN",
    LIST_OF_STRING: "LIST_OF_STRING",
    LIST_OF_NUMBER: "LIST_OF_NUMBER"
};

const FilterConditionToDataTypeOptions = {
    [FilterConditionTypes.EQ]: [
        DataTypeOptions.STRING, DataTypeOptions.NUMBER, DataTypeOptions.BOOLEAN, DataTypeOptions.NULL
    ],
    [FilterConditionTypes.NEQ]: [
        DataTypeOptions.STRING, DataTypeOptions.NUMBER, DataTypeOptions.BOOLEAN, DataTypeOptions.NULL
    ],
    [FilterConditionTypes.REGEX]: [
        DataTypeOptions.STRING
    ],
    [FilterConditionTypes.GT]: [
       DataTypeOptions.NUMBER
    ],
    [FilterConditionTypes.GTE]: [
        DataTypeOptions.NUMBER
    ],
    [FilterConditionTypes.LT]: [
        DataTypeOptions.NUMBER
    ],
    [FilterConditionTypes.LTE]: [
        DataTypeOptions.NUMBER
    ],
    [FilterConditionTypes.EXISTS]: [
        DataTypeOptions.BOOLEAN
    ],
    [FilterConditionTypes.IN]: [
        DataTypeOptions.LIST_OF_STRING, DataTypeOptions.LIST_OF_NUMBER
    ],
    [FilterConditionTypes.NIN]: [
        DataTypeOptions.LIST_OF_STRING, DataTypeOptions.LIST_OF_NUMBER
    ],
    [FilterConditionTypes.ALL]: [
        DataTypeOptions.LIST_OF_STRING, DataTypeOptions.LIST_OF_NUMBER
    ],
    [FilterConditionTypes.SIZE]: [
        DataTypeOptions.NUMBER
    ]
};

const SortOrder = {
    ASC: "ASC",
    DESC: "DESC"
};


class FilterAndSortStep extends Component<FilterAndSortStepProps, FilterAndSortStepState> {

    constructor(props) {
        super(props);
        this.state = {
            filterExpanded: true,
            sortExpanded: true
        };
    }

    renderOperator() {
        if(this.props.filter != null) {
            return <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                    <InputWrapper name={this.props.localize('project.filterCondition.operator.name')}
                                                 caption={
                                                     // $FlowIgnore
                                                     <span dangerouslySetInnerHTML={{__html:
                                                        this.props
                                                            .localize('project.filterCondition.operator.caption')}
                                                     }/>
                                                 }
                                                 keyValue={"ICWrenderOperator"}>
                            <FormControl className={this.props.classes.defaultFormControl} variant="outlined" fullWidth>
                                <Select value={this.props.filter?.operator ? this.props.filter.operator : undefined}
                                        onChange={event => {
                                             this.props.updateProjectValue(this.props.isNewProject ? null :
                                                 this.props.id, ["filter", "operator"], event.target.value);
                                             this.props.updateProjectValue(this.props.isNewProject ? null :
                                                 this.props.id, ["filter", "dataType"],
                                                 FilterConditionToDataTypeOptions[event.target.value][0]);
                                             this.props.updateProjectValue(this.props.isNewProject ? null :
                                                 this.props.id, ["filter", "value"], undefined);
                                        }}
                                        input={<OutlinedInput notched={false} labelWidth={50}
                                                              name="operatorInput"/>}>
                                    {
                                        (Object.values(FilterConditionTypes): any).map((t: string) => {
                                            return <OverflowMenuItem value={t} key={`filterConOp${t}`}>
                                                {this.props.localize(`project.filterCondition.type.${t}`)}
                                            </OverflowMenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                    </InputWrapper>
                </Grid>;
        } else {
            return null;
        }
    }

    renderKeyInput() {
        if(this.props.filter != null) {
            return <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                <InputWrapper name={this.props.localize('project.filterCondition.key.name')}
                                             caption={
                                                 // $FlowIgnore
                                                 <span dangerouslySetInnerHTML={{__html:
                                                         this.props
                                                             .localize('project.filterCondition.key.caption')}
                                                 }/>
                                             }
                                             keyValue={"ICWrenderKeyInput"}>
                    <TextField
                        value={this.props.filter?.key ?? ""}
                        onChange={event => {
                            this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
                                ["filter", "key"], event.target.value)
                        }}
                        className={this.props.classes.defaultFormControl}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                </InputWrapper>
            </Grid>;
        } else {
            return null;
        }
    }

    renderDataTypeInput() {
        if(this.props.filter && this.props.filter.operator) {
            const currentVal = (this.props.filter.dataType ? this.props.filter.dataType :
                // $FlowIgnore
                FilterConditionToDataTypeOptions[this.props.filter.operator][0]);
            return <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                <InputWrapper name={this.props.localize('project.filterCondition.dataType.name')}
                                             caption={
                                                 // $FlowIgnore
                                                 <span dangerouslySetInnerHTML={{__html:
                                                         this.props
                                                             .localize('project.filterCondition.dataType.caption')}
                                                 }/>
                                             }
                                             keyValue={"ICWrenderDataTypeInput"}>
                    <FormControl className={this.props.classes.defaultFormControl} variant="outlined" fullWidth>
                        <Select value={ currentVal }
                                onChange={event => {
                                    this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
                                        ["filter", "dataType"], event.target.value);
                                    if(event.target.value === DataTypeOptions.NULL) {
                                        this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
                                            ["filter", "value"], null);
                                    } else {
                                        this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
                                            ["filter", "value"], undefined);
                                    }
                                }}
                                input={<OutlinedInput notched={false} labelWidth={50}
                                                      name="dataTypeInput"/>}>
                            {
                                // $FlowIgnore
                                Object.values(FilterConditionToDataTypeOptions[this.props.filter.operator])
                                    .map((t: any) => {
                                    return <OverflowMenuItem value={t} key={`filterDataType${t}`}>
                                        {this.props.localize(`project.filterCondition.dataType.${t}`)}
                                    </OverflowMenuItem>
                                })
                            }

                        </Select>
                    </FormControl>
                </InputWrapper>
            </Grid>;
        } else {
            return null;
        }
    }

    renderTextValueInput() {
        return <TextField
            value={this.props.filter?.value ?? ""}
            onChange={(e) => {
                this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id, ["filter", "value"],
                    e.target.value)
            }}
            className={this.props.classes.defaultFormControl}
            fullWidth
            margin="normal"
            variant="outlined"
        />
    }

    renderNumberValueInput() {
        return <TextField
            value={this.props.filter?.value ?? ""}
            onChange={(e) => {
                this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id, ["filter", "value"],
                    e.target.value)
            }}
            type="number"
            className={this.props.classes.defaultFormControl}
            fullWidth
            margin="normal"
            variant="outlined"
        />
    }

    renderBooleanValueInput() {
        return <ToggleButtonGroup value={(this.props.filter?.value !== null && this.props.filter?.value !== undefined)
            ? this.props.filter.value : true}
                                  exclusive
                                  className={this.props.classes.buttonGroup}
                                  onChange={(_, newValue) => {
                                      this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
                                          ["filter", "value"], newValue)
                                    }
                                  }>
            <ToggleButton value={true} classes={colorButtonClasses(this.props.classes)}>
                <Check/>
                {this.props.localize('true')}
            </ToggleButton>
            <ToggleButton value={false} classes={colorButtonClasses(this.props.classes)}>
                <Close/>
                {this.props.localize('false')}
            </ToggleButton>
        </ToggleButtonGroup>
    }

    renderNullValueInput() {
        return <TextField
            value={this.props.localize("null")}
            disabled={true}
            className={this.props.classes.defaultFormControl}
            fullWidth
            margin="normal"
            variant="outlined"
        />
    }

    renderListOfNumberValueInput() {
        let currentValues = this.props.filter?.value && isArray(this.props.filter.value) ? this.props.filter.value : [];
        return <MuiThemeProvider><ChipInput
            className={this.props.classes.chipInput}
            value={currentValues}
            onAdd={(chip) => {
                const numberChip = Number(chip);
                if(!Number.isNaN(numberChip)) {
                    currentValues.push(numberChip);
                    this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id, ["filter", "value"],
                        currentValues);
                }
            }}
            onDelete={(chip) => {
                const numberChip = Number(chip);
                if(!Number.isNaN(numberChip)) {
                    currentValues = currentValues.filter(c => c !== numberChip);
                    this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id, ["filter", "value"],
                        currentValues);
                }
            }}
            allowDuplicates={true}
            fullWidth={true}
            newChipKeyCodes={[13, 9]}
        /></MuiThemeProvider>;
    }

    renderListOfStringValueInput() {
        let currentValues = this.props.filter?.value && isArray(this.props.filter.value) ? this.props.filter.value : [];
        return <MuiThemeProvider><ChipInput
            className={this.props.classes.chipInput}
            value={currentValues}
            onAdd={(chip) => {
                currentValues.push(chip);
                this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id, ["filter", "value"],
                    currentValues);
            }}
            onDelete={(chip) => {
                currentValues = currentValues.filter(c => c !== chip);
                this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id, ["filter", "value"],
                    currentValues);
            }}
            allowDuplicates={true}
            fullWidth={true}
            newChipKeyCodes={[13, 9]}
        /></MuiThemeProvider>;
    }

    renderInputBasedOnType() {
        if(this.props.filter?.dataType === DataTypeOptions.STRING) {
            return this.renderTextValueInput()
        } else if(this.props.filter?.dataType === DataTypeOptions.NUMBER) {
            return this.renderNumberValueInput()
        } else if(this.props.filter?.dataType === DataTypeOptions.BOOLEAN) {
            return this.renderBooleanValueInput()
        } else if(this.props.filter?.dataType === DataTypeOptions.NULL) {
            return this.renderNullValueInput()
        } else if(this.props.filter?.dataType === DataTypeOptions.LIST_OF_NUMBER) {
            return this.renderListOfNumberValueInput()
        } else if(this.props.filter?.dataType === DataTypeOptions.LIST_OF_STRING) {
            return this.renderListOfStringValueInput()
        } else {
            return null;
        }
    }

    renderValueInput() {
        if(this.props.filter && this.props.filter.operator && this.props.filter.dataType) {
            return <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                <InputWrapper name={this.props.localize('project.filterCondition.value.name')}
                                             caption={this.props.localize('project.filterCondition.value.caption')}
                                             keyValue={"ICWrenderValueInput"}>
                    {
                        this.renderInputBasedOnType()
                    }
                </InputWrapper>
            </Grid>;
        } else {
            return null;
        }
    }

    renderFilterCondition() {
        if(this.props.filter) {
            return <ExpansionPanel defaultExpanded={true}  className={this.props.classes.panel}
                                   onChange={(_, expanded) => {
                this.setState({
                    sortExpanded: this.state.sortExpanded,
                    filterExpanded: expanded
                })
            }}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} className={this.props.classes.panelSummary} >
                    <Typography>{this.props.localize("project.filterCondition.panelTitle")}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={this.props.classes.panelDetails}>
                    <Grid container spacing={4}>
                        {this.renderOperator()}
                        {this.renderKeyInput()}
                        {this.renderDataTypeInput()}
                        {this.renderValueInput()}
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        } else {
            return null;
        }
    }
    
    renderSort() {
        return <ExpansionPanel defaultExpanded={true}  className={this.props.classes.panel}
                               onChange={(_, expanded) => {
            this.setState({
                filterExpanded: this.state.filterExpanded,
                sortExpanded: expanded
            })
        }}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} className={this.props.classes.panelSummary} >
                <Typography>{this.props.localize("project.sort.panelTitle")}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={this.props.classes.panelDetails}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <InputWrapper name={this.props.localize('project.sort.key.name')}
                                                     caption={this.props.localize('project.sort.key.caption')}
                                                     keyValue={"ICWrenderSort1"}>
                        <TextField
                            value={this.props.sort.sorts[0] ? this.props.sort.sorts[0].key : undefined}
                            onChange={(e) => {
                                const currentFirstSort = this.props.sort.sorts[0] ? this.props.sort.sorts[0] : {};
                                currentFirstSort.key = e.target.value;
                                this.props.updateProjectValue(this.props.isNewProject ? null : this.props.id,
                                    ["sort", "sorts"], [currentFirstSort])
                            }}
                            className={this.props.classes.defaultFormControl}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        </InputWrapper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <InputWrapper name={this.props.localize('project.sort.order.name')}
                                                     caption={this.props.localize('project.sort.order.caption')}
                                                     keyValue={"ICWrenderSort2"}>
                        <ToggleButtonGroup value={this.props.sort.sorts[0] ? this.props.sort.sorts[0].order : undefined}
                                           exclusive
                                           className={this.props.classes.buttonGroup}
                                           onChange={(_, newValue) => {
                                               const currentFirstSort = this.props.sort.sorts[0] ?
                                                   this.props.sort.sorts[0] : {};
                                               currentFirstSort.order = newValue;
                                               this.props.updateProjectValue(this.props.isNewProject ? null :
                                                   this.props.id, ["sort", "sorts"], [currentFirstSort]);
                                           }
                                           }>
                            <ToggleButton value={SortOrder.ASC} classes={colorButtonClasses(this.props.classes)}>
                                {this.props.localize('project.sort.asc')}
                            </ToggleButton>
                            <ToggleButton value={SortOrder.DESC} classes={colorButtonClasses(this.props.classes)}>
                                {this.props.localize('project.sort.desc')}
                            </ToggleButton>
                        </ToggleButtonGroup>
                        </InputWrapper>
                    </Grid>
                </Grid>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    }

    render() {
        return <Grid container spacing={4}>
            <Grid item xs={12}>
                <InputWrapper name={this.props.localize('project.projectType.name')}
                                             caption={this.props.localize('project.projectType.caption')}
                                             keyValue={"projectActive"}>
                    <ToggleButtonGroup value={this.props.filter == null ? ProjectType.ONE_OFF : ProjectType.CONTINUOUS}
                                       exclusive
                                       className={this.props.classes.buttonGroup}
                                       onChange={(_, newValue) => {
                                           if(newValue === ProjectType.CONTINUOUS) {
                                               this.props.updateProjectValue(this.props.isNewProject ? null :
                                                   this.props.id, ["filter"], {})
                                           } else {
                                               this.props.updateProjectValue(this.props.isNewProject ? null :
                                                   this.props.id, ["filter"], null)
                                           }
                                       }
                                       }>
                        <ToggleButton value={ProjectType.ONE_OFF} classes={{
                            root: this.props.classes[fullWidthColorButton(ButtonColors.PRIMARY)],
                            selected: this.props.classes[selectedFullWidthColorButton(ButtonColors.PRIMARY)],
                            disabled: this.props.filter == null ?
                                this.props.classes[selectedFullWidthColorButton(ButtonColors.PRIMARY)] :
                                this.props.classes[disabledFullWidthColorButton(ButtonColors.PRIMARY)]
                        }}
                                      disabled={!this.props.isNewProject}>
                            {this.props.localize('project.projectType.oneOff')}
                        </ToggleButton>
                        <ToggleButton value={ProjectType.CONTINUOUS} classes={{
                            root: this.props.classes[fullWidthColorButton(ButtonColors.PRIMARY)],
                            selected: this.props.classes[selectedFullWidthColorButton(ButtonColors.PRIMARY)],
                            disabled: this.props.filter != null ?
                                this.props.classes[selectedFullWidthColorButton(ButtonColors.PRIMARY)] :
                                this.props.classes[disabledFullWidthColorButton(ButtonColors.PRIMARY)]
                        }} disabled={!this.props.isNewProject}>
                            {this.props.localize('project.projectType.continuous')}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </InputWrapper>
            </Grid>
            <Grid item xs={12}>
                {this.renderFilterCondition()}
            </Grid>
            <Grid item xs={12}>
             {this.renderSort()}
            </Grid>
        </Grid>;
    }
}

export default withLocalization(withStyles(style)(FilterAndSortStep));
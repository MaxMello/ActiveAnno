// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withLocalization} from "react-localize";
import type {WithLocalizationComponentProps, WithStylesComponentProps} from "../../types/Types";
import {Grid, OutlinedInput} from "@material-ui/core";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import {Check, Close} from "@material-ui/icons";
import type {FilterCondition} from "../../types/manage/ManageTypes";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import OverflowMenuItem from "./OverflowMenuItem";
import TextField from "@material-ui/core/TextField";
import ChipInput from "material-ui-chip-input";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {isArray} from "../helper/HelperFunctions";
import {colorButtonClasses} from "./colorButtonClasses";
import InputWrapper from "./InputWrapper";


type FilterConditionInputProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    filter?: FilterCondition,
    updateFilter: Function
};

type FilterConditionInputState = {
    filterExpanded: boolean
}

const style: Function = (theme: Object): Object => ({
    ...theme.buttons,
    buttonGroup: theme.defaultFullWidthButtonGroup,
    defaultFormControl: theme.defaultFormControl,
    chipInput: theme.defaultChipInput,
    primaryDisabledSelectedButton: theme.primaryDisabledSelectedButton
});

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

/**
 * Standalone Filter Condition input
 */
class FilterConditionInput extends Component<FilterConditionInputProps, FilterConditionInputState> {

    constructor(props) {
        super(props);
        this.state = {
            filterExpanded: true
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
                                             keyValue={"InputWrapperRenderOperator"} disabled={false}>
                    <FormControl className={this.props.classes.defaultFormControl} variant="outlined" fullWidth>
                        <Select value={this.props.filter?.operator ? this.props.filter.operator : undefined}
                                onChange={event => {
                                    this.props.updateFilter({
                                        ...this.props.filter,
                                        operator: event.target.value,
                                        dataType: FilterConditionToDataTypeOptions[event.target.value][0],
                                        value: undefined
                                    })
                                }}
                                input={<OutlinedInput notched={false} labelWidth={50}
                                                      name="operatorInput"/>}>
                            {
                                Object.values(FilterConditionTypes).map((t: any) => {
                                    return <OverflowMenuItem value={t}>
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
                                             disabled={false}
                                             keyValue={"InputWrapperRenderKey"}
                >
                    <TextField
                        value={this.props.filter?.key ?? ""}
                        onChange={event => {
                            this.props.updateFilter({
                                ...this.props.filter,
                                key: event.target.value
                            });
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
                                             disabled={false}
                                             keyValue={"InputWrapperRenderDataType"}
                >
                    <FormControl className={this.props.classes.defaultFormControl} variant="outlined" fullWidth>
                        <Select value={ currentVal }
                                onChange={event => {
                                    this.props.updateFilter({
                                        ...this.props.filter,
                                        dataType: event.target.value,
                                        value: event.target.value === DataTypeOptions.NULL ? null : undefined
                                    });
                                }}
                                input={<OutlinedInput notched={false} labelWidth={50}
                                                      name="dataTypeInput"/>}>
                            {
                                // $FlowIgnore
                                Object.values(FilterConditionToDataTypeOptions[this.props.filter.operator])
                                    .map((t: any) => {
                                        return <OverflowMenuItem value={t}>
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
                this.props.updateFilter({
                    ...this.props.filter,
                    value: e.target.value
                })
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
                this.props.updateFilter({
                    ...this.props.filter,
                    value: e.target.value
                })
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
                                      this.props.updateFilter({
                                          ...this.props.filter,
                                          value: newValue
                                      })
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
                    this.props.updateFilter({
                        ...this.props.filter,
                        value: currentValues
                    })
                }
            }}
            onDelete={(chip) => {
                const numberChip = Number(chip);
                if(!Number.isNaN(numberChip)) {
                    currentValues = currentValues.filter(c => c !== numberChip);
                    this.props.updateFilter({
                        ...this.props.filter,
                        value: currentValues
                    })
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
                this.props.updateFilter({
                    ...this.props.filter,
                    value: currentValues
                })
            }}
            onDelete={(chip) => {
                currentValues = currentValues.filter(c => c !== chip);
                this.props.updateFilter({
                    ...this.props.filter,
                    value: currentValues
                })
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
                                             disabled={false}
                                             keyValue={"InputWrapperRenderValue"}
                >
                    {
                        this.renderInputBasedOnType()
                    }
                </InputWrapper>
            </Grid>;
        } else {
            return null;
        }
    }

    render() {
        if(this.props.filter) {
            return <Grid container spacing={2}>
                    {this.renderOperator()}
                    {this.renderKeyInput()}
                    {this.renderDataTypeInput()}
                    {this.renderValueInput()}
                </Grid>
        } else {
            return null;
        }
    }
}

export default withLocalization(withStyles(style)(FilterConditionInput));
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
import color from 'color';
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import {Check, Close} from "@material-ui/icons";
import type {FilterCondition, Sort} from "../../../types/ManageTypes";
import {grey} from "@material-ui/core/colors";
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


type FilterAndSortStepProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    id: string,
    updateConfigValue: Function,
    isNewConfig: boolean,
    filter?: FilterCondition,
    sort: Sort
};

const style: Function = (theme: Object): Object => ({
    buttonGroup: {
        display: 'flex',
        flexWrap: 'nowrap',
        userSelect: 'none',
        backgroundColor: 'transparent',
        [theme.breakpoints.down('xs')]: {
            flexWrap: 'wrap',
        },
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    toggleButton: {
        color: `${theme.palette.secondary.main} !important`,
        backgroundColor: grey[100],
        border: '0 !important',
        paddingTop: theme.spacing(0.75),
        paddingBottom: theme.spacing(0.75),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        flowGrow: 1,
        margin: theme.spacing(0.5),
        '&:hover': {
            backgroundColor: grey[200],
            marginLeft: '4px !important',
            marginRight: '4px !important'
        },
        '&:not(:first-child)': {
            marginLeft: '4px !important',
            marginRight: '4px !important'
        },
        width: '100% !important'
    },
    toggleButtonSelected: {
        color: `${theme.palette.secondary.main} !important`,
        backgroundColor: `${color(theme.palette.secondary.light).lighten(0.95).hex()} !important`
    },
    defaultFormControl: theme.defaultFormControl,
    interactionCaption: theme.interactionCaption,
    chipInput: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1)
    },
    interactionHeader: theme.interactionHeader
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


class FilterAndSortStep extends Component<FilterAndSortStepProps> {

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
                    <InteractionComponentWrapper name={this.props.localize('project.filterCondition.operator.name')}
                                                 caption={
                                                     <span dangerouslySetInnerHTML={{__html: this.props.localize('project.filterCondition.operator.caption')}}/>
                                                 }>
                            <FormControl className={this.props.classes.defaultFormControl} variant="outlined" fullWidth>
                                <Select value={this.props.filter.operator ? this.props.filter.operator : undefined}
                                        onChange={event => {
                                             this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["filter", "operator"], event.target.value);
                                             this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["filter", "dataType"], FilterConditionToDataTypeOptions[event.target.value][0]);
                                             this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["filter", "value"], undefined);
                                        }}
                                        input={<OutlinedInput notched={false} labelWidth={50}
                                                              name="operatorInput"/>}>
                                    {
                                        Object.values(FilterConditionTypes).map(t => {
                                            return <OverflowMenuItem value={t}>
                                                {this.props.localize(`project.filterCondition.type.${t}`)}
                                            </OverflowMenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                    </InteractionComponentWrapper>
                </Grid>;
        } else {
            return null;
        }
    }

    renderKeyInput() {
        if(this.props.filter != null) {
            return <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                <InteractionComponentWrapper name={this.props.localize('project.filterCondition.key.name')}
                                             caption={
                                                 <span dangerouslySetInnerHTML={{__html: this.props.localize('project.filterCondition.key.caption')}}/>
                                             }>
                    <TextField
                        value={this.props.filter.key ? this.props.filter.key : ""}
                        onChange={event => {
                            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["filter", "key"], event.target.value)
                        }}
                        className={this.props.classes.defaultFormControl}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                </InteractionComponentWrapper>
            </Grid>;
        } else {
            return null;
        }
    }

    renderDataTypeInput() {
        if(this.props.filter && this.props.filter.operator) {
            const currentVal = this.props.filter.dataType ? this.props.filter.dataType : FilterConditionToDataTypeOptions[this.props.filter.operator][0];
            return <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                <InteractionComponentWrapper name={this.props.localize('project.filterCondition.dataType.name')}
                                             caption={
                                                 <span dangerouslySetInnerHTML={{__html: this.props.localize('project.filterCondition.dataType.caption')}}/>
                                             }>
                    <FormControl className={this.props.classes.defaultFormControl} variant="outlined" fullWidth>
                        <Select value={ currentVal }
                                onChange={event => {
                                    this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["filter", "dataType"], event.target.value);
                                    if(event.target.value === DataTypeOptions.NULL) {
                                        this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["filter", "value"], null);
                                    } else {
                                        this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["filter", "value"], undefined);
                                    }
                                }}
                                input={<OutlinedInput notched={false} labelWidth={50}
                                                      name="dataTypeInput"/>}>
                            {
                                Object.values(FilterConditionToDataTypeOptions[this.props.filter.operator]).map(t => {
                                    return <OverflowMenuItem value={t}>
                                        {this.props.localize(`project.filterCondition.dataType.${t}`)}
                                    </OverflowMenuItem>
                                })
                            }

                        </Select>
                    </FormControl>
                </InteractionComponentWrapper>
            </Grid>;
        } else {
            return null;
        }
    }

    renderTextValueInput() {
        return <TextField
            value={this.props.filter.value ? this.props.filter.value : ""}
            onChange={(e) => {
                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["filter", "value"], e.target.value)
            }}
            className={this.props.classes.defaultFormControl}
            fullWidth
            margin="normal"
            variant="outlined"
        />
    }

    renderNumberValueInput() {
        return <TextField
            value={this.props.filter.value ? this.props.filter.value : ""}
            onChange={(e) => {
                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["filter", "value"], e.target.value)
            }}
            type="number"
            className={this.props.classes.defaultFormControl}
            fullWidth
            margin="normal"
            variant="outlined"
        />
    }

    renderBooleanValueInput() {
        return <ToggleButtonGroup value={(this.props.filter.value !== null && this.props.filter.value !== undefined) ? this.props.filter.value : true}
                                  exclusive
                                  className={this.props.classes.buttonGroup}
                                  onChange={(_, newValue) => {
                                      this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["filter", "value"], newValue)
                                    }
                                  }>
            <ToggleButton value={true} className={this.props.classes.toggleButton} fullWidth
                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                <Check/>
                {this.props.localize('true')}
            </ToggleButton>
            <ToggleButton value={false} className={this.props.classes.toggleButton} fullWidth
                          classes={{selected: this.props.classes.toggleButtonSelected}}>
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
        let currentValues = this.props.filter.value && isArray(this.props.filter.value) ? this.props.filter.value : [];
        return <MuiThemeProvider><ChipInput
            className={this.props.classes.chipInput}
            value={currentValues}
            onAdd={(chip) => {
                chip = Number(chip);
                if(!Number.isNaN(chip)) {
                    currentValues.push(chip);
                    this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["filter", "value"], currentValues);
                }
            }}
            onDelete={(chip) => {
                chip = Number(chip);
                if(!Number.isNaN(chip)) {
                    currentValues = currentValues.filter(c => c !== chip);
                    this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["filter", "value"], currentValues);
                }
            }}
            allowDuplicates={true}
            fullWidth={true}
            newChipKeyCodes={[13, 9]}
        /></MuiThemeProvider>;
    }

    renderListOfStringValueInput() {
        let currentValues = this.props.filter.value && isArray(this.props.filter.value) ? this.props.filter.value : [];
        return <MuiThemeProvider><ChipInput
            className={this.props.classes.chipInput}
            value={currentValues}
            onAdd={(chip) => {
                currentValues.push(chip);
                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["filter", "value"], currentValues);
            }}
            onDelete={(chip) => {
                currentValues = currentValues.filter(c => c !== chip);
                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["filter", "value"], currentValues);
            }}
            allowDuplicates={true}
            fullWidth={true}
            newChipKeyCodes={[13, 9]}
        /></MuiThemeProvider>;
    }

    renderInputBasedOnType() {
        if(this.props.filter.dataType === DataTypeOptions.STRING) {
            return this.renderTextValueInput()
        } else if(this.props.filter.dataType === DataTypeOptions.NUMBER) {
            return this.renderNumberValueInput()
        } else if(this.props.filter.dataType === DataTypeOptions.BOOLEAN) {
            return this.renderBooleanValueInput()
        } else if(this.props.filter.dataType === DataTypeOptions.NULL) {
            return this.renderNullValueInput()
        } else if(this.props.filter.dataType === DataTypeOptions.LIST_OF_NUMBER) {
            return this.renderListOfNumberValueInput()
        } else if(this.props.filter.dataType === DataTypeOptions.LIST_OF_STRING) {
            return this.renderListOfStringValueInput()
        } else {
            return null;
        }
    }

    renderValueInput() {
        if(this.props.filter && this.props.filter.operator && this.props.filter.dataType) {
            return <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                <InteractionComponentWrapper name={this.props.localize('project.filterCondition.value.name')}
                                             caption={this.props.localize('project.filterCondition.value.caption')}>
                    {
                        this.renderInputBasedOnType()
                    }
                </InteractionComponentWrapper>
            </Grid>;
        } else {
            return null;
        }
    }

    renderFilterCondition() {
        if(this.props.filter) {
            return <ExpansionPanel defaultExpanded={true}  className={this.props.classes.panel} onChange={(_, expanded) => {
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
        return <ExpansionPanel defaultExpanded={true}  className={this.props.classes.panel} onChange={(_, expanded) => {
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
                        <InteractionComponentWrapper name={this.props.localize('project.sort.key.name')}
                                                     caption={this.props.localize('project.sort.key.caption')}>
                        <TextField
                            value={this.props.sort.sorts[0] ? this.props.sort.sorts[0].key : undefined}
                            onChange={(e) => {
                                const currentFirstSort = this.props.sort.sorts[0] ? this.props.sort.sorts[0] : {};
                                currentFirstSort.key = e.target.value;
                                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["sort", "sorts"], [currentFirstSort])
                            }}
                            className={this.props.classes.defaultFormControl}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        </InteractionComponentWrapper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <InteractionComponentWrapper name={this.props.localize('project.sort.order.name')}
                                                     caption={this.props.localize('project.sort.order.caption')}>
                        <ToggleButtonGroup value={this.props.sort.sorts[0] ? this.props.sort.sorts[0].order : undefined}
                                           exclusive
                                           className={this.props.classes.buttonGroup}
                                           onChange={(_, newValue) => {
                                               const currentFirstSort = this.props.sort.sorts[0] ? this.props.sort.sorts[0] : {};
                                               currentFirstSort.order = newValue;
                                               this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["sort", "sorts"], [currentFirstSort]);
                                           }
                                           }>
                            <ToggleButton value={SortOrder.ASC} className={this.props.classes.toggleButton} fullWidth
                                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                                {this.props.localize('project.sort.asc')}
                            </ToggleButton>
                            <ToggleButton value={SortOrder.DESC} className={this.props.classes.toggleButton} fullWidth
                                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                                {this.props.localize('project.sort.desc')}
                            </ToggleButton>
                        </ToggleButtonGroup>
                        </InteractionComponentWrapper>
                    </Grid>
                </Grid>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    }

    render() {
        return <Grid container spacing={4}>
            <Grid item xs={12}>
                <InteractionComponentWrapper name={this.props.localize('project.projectType.name')}
                                             caption={this.props.localize('project.projectType.caption')}
                                             validationErrors={""}
                                             keyValue={"projectConfigActive"}>
                    <ToggleButtonGroup value={this.props.filter == null ? ProjectType.ONE_OFF : ProjectType.CONTINUOUS}
                                       exclusive
                                       className={this.props.classes.buttonGroup}
                                       onChange={(_, newValue) => {
                                           if(newValue === ProjectType.CONTINUOUS) {
                                               this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["filter"], {})
                                           } else {
                                               this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["filter"], null)
                                           }
                                       }
                                       }>
                        <ToggleButton value={ProjectType.ONE_OFF} className={this.props.classes.toggleButton}
                                      disabled={!this.props.isNewConfig}
                                      classes={{selected: this.props.classes.toggleButtonSelected}}>
                            {this.props.localize('project.projectType.oneOff')}
                        </ToggleButton>
                        <ToggleButton value={ProjectType.CONTINUOUS} className={this.props.classes.toggleButton}
                                      disabled={!this.props.isNewConfig}
                                      classes={{selected: this.props.classes.toggleButtonSelected}}>
                            {this.props.localize('project.projectType.continuous')}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </InteractionComponentWrapper>
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
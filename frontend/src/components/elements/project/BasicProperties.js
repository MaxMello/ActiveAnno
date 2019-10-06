// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withLocalization} from "react-localize";
import type {
    Dictionary,
    userIdentifier,
    WithLocalizationComponentProps,
    WithStylesComponentProps
} from "../../../types/Types";
import type {Policy, UserRoles} from "../../../types/ManageTypes";
import {Grid, OutlinedInput, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import {Check, Close} from "@material-ui/icons";
import {FinalizeAnnotationPolicy} from '../../../constants/ProjectConfig';
import InteractionComponentWrapper from "../interaction/InteractionComponentWrapper";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import OverflowMenuItem from "../OverflowMenuItem";
import FormControl from "@material-ui/core/FormControl";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChipInput from "material-ui-chip-input";
import type {UserInfo} from "../../../types/PageSetupTypes";


type BasicPropertiesProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    id: string,
    name: string,
    description: string,
    priority: number,
    active: boolean,
    userRoles: UserRoles,
    policy: Policy,
    updateConfigValue: Function,
    isNewConfig: boolean,
    userInfo: Dictionary<userIdentifier, UserInfo>,
    userIdentifier: string
};

const style: Function = (theme: Object): Object => ({
    buttonGroup: theme.defaultFullWidthButtonGroup,
    toggleButton: theme.defaultFullWidthToggleButton,
    toggleButtonSelected: theme.defaultToggleButtonSelected, 
    defaultFormControl: theme.defaultFormControl,
    dropDown: theme.defaultDropDown,
    chipInput: theme.defaultChipInput,
    buttonLabel: {
        padding: theme.spacing(1),
        userSelect: 'none'
    },
    label: {
        transform: "translate(13px, 13px) scale(1)"
    },
    panelDetails: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column'
    },
    finalizeAnnotationPolicyDescription: {
        marginBottom: theme.spacing(1)
    },
    finalizeAnnotationPolicyDescriptionTitle: {
        fontWeight: '600'
    },
    expansionPanel: {
        marginTop: theme.spacing(1)
    },
});

class BasicProperties extends Component<BasicPropertiesProps> {

    componentDidMount() {
        if(this.props.isNewConfig && this.props.userRoles.managers.length === 0) {
            this.props.updateConfigValue(null, ["userRoles", "managers"], [this.props.userIdentifier]);
        }
    }

    render() {
        return <Grid container spacing={4}>
                <Grid item xs={12} sm={12} md={6}>
                    <InteractionComponentWrapper name={this.props.localize('project.id.name')}
                                                 caption={this.props.localize('project.id.caption')}
                                                 validationErrors={""}
                                                 keyValue={"projectConfigID"}>
                        <TextField
                            value={this.props.id}
                            onChange={(e) => {
                                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["id"], e.target.value)
                            }}
                            className={this.props.classes.defaultFormControl}
                            disabled={!this.props.isNewConfig}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                    </InteractionComponentWrapper>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <InteractionComponentWrapper name={this.props.localize('project.name.name')}
                                                 caption={this.props.localize('project.name.caption')}
                                                 validationErrors={""}
                                                 keyValue={"projectConfigName"}>
                        <TextField
                            value={this.props.name}
                            onChange={(e) => {
                                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["name"], e.target.value)
                            }}
                            className={this.props.classes.defaultFormControl}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                    </InteractionComponentWrapper>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <InteractionComponentWrapper name={this.props.localize('project.description.name')}
                                                 caption={this.props.localize('project.description.caption')}
                                                 validationErrors={""}
                                                 keyValue={"projectConfigDescription"}>
                        <TextField
                            multiline
                            value={this.props.description}
                            onChange={(e) => {
                                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["description"], e.target.value)
                            }}
                            className={this.props.classes.defaultFormControl}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                    </InteractionComponentWrapper>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <InteractionComponentWrapper name={this.props.localize('project.priority.name')}
                                                 caption={this.props.localize('project.priority.caption')}
                                                 validationErrors={""}
                                                 keyValue={"projectConfigPriority"}>
                        <FormControl className={this.props.classes.dropDown} variant="outlined">
                            <Select value={this.props.priority}
                                    onChange={e => this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["priority"], e.target.value)}
                                    input={<OutlinedInput notched={false} labelWidth={50} name="priority"
                                                          classes={{input: this.props.classes.input}}/>}>
                                <OverflowMenuItem value={100}>
                                        {this.props.localize('project.priority.veryHigh')}
                                </OverflowMenuItem>
                                <OverflowMenuItem value={50}>
                                    {this.props.localize('project.priority.high')}
                                </OverflowMenuItem>
                                <OverflowMenuItem value={0}>
                                    {this.props.localize('project.priority.medium')}
                                </OverflowMenuItem>
                                <OverflowMenuItem value={-50}>
                                    {this.props.localize('project.priority.low')}
                                </OverflowMenuItem>
                                <OverflowMenuItem value={-100}>
                                    {this.props.localize('project.priority.veryLow')}
                                </OverflowMenuItem>
                            </Select>
                        </FormControl>
                    </InteractionComponentWrapper>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <InteractionComponentWrapper name={this.props.localize('project.active.name')}
                                                 caption={this.props.localize('project.active.caption')}
                                                 validationErrors={""}
                                                 keyValue={"projectConfigActive"}>
                        <ToggleButtonGroup value={!!this.props.active}
                                           exclusive
                                           className={this.props.classes.buttonGroup}
                                           onChange={(_, newValue) => {
                                               if(newValue !== undefined && newValue !== null) {
                                                   this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["active"], newValue)
                                               }
                                              }
                                           }>
                            <ToggleButton value={true} className={this.props.classes.toggleButton}
                                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                                <Check/>
                                {this.props.localize('yes')}
                            </ToggleButton>
                            <ToggleButton value={false} className={this.props.classes.toggleButton}
                                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                                <Close/>
                                {this.props.localize('no')}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </InteractionComponentWrapper>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
                    <InteractionComponentWrapper name={this.props.localize('project.managers.name')}
                                                 caption={this.props.localize('project.managers.caption')}
                                                 validationErrors={""}
                                                 keyValue={"projectConfigManagers"}>
                        <MuiThemeProvider><ChipInput
                            className={this.props.classes.chipInput}
                            value={this.props.userRoles ? this.props.userRoles.managers : []}
                            onAdd={(e) => {
                                let currentValues = [...[], ...this.props.userRoles.managers];
                                currentValues.push(e);
                                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["userRoles", "managers"], currentValues);
                            }}
                            onDelete={(e) => {
                                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["userRoles", "managers"], this.props.userRoles.managers.filter(m => m !== e));
                            }}
                            allowDuplicates={false}
                            dataSource={Object.keys(this.props.userInfo)}
                            fullWidth={true}
                            newChipKeyCodes={[13, 9]}
                        /></MuiThemeProvider>
                    </InteractionComponentWrapper>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
                    <InteractionComponentWrapper name={this.props.localize('project.annotators.name')}
                                                 caption={this.props.localize('project.annotators.caption')}
                                                 validationErrors={""}
                                                 keyValue={"projectConfigAnnotators"}>
                        <MuiThemeProvider><ChipInput
                            className={this.props.classes.chipInput}
                            value={this.props.userRoles.annotators}
                            onAdd={(e) => {
                                let currentValues = [...[], ...this.props.userRoles.annotators];
                                currentValues.push(e);
                                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["userRoles", "annotators"], currentValues);
                            }}
                            onDelete={(e) => {
                                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["userRoles", "annotators"], this.props.userRoles.annotators.filter(m => m !== e));
                            }}
                            allowDuplicates={false}
                            dataSource={Object.keys(this.props.userInfo)}
                            fullWidth={true}
                            newChipKeyCodes={[13, 9]}
                        /></MuiThemeProvider>
                    </InteractionComponentWrapper>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
                    <InteractionComponentWrapper name={this.props.localize('project.curators.name')}
                                                 caption={this.props.localize('project.curators.caption')}
                                                 validationErrors={""}
                                                 keyValue={"projectConfigCurators"}>
                        <MuiThemeProvider><ChipInput
                            className={this.props.classes.chipInput}
                            value={this.props.userRoles ? this.props.userRoles.curators : []}
                            onAdd={(e) => {
                                let currentValues = [...[], ...this.props.userRoles.curators];
                                currentValues.push(e);
                                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["userRoles", "curators"], currentValues);
                            }}
                            onDelete={(e) => {
                                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["userRoles", "curators"], this.props.userRoles.curators.filter(m => m !== e));
                            }}
                            allowDuplicates={false}
                            dataSource={Object.keys(this.props.userInfo)}
                            fullWidth={true}
                            newChipKeyCodes={[13, 9]}
                        /></MuiThemeProvider>
                    </InteractionComponentWrapper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InteractionComponentWrapper name={this.props.localize('project.numberOfAnnotatorsPerDocument.name')}
                                                 caption={this.props.localize('project.numberOfAnnotatorsPerDocument.caption')}
                                                 validationErrors={""}
                                                 keyValue={"projectConfigNumberOfAnnotatorsPerDocument"}>
                        <FormControl className={this.props.classes.dropDown} variant="outlined">
                            <Select value={this.props.policy.numberOfAnnotatorsPerDocument ? this.props.policy.numberOfAnnotatorsPerDocument : undefined }
                                    onChange={e => this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["policy", "numberOfAnnotatorsPerDocument"], e.target.value)}
                                    input={<OutlinedInput notched={false} labelWidth={50} name="numberOfAnnotatorsPerDocument"
                                                          classes={{input: this.props.classes.input}}/>}>
                                {
                                    this.props.userRoles && this.props.userRoles.annotators ? this.props.userRoles.annotators.map((_, index) => {
                                        return <OverflowMenuItem value={index + 1}>
                                            {index + 1}
                                        </OverflowMenuItem>
                                    }) : null
                                }
                            </Select>
                        </FormControl>
                    </InteractionComponentWrapper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InteractionComponentWrapper name={this.props.localize('project.allowManualEscalationToCurator.name')}
                                                 caption={this.props.localize('project.allowManualEscalationToCurator.caption')}
                                                 validationErrors={""}
                                                 keyValue={"projectConfigAllowManualEscalationToCurator"}>
                        <ToggleButtonGroup value={this.props.policy ? !!this.props.policy.allowManualEscalationToCurator : undefined}
                                           exclusive
                                           className={this.props.classes.buttonGroup}
                                           onChange={(_, newValue) => {
                                               this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["policy", "allowManualEscalationToCurator"], newValue)
                                            }
                                           }>
                            <ToggleButton value={true} className={this.props.classes.toggleButton}
                                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                                <Check/>
                                {this.props.localize('yes')}
                            </ToggleButton>
                            <ToggleButton value={false} className={this.props.classes.toggleButton}
                                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                                <Close/>
                                {this.props.localize('no')}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </InteractionComponentWrapper>
                </Grid>
                <Grid item xs={12}>
                    <InteractionComponentWrapper name={this.props.localize('project.finalizeAnnotationPolicy.name')}
                                                 caption={this.props.localize('project.finalizeAnnotationPolicy.caption')}
                                                 validationErrors={""}
                                                 keyValue={"projectConfigFinalizeAnnotationPolicy"}>
                        <FormControl className={this.props.classes.dropDown} variant="outlined">
                            <Select value={this.props.policy.finalizeAnnotationPolicy ? this.props.policy.finalizeAnnotationPolicy : undefined}
                                    onChange={e => this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["policy", "finalizeAnnotationPolicy"], e.target.value)}
                                    input={<OutlinedInput notched={false} labelWidth={50} name="finalizeAnnotationPolicy"
                                                          classes={{input: this.props.classes.input}}/>}>
                                {
                                    FinalizeAnnotationPolicy.map(p => {
                                        return <OverflowMenuItem value={p}>
                                            {this.props.localize(`project.finalizeAnnotationPolicy.${p}`)}
                                        </OverflowMenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <ExpansionPanel defaultExpanded={false} className={this.props.classes.expansionPanel}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography variant="body1">{this.props.localize('project.finalizeAnnotationPolicy.additionalInfo')}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={this.props.classes.panelDetails}>
                                {
                                    FinalizeAnnotationPolicy.map(p => {
                                        return <Box  className={this.props.classes.finalizeAnnotationPolicyDescription}>
                                            <Typography variant={"body2"} className={this.props.classes.finalizeAnnotationPolicyDescriptionTitle}>
                                                {this.props.localize(`project.finalizeAnnotationPolicy.${p}`) + ': '}
                                            </Typography>
                                            <Typography variant={"body2"}>
                                                {this.props.localize(`project.finalizeAnnotationPolicy.${p}.details`)}
                                            </Typography>
                                        </Box>
                                    })
                                }
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </InteractionComponentWrapper>
                </Grid>
            </Grid>
    }
}

export default withLocalization(withStyles(style)(BasicProperties));
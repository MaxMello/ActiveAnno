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
import type {Export} from "../../../types/ManageTypes";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import {
    OnOverwrittenFinalizedAnnotationBehavior,
    OnWebHookFailureBehavior,
    RestAuthentication, WebHookAuthentication
} from "../../../redux/manage";
import {grey} from "@material-ui/core/colors";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import TextField from "@material-ui/core/TextField";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import Select from "@material-ui/core/Select";
import OverflowMenuItem from "../OverflowMenuItem";
import FormControl from "@material-ui/core/FormControl";
import {Web} from "@material-ui/icons";


type AnnotationsStepProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    id: string,
    updateConfigValue: Function,
    isNewConfig: boolean,
    export: Export
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
});

class ExportStep extends Component<AnnotationsStepProps> {

    constructor(props) {
        super(props);
        this.state = {
            restExpanded: true,
            webHookExpanded: true
        };
    }

    renderRest() {
        return <ExpansionPanel defaultExpanded={true}  className={this.props.classes.panel} onChange={(_, expanded) => {
            this.setState({
                restExpanded: expanded,
                webHookExpanded: this.state.webHookExpanded
            })
        }}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} className={this.props.classes.panelSummary} >
                <Typography>{this.props.localize("project.export.rest.panelTitle")}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={this.props.classes.panelDetails}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <InteractionComponentWrapper name={this.props.localize('project.export.rest.enabled.name')}
                                                     caption={
                                                         <span dangerouslySetInnerHTML={{__html: this.props.localize('project.export.rest.enabled.caption')}}/>
                                                     }>
                            <ToggleButtonGroup value={this.props.export.rest != null}
                                               exclusive
                                               className={this.props.classes.buttonGroup}
                                               onChange={(_, newValue) => {
                                                   if(newValue === true) {
                                                       this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "rest"], {
                                                           exportFormat: {
                                                               includeOriginalDocument: true,
                                                               includeAllAnnotations: true
                                                           },
                                                           authentication: {
                                                               type: "None"
                                                           }
                                                       })
                                                   } else {
                                                       this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "rest"], null)
                                                   }
                                               }
                                               }>
                                <ToggleButton value={true} className={this.props.classes.toggleButton}
                                              classes={{selected: this.props.classes.toggleButtonSelected}}>
                                    {this.props.localize('project.export.rest.enabled')}
                                </ToggleButton>
                                <ToggleButton value={false} className={this.props.classes.toggleButton}
                                              classes={{selected: this.props.classes.toggleButtonSelected}}>
                                    {this.props.localize('project.export.rest.disabled')}
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </InteractionComponentWrapper>
                    </Grid>
                    {this.renderRestIfEnabled()}
                </Grid>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    }

    renderRestIfEnabled() {
        if(this.props.export.rest != null) {
            return [
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <InteractionComponentWrapper name={this.props.localize('project.export.includeOriginalDocument.name')}
                                                 caption={ this.props.localize('project.export.includeOriginalDocument.caption')}>
                        <ToggleButtonGroup value={this.props.export.rest ? this.props.export.rest.exportFormat.includeOriginalDocument : undefined}
                                           exclusive
                                           className={this.props.classes.buttonGroup}
                                           onChange={(_, newValue) => {
                                               this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "rest", "exportFormat", "includeOriginalDocument"], newValue);
                                           }
                                           }>
                            <ToggleButton value={true} className={this.props.classes.toggleButton}
                                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                                {this.props.localize('yes')}
                            </ToggleButton>
                            <ToggleButton value={false} className={this.props.classes.toggleButton}
                                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                                {this.props.localize('no')}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </InteractionComponentWrapper>
                </Grid>,
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <InteractionComponentWrapper name={this.props.localize('project.export.includeAllAnnotations.name')}
                                                 caption={ this.props.localize('project.export.includeAllAnnotations.caption')}>
                        <ToggleButtonGroup value={this.props.export.rest ? this.props.export.rest.exportFormat.includeAllAnnotations : undefined}
                                           exclusive
                                           className={this.props.classes.buttonGroup}
                                           onChange={(_, newValue) => {
                                               this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "rest", "exportFormat", "includeAllAnnotations"], newValue);
                                           }
                                           }>
                            <ToggleButton value={true} className={this.props.classes.toggleButton}
                                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                                {this.props.localize('yes')}
                            </ToggleButton>
                            <ToggleButton value={false} className={this.props.classes.toggleButton}
                                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                                {this.props.localize('no')}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </InteractionComponentWrapper>
                </Grid>,
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <InteractionComponentWrapper name={this.props.localize('project.export.rest.authentication.name')}
                                                 caption={ this.props.localize('project.export.rest.authentication.caption')}>
                        <FormControl className={this.props.classes.defaultFormControl} variant="outlined" fullWidth>
                            <Select value={ this.props.export.rest ? this.props.export.rest.authentication.type : undefined }
                                    onChange={event => {
                                        if(event.target.value === RestAuthentication.NONE.type) {
                                            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "rest", "authentication"], RestAuthentication.NONE);
                                        } else if(event.target.value === RestAuthentication.HTTP_BASIC_AUTH.type) {
                                            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "rest", "authentication"], RestAuthentication.HTTP_BASIC_AUTH);
                                        } else if(event.target.value === RestAuthentication.JWT_ROLE.type) {
                                            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "rest", "authentication"], RestAuthentication.JWT_ROLE);

                                        }
                                    }}
                                    input={<OutlinedInput notched={false} labelWidth={50}
                                                          name="dataTypeInput"/>}>
                                {
                                    Object.values(RestAuthentication).map(t => {
                                        return <OverflowMenuItem value={t.type}>
                                            {this.props.localize(`project.export.rest.authentication.${t.type}`)}
                                        </OverflowMenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </InteractionComponentWrapper>
                </Grid>,
                this.renderRestHttpBasicAuth()
            ];
        } else {
            return null;
        }
    }

    renderRestHttpBasicAuth() {
        if(this.props.export.rest && this.props.export.rest.authentication.type === RestAuthentication.HTTP_BASIC_AUTH.type) {
            return [
                <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                    <InteractionComponentWrapper name={this.props.localize('project.export.rest.authentication.username.name')}
                                                 caption={ this.props.localize('project.export.rest.authentication.password.caption')}>
                    <TextField
                        value={this.props.export.rest.authentication.username}
                        onChange={(e) => {
                            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "rest", "authentication", "username"], e.target.value)
                        }}
                        className={this.props.classes.defaultFormControl}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    </InteractionComponentWrapper>
                </Grid>,
                <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                    <InteractionComponentWrapper name={this.props.localize('project.export.rest.authentication.password.name')}
                                                 caption={ this.props.localize('project.export.rest.authentication.password.caption')}>
                    <TextField
                        value={this.props.export.rest.authentication.password}
                        onChange={(e) => {
                            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "rest", "authentication", "password"], e.target.value)
                        }}
                        className={this.props.classes.defaultFormControl}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    </InteractionComponentWrapper>
                </Grid>
            ]
        } else {
            return undefined;
        }
    }

    renderWebHooks() {
        return <ExpansionPanel defaultExpanded={true}  className={this.props.classes.panel} onChange={(_, expanded) => {
            this.setState({
                restExpanded: this.state.restExpanded,
                webHookExpanded: expanded
            })
        }}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} className={this.props.classes.panelSummary} >
                <Typography>{this.props.localize("project.export.webhooks.panelTitle")}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={this.props.classes.panelDetails}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <InteractionComponentWrapper name={this.props.localize('project.export.webhooks.enabled.name')}
                                                     caption={
                                                         this.props.localize('project.export.webhooks.enabled.caption')
                                                     }>
                            <ToggleButtonGroup value={this.props.export.webHooks.length > 0}
                                               exclusive
                                               className={this.props.classes.buttonGroup}
                                               onChange={(_, newValue) => {
                                                   if(newValue === true) {
                                                       this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "webHooks"], [{
                                                           exportFormat: {
                                                               includeOriginalDocument: true,
                                                               includeAllAnnotations: true
                                                           },
                                                           authentication: {
                                                               type: "None"
                                                           },
                                                           url: "",
                                                           onFailure: OnWebHookFailureBehavior.IGNORE
                                                       }])
                                                   } else {
                                                       this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "webHooks"], [])
                                                   }
                                               }
                                               }>
                                <ToggleButton value={true} className={this.props.classes.toggleButton}
                                              classes={{selected: this.props.classes.toggleButtonSelected}}>
                                    {this.props.localize('project.export.webhooks.enabled')}
                                </ToggleButton>
                                <ToggleButton value={false} className={this.props.classes.toggleButton}
                                              classes={{selected: this.props.classes.toggleButtonSelected}}>
                                    {this.props.localize('project.export.webhooks.disabled')}
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </InteractionComponentWrapper>
                    </Grid>
                    {this.renderWebHooksIfEnabled()}
                </Grid>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    }

    renderWebHooksIfEnabled() {
        if(this.props.export.webHooks.length > 0) {
            return [
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <InteractionComponentWrapper name={this.props.localize('project.export.includeOriginalDocument.name')}
                                                 caption={ this.props.localize('project.export.includeOriginalDocument.caption')}>
                        <ToggleButtonGroup value={this.props.export.webHooks[0].exportFormat.includeOriginalDocument}
                                           exclusive
                                           className={this.props.classes.buttonGroup}
                                           onChange={(_, newValue) => {
                                               const currentWebHookConfig = this.props.export.webHooks[0];
                                               currentWebHookConfig.exportFormat.includeOriginalDocument = newValue;
                                               this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "webHooks"], [currentWebHookConfig]);
                                           }
                                           }>
                            <ToggleButton value={true} className={this.props.classes.toggleButton}
                                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                                {this.props.localize('yes')}
                            </ToggleButton>
                            <ToggleButton value={false} className={this.props.classes.toggleButton}
                                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                                {this.props.localize('no')}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </InteractionComponentWrapper>
                </Grid>,
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <InteractionComponentWrapper name={this.props.localize('project.export.includeAllAnnotations.name')}
                                                 caption={this.props.localize('project.export.includeAllAnnotations.caption')}>
                        <ToggleButtonGroup value={this.props.export.webHooks[0].exportFormat.includeAllAnnotations}
                                           exclusive
                                           className={this.props.classes.buttonGroup}
                                           onChange={(_, newValue) => {
                                               const currentWebHookConfig = this.props.export.webHooks[0];
                                               currentWebHookConfig.exportFormat.includeAllAnnotations = newValue;
                                               this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "webHooks"], [currentWebHookConfig]);
                                           }
                                           }>
                            <ToggleButton value={true} className={this.props.classes.toggleButton}
                                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                                {this.props.localize('yes')}
                            </ToggleButton>
                            <ToggleButton value={false} className={this.props.classes.toggleButton}
                                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                                {this.props.localize('no')}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </InteractionComponentWrapper>
                </Grid>,
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <InteractionComponentWrapper name={this.props.localize('project.export.webhooks.url.name')}
                                                 caption={ this.props.localize('project.export.webhooks.url.caption')}>
                        <TextField
                            value={this.props.export.webHooks[0].url }
                            onChange={(e) => {
                                const currentWebHookConfig = this.props.export.webHooks[0];
                                currentWebHookConfig.url = e.target.value;
                                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "webHooks"], [currentWebHookConfig]);
                            }}
                            className={this.props.classes.defaultFormControl}
                            type={"url"}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                    </InteractionComponentWrapper>
                </Grid>,
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <InteractionComponentWrapper name={this.props.localize('project.export.webhooks.onFailure.name')}
                                                 caption={ this.props.localize('project.export.webhooks.onFailure.caption')}>
                        <ToggleButtonGroup value={this.props.export.webHooks[0].onFailure}
                                           exclusive
                                           className={this.props.classes.buttonGroup}
                                           onChange={(_, newValue) => {
                                               const currentWebHookConfig = this.props.export.webHooks[0];
                                               currentWebHookConfig.onFailure = newValue;
                                               this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "webHooks"], [currentWebHookConfig]);
                                           }
                                           }>
                            <ToggleButton value={OnWebHookFailureBehavior.IGNORE} className={this.props.classes.toggleButton}
                                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                                {this.props.localize('project.export.webhooks.onFailure.ignore')}
                            </ToggleButton>
                            <ToggleButton value={OnWebHookFailureBehavior.RESEND_ON_NEXT_TRIGGER} className={this.props.classes.toggleButton}
                                          classes={{selected: this.props.classes.toggleButtonSelected}}>
                                {this.props.localize('project.export.webhooks.onFailure.resend')}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </InteractionComponentWrapper>
                </Grid>,
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <InteractionComponentWrapper name={this.props.localize('project.export.webhooks.authentication.name')}
                                                 caption={ this.props.localize('project.export.webhooks.authentication.caption')}>
                        <FormControl className={this.props.classes.defaultFormControl} variant="outlined" fullWidth>
                            <Select value={ this.props.export.webHooks[0].authentication.type }
                                    onChange={event => {
                                        if(event.target.value === WebHookAuthentication.NONE.type) {
                                            const currentWebHookConfig = this.props.export.webHooks[0];
                                            currentWebHookConfig.authentication = WebHookAuthentication.NONE;
                                            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "webHooks"], [currentWebHookConfig]);
                                        } else if(event.target.value === WebHookAuthentication.HTTP_BASIC_AUTH.type) {
                                            const currentWebHookConfig = this.props.export.webHooks[0];
                                            currentWebHookConfig.authentication = WebHookAuthentication.HTTP_BASIC_AUTH;
                                            this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "webHooks"], [currentWebHookConfig]);
                                        }
                                    }}
                                    input={<OutlinedInput notched={false} labelWidth={50}
                                                          name="dataTypeInput"/>}>
                                {
                                    Object.values(WebHookAuthentication).map(t => {
                                        return <OverflowMenuItem value={t.type}>
                                            {this.props.localize(`project.export.webhooks.authentication.${t.type}`)}
                                        </OverflowMenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </InteractionComponentWrapper>
                </Grid>,
                this.renderWebHookHttpBasicAuth(),
                <Grid item xs={12}>
                    {this.renderOnOverwrittenFinalizedAnnotationBehavior()}
                </Grid>
            ];
        } else {
            return null;
        }
    }

    renderWebHookHttpBasicAuth() {
        if(this.props.export.webHooks.length > 0 && this.props.export.webHooks[0].authentication.type === WebHookAuthentication.HTTP_BASIC_AUTH.type) {
            return [
                <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                    <InteractionComponentWrapper name={this.props.localize('project.export.authentication.username.name')}
                                                 caption={ this.props.localize('project.export.authentication.password.caption')}>
                        <TextField
                            value={this.props.export.webHooks[0].authentication.username}
                            onChange={(e) => {
                                const currentWebHookConfig = this.props.export.webHooks[0];
                                currentWebHookConfig.authentication.username = e.target.value;
                                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "webHooks"], [currentWebHookConfig]);
                            }}
                            className={this.props.classes.defaultFormControl}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                    </InteractionComponentWrapper>
                </Grid>,
                <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                    <InteractionComponentWrapper name={this.props.localize('project.export.authentication.password.name')}
                                                 caption={ this.props.localize('project.export.authentication.password.caption')}>
                        <TextField
                            value={this.props.export.webHooks[0].authentication.password}
                            onChange={(e) => {
                                const currentWebHookConfig = this.props.export.webHooks[0];
                                currentWebHookConfig.authentication.password = e.target.value;
                                this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "webHooks"], [currentWebHookConfig]);
                            }}
                            className={this.props.classes.defaultFormControl}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                    </InteractionComponentWrapper>
                </Grid>
            ]
        } else {
            return undefined;
        }
    }

    renderOnOverwrittenFinalizedAnnotationBehavior() {
        return <InteractionComponentWrapper name={this.props.localize('project.export.onOverwrittenFinalizedAnnotationBehavior.name')}
                                            caption={this.props.localize('project.export.onOverwrittenFinalizedAnnotationBehavior.caption')}>
            <ToggleButtonGroup value={this.props.export.onOverwrittenFinalizedAnnotationBehavior}
                               exclusive
                               className={this.props.classes.buttonGroup}
                               onChange={(_, newValue) => {
                                   this.props.updateConfigValue(this.props.isNewConfig ? null : this.props.id, ["export", "onOverwrittenFinalizedAnnotationBehavior"], newValue);
                               }
                               }>
                <ToggleButton value={OnOverwrittenFinalizedAnnotationBehavior.DO_NOTHING} className={this.props.classes.toggleButton}
                              classes={{selected: this.props.classes.toggleButtonSelected}}>
                    {this.props.localize('project.export.onOverwrittenFinalizedAnnotationBehavior.doNothing')}
                </ToggleButton>
                <ToggleButton value={OnOverwrittenFinalizedAnnotationBehavior.TRIGGER_EXPORT_AGAIN} className={this.props.classes.toggleButton}
                              classes={{selected: this.props.classes.toggleButtonSelected}}>
                    {this.props.localize('project.export.onOverwrittenFinalizedAnnotationBehavior.triggerExportAgain')}
                </ToggleButton>
            </ToggleButtonGroup>
        </InteractionComponentWrapper>;
    }

    render() {
        return <Grid container spacing={4}>
            <Grid item xs={12}>
                {this.renderRest()}
            </Grid>
            <Grid item xs={12}>
                {this.renderWebHooks()}
            </Grid>
        </Grid>;
    }

}

export default withLocalization(withStyles(style)(ExportStep));
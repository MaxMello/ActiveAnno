// @flow
import React, {useEffect} from 'react';
import {withLocalization} from "react-localize";
import Container from '@material-ui/core/Container';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import type {AppState} from "../../types/redux/AppState";
import type {
    AnnotationID,
    Dictionary,
    WithLocalizationComponentProps,
    WithRouterComponentProps,
    WithStylesComponentProps
} from "../../types/Types";
import {Grid, makeStyles, OutlinedInput, Typography} from "@material-ui/core";
import type {AnnotationDefinitionInStore, TagSetOption} from "../../types/annotationdefinition/AnnotationDefinition";
import TextField from "@material-ui/core/TextField";
import InputWrapper from "../elements/InputWrapper";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import OverflowMenuItem from "../elements/OverflowMenuItem";
import {AnnotationDefinition as AnnotationDefinitions} from "../../constants/AnnotationDefinition";
import {CaseBehavior} from "../../constants/CaseBehavior";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import {colorButtonClasses} from "../elements/colorButtonClasses";
import {Check, Close} from "@material-ui/icons";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
    AnnotationDefinitionAction,
    LoadAnnotationDefinitionAction,
    StoreAnnotationDefinitionAction,
    UpdateAnnotationDefinitionAction
} from "../../redux/manage/manageAnnotationDefinitions";
import FetchStatus from "../../api/helper/FetchStatus";
import CircularProgress from "@material-ui/core/CircularProgress";
import SaveIcon from "@material-ui/icons/Save";
import {isArray} from "../helper/HelperFunctions";

type EditAnnotationDefinitionPageProps = WithStylesComponentProps & WithRouterComponentProps
    & WithLocalizationComponentProps & {
    annotationDefinition: AnnotationDefinitionInStore,
    isNewAnnotationDefinition: boolean,
    annotationDefinitions: Dictionary<AnnotationID, AnnotationDefinitionInStore>,
    reloadAnnotationDefinition: (annotationDefinition: AnnotationDefinitionInStore) => any,
    updateAnnotationDefinition: Function,
    save: (AnnotationDefinitionInStore, boolean) => any,
};

const useStyles = makeStyles(theme => ({
    root: theme.pageRoot,
    formControl: theme.defaultFullWidthFormControl,
    iconInButton: {
        marginRight: 4
    },
    dropDown: theme.defaultDropDown,
    defaultFormControl: theme.defaultFormControl,
    buttonGroup: theme.defaultFullWidthButtonGroup,
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
    },
    ...theme.buttons
}));

function EditAnnotationDefinitionPage(props: EditAnnotationDefinitionPageProps) {
    const classes = useStyles();

    const [newTagSetOption, setNewTagSetOption] = React.useState({
        id: "",
        name: "",
        shortName: ""
    });

    useEffect(() => {
        if(!(props.annotationDefinition?.changed ?? true) && !props.isNewAnnotationDefinition) {
            props.reloadAnnotationDefinition(props.annotationDefinition);
        }
    }, []);

    const renderAnnotationTypeSpecificInputs = (annotation: AnnotationDefinitionInStore) => {
        if(annotation.type === AnnotationDefinitions.TagSetAnnotationDefinition) {
            return [
                addNumberInput("minNumberOfTags", false),
                addNumberInput("maxNumberOfTags", false),
                <Grid item xs={12}  key={`inputOptions`}>
                    <Grid container spacing={2}>
                        {
                            ((props.annotationDefinition: any)?.options ?? []).map(option => {
                                return addSingleTagSetOptionInput(option, true,
                                    !props.isNewAnnotationDefinition);
                            })
                        }
                        {  props.isNewAnnotationDefinition && addSingleTagSetOptionInput(newTagSetOption,
                            false, !props.isNewAnnotationDefinition)
                        }
                    </Grid>
                </Grid>
            ];
        } else if(annotation.type === AnnotationDefinitions.BooleanAnnotationDefinition) {
            return addBooleanInput("optional", false);
        } else if(annotation.type === AnnotationDefinitions.OpenTextAnnotationDefinition) {
            return [
                addNumberInput("minLength", false),
                addNumberInput("maxLength", false),
                addTextInput("documentDataDefault",  !props.isNewAnnotationDefinition),
                addBooleanInput("optional", false)
            ];
        } else if(annotation.type === AnnotationDefinitions.OpenTagAnnotationDefinition) {
            return [
                addNumberInput("minNumberOfTags", false),
                addNumberInput("maxNumberOfTags", false),
                addBooleanInput("trimWhitespace", !props.isNewAnnotationDefinition),
                addBooleanInput("useExistingValuesAsPredefinedTags", false),
                addSelectInput("caseBehavior", (Object.values(CaseBehavior): any),
                    !props.isNewAnnotationDefinition),
                addTagInput("predefinedTags", false)
            ];
        } else if(annotation.type === AnnotationDefinitions.ClosedNumberAnnotationDefinition) {
            return [
                addNumberInput("min", false),
                addNumberInput("max", false),
                addNumberInput("step", false),
                addBooleanInput("optional", false)
            ];
        } else if(annotation.type === AnnotationDefinitions.OpenNumberAnnotationDefinition) {
            return [
                addNumberInput("step", false),
                addBooleanInput("optional", false)
            ];
        } else if(annotation.type === AnnotationDefinitions.NumberRangeAnnotationDefinition) {
            return [
                addNumberInput("min", false),
                addNumberInput("max", false),
                addNumberInput("step", false),
                addBooleanInput("optional", false)
            ];
        }
    }

    const addNumberInput = (key: string, disabled: boolean) => {
        return <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={`input${key}`}>
            <InputWrapper name={props.localize(`annotationDefinition.${key}.name`)} disabled={false}
                          keyValue={`numberInput${props.annotationDefinition.id}.${key}`}
                                         caption={props.localize(`annotationDefinition.${key}.caption`)}>
                <TextField
                    value={(props.annotationDefinition: any)[key]}
                    onChange={(e) => {
                        props.updateAnnotationDefinition({
                            ...props.annotationDefinition,
                            ...{
                                [key]: e.target.value,
                            }
                        })
                    }}
                    type="number"
                    disabled={disabled}
                    className={classes.defaultFormControl}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
            </InputWrapper>
        </Grid>;
    }

    const addTextInput = (key: string, disabled: boolean) => {
        return <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={`input${key}`}>
            <InputWrapper name={props.localize(`annotationDefinition.${key}.name`)} disabled={false}
                          keyValue={`textInput${props.annotationDefinition.id}.${key}`}
                          caption={props.localize(`annotationDefinition.${key}.caption`)}>
                <TextField
                    value={(props.annotationDefinition: any)[key]}
                    onChange={(e) => {
                        props.updateAnnotationDefinition({
                            ...props.annotationDefinition,
                            ...{
                                [key]: e.target.value,
                            }
                        })
                    }}
                    disabled={disabled}
                    className={classes.defaultFormControl}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
            </InputWrapper>
        </Grid>;
    }


    const addBooleanInput = (key: string, disabled: boolean) => {
        return <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={`input${key}`}>
            <InputWrapper name={props.localize(`annotationDefinition.${key}.name`)} disabled={false}
                                         caption={props.localize(`annotationDefinition.${key}.caption`)}
                keyValue={`booleanInput${props.annotationDefinition.id}.${key}`}>
                <ToggleButtonGroup value={(props.annotationDefinition: any)[key]}
                                   exclusive
                                   disabled={disabled}
                                   className={classes.buttonGroup}
                                   onChange={(_, newValue) => {
                                       props.updateAnnotationDefinition({
                                           ...props.annotationDefinition,
                                           ...{
                                               [key]: newValue,
                                           }
                                       })
                                   }
                                   }>
                    <ToggleButton value={true} classes={colorButtonClasses(classes)}>
                        <Check/>
                        {props.localize('yes')}
                    </ToggleButton>
                    <ToggleButton value={false} classes={colorButtonClasses(classes)}>
                        <Close/>
                        {props.localize('no')}
                    </ToggleButton>
                </ToggleButtonGroup>
            </InputWrapper>
        </Grid>;
    }

    const addTagInput = (key: string, disabled: boolean) => {
        return <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={`input${key}`}>
            <InputWrapper name={props.localize(`annotationDefinition.${key}.name`)} disabled={false}
                          keyValue={`tagInput${props.annotationDefinition.id}.${key}`}
                          caption={props.localize(`annotationDefinition.${key}.caption`)}>
                <Autocomplete
                    fullWidth
                    multiple
                    value={(props.annotationDefinition: any)[key]}
                    options={[]}
                    freeSolo={true}
                    className={classes.defaultFormControl}
                    autoHighlight={false}
                    disabled={disabled}
                    autoSelect={false}
                    getOptionLabel={(option: string) => option}
                    onChange={(_, value) => {
                        let newValueArray: Array<string>;
                        if(value == null) {
                            newValueArray = [];
                        } else if(!isArray(value)) {
                            newValueArray = [value];
                        } else {
                            newValueArray = value;
                        }
                        props.updateAnnotationDefinition({
                            ...props.annotationDefinition,
                            ...{
                                [key]: newValueArray
                            }
                        })
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                        />
                    )}
                />
            </InputWrapper>
        </Grid>;
    }

    const addSelectInput = (key: string, options: Array<string>, disabled: boolean) => {
        return <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={`input${key}`}>
            <InputWrapper
                name={props.localize(`annotationDefinition.${key}.name`)} disabled={false}
                keyValue={`selectInput${props.annotationDefinition.id}.${key}`}
                caption={props.localize(`annotationDefinition.${key}.caption`)}>
            <FormControl className={classes.defaultFormControl} variant="outlined" fullWidth>
                <Select value={(props.annotationDefinition: any)[key] ?? ""}
                        onChange={e => {
                            props.updateAnnotationDefinition({
                                ...props.annotationDefinition,
                                ...{
                                    [key]: e.target.value,
                                }
                            })
                        }}
                        disabled={disabled}
                        input={<OutlinedInput notched={false} labelWidth={50}/>}>
                    {
                        options.map(o => {
                            return <OverflowMenuItem value={o} key={`overflowMenuItem${key}.${o}`}>
                                {props.localize(`annotationDefinition.${key}.${o}`)}
                            </OverflowMenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </InputWrapper></Grid>;
    }

    const removeTagSetOption = (optionID: string) => {
        let currentOptions = (props.annotationDefinition: any)?.options ?? [];
        currentOptions = currentOptions.filter(o => o !== optionID);
        props.updateAnnotationDefinition({
            ...props.annotationDefinition,
            ...{
                options: currentOptions,
            }
        });
    }

    const canAddNewTagSetOption = (): boolean => {
        return (newTagSetOption != null && newTagSetOption.id != null && newTagSetOption.id.length > 0 &&
            newTagSetOption.name != null && newTagSetOption.name.length > 0 && newTagSetOption.shortName != null
            && newTagSetOption.shortName.length > 0);
    }

    const addTagSetOption = () => {
        if(canAddNewTagSetOption()) {
            if(!((props.annotationDefinition: any)?.options?.map(o => o.id))?.includes(newTagSetOption.id)) {
                const currentOptions = (props.annotationDefinition: any)?.options ?? [];
                currentOptions.push(newTagSetOption);
                props.updateAnnotationDefinition({
                    ...props.annotationDefinition,
                    ...{
                        options: currentOptions,
                    }
                });
                setNewTagSetOption({
                    id: "", name: "", shortName: ""
                });
            } else {
                setNewTagSetOption({
                    ...newTagSetOption,
                    ...{
                        id: ""
                    }
                });
            }
        }
    }

    const addSingleTagSetOptionInput = (option: TagSetOption, existsAlready: boolean, disabled: boolean) => {
        return <Grid item xs={12} key={`tagSetOptionInput${option.id}`}>
            <ExpansionPanel defaultExpanded={true}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} className={classes.panelSummary} >
                    <Typography>{existsAlready ? `${props.localize(
                        "annotationDefinition.tagSetOption")} ${option.name} (${option.id})` :
                            props.localize("annotationDefinition.tagSetOption.add")}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.panelDetails}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                            <InputWrapper name={props.localize('annotationDefinition.tagSetOption.id.name')}
                                  disabled={false}
                                  keyValue={`tagSetOptionID${props.annotationDefinition.id}.option.${option?.id ?? ""}`}
                                  caption={props.localize('annotationDefinition.tagSetOption.id.caption')}>
                                <TextField
                                    value={option.id}
                                    disabled={disabled}
                                    onChange={e => {
                                        if(existsAlready) {
                                            const currentOptions = (props.annotationDefinition: any)?.options ?? [];
                                            const optIndex = currentOptions.findIndex((o => o.id === option.id));
                                            currentOptions[optIndex].id = e.target.value;
                                            props.updateAnnotationDefinition({
                                                ...props.annotationDefinition,
                                                ...{
                                                    options: currentOptions,
                                                }
                                            });
                                        } else {
                                            setNewTagSetOption({
                                                ...newTagSetOption,
                                                ...{
                                                    id: e.target.value
                                                }
                                            });
                                        }
                                    }}
                                    className={classes.defaultFormControl}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                />
                            </InputWrapper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                            <InputWrapper name={props.localize('annotationDefinition.tagSetOption.name.name')}
                              disabled={false}
                              keyValue={`tagSetOptionName${props.annotationDefinition.id}.option.${option?.id ?? ""}`}
                              caption={props.localize('annotationDefinition.tagSetOption.name.caption')}>
                                <TextField
                                    value={option.name}
                                    onChange={e => {
                                        if(existsAlready) {
                                            const currentOptions = (props.annotationDefinition: any)?.options ?? [];
                                            const optIndex = currentOptions.findIndex((o => o.id === option.id));
                                            currentOptions[optIndex].name = e.target.value;
                                            props.updateAnnotationDefinition({
                                                ...props.annotationDefinition,
                                                ...{
                                                    options: currentOptions,
                                                }
                                            });
                                        } else {
                                            setNewTagSetOption({
                                                ...newTagSetOption,
                                                ...{
                                                    name: e.target.value
                                                }
                                            });
                                        }
                                    }}
                                    className={classes.defaultFormControl}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                />
                            </InputWrapper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                            <InputWrapper name={props.localize('annotationDefinition.tagSetOption.shortName.name')}
                                          disabled={false}
                                            keyValue={`tagSetOptionShortName${props
                                                .annotationDefinition.id}.option.${option?.id ?? ""}`}
                                 caption={props.localize('annotationDefinition.tagSetOption.shortName.caption')}>
                                <TextField
                                    value={option.shortName}
                                    onChange={e => {
                                        if (existsAlready) {
                                            const currentOptions = (props.annotationDefinition: any)?.options ?? [];
                                            const optIndex = currentOptions.findIndex((o => o.id === option.id));
                                            currentOptions[optIndex].shortName = e.target.value;
                                            props.updateAnnotationDefinition({
                                                ...props.annotationDefinition,
                                                ...{
                                                    options: currentOptions,
                                                }
                                            });
                                        } else {
                                            setNewTagSetOption({
                                                ...newTagSetOption,
                                                ...{
                                                    shortName: e.target.value
                                                }
                                            });
                                        }
                                    }}
                                    className={classes.defaultFormControl}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                />
                            </InputWrapper>
                        </Grid>
                        {!disabled &&
                            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.buttonGrid}>
                                <Button
                                    onClick={() => {
                                        existsAlready ? removeTagSetOption(option.id) : addTagSetOption()
                                    }}
                                    fullWidth
                                    variant="contained"
                                    disabled={disabled || (!existsAlready && !canAddNewTagSetOption())}
                                    className={existsAlready ? classes.deleteOptionButton : classes.addOptionButton}
                                    classes={{disabled: classes.toggleButtonDisabled}}
                                    size="large"
                                    color="primary">
                                    {existsAlready ? props.localize('annotationDefinition.tagSetOption.remove.button') :
                                        props.localize('annotationDefinition.tagSetOption.add.button')}
                                </Button>
                            </Grid>
                        }
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </Grid>
    }

    return <div className={classes.root}>
        <Container component="main" maxWidth="lg">
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant={'h4'}>
                        {props.isNewAnnotationDefinition ? props.localize("annotationDefinition.new") :
                            (props.localize("annotationDefinition.title") + ": " + props.annotationDefinition.name)}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant={'body2'}>
                        {props.localize(`annotationDefinition.type.${props.annotationDefinition.type}`) +  ": " +
                        props.localize(`annotationDefinition.${props.annotationDefinition.type}.caption`)}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                    <InputWrapper name={props.localize('annotationDefinition.add.type.name')} disabled={false}
                                  keyValue={"addAnnotationViewInput"}
                                  caption={props.localize('annotationDefinition.add.type.caption')}>
                        <FormControl className={classes.dropDown} variant="outlined">
                            <Select value={props.annotationDefinition.type}
                                    disabled={!props.isNewAnnotationDefinition}
                                    onChange={(e: any) => {
                                        props.updateAnnotationDefinition({
                                            ...props.annotationDefinition,
                                            ...{
                                                type: e.target.value,
                                            }
                                        })
                                    }}
                                    input={<OutlinedInput notched={false} labelWidth={50}/>}>
                                {
                                    (Object.values(AnnotationDefinitions): any).map((t: string) => {
                                        return <OverflowMenuItem value={t} key={`overflowMenuItemType.${t}`}>
                                            {props.localize(`annotationDefinition.type.${t}`)}
                                        </OverflowMenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </InputWrapper>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                    <InputWrapper name={props.localize('annotationDefinition.id.name')} disabled={false}
                                  keyValue={"addAnnotationViewInputID"}
                                  caption={props.localize('annotationDefinition.id.caption')}>
                        <TextField
                            value={props.annotationDefinition.id}
                            onChange={e => {
                                const newId = e.target.value;
                                props.updateAnnotationDefinition({
                                    ...props.annotationDefinition,
                                    ...{
                                        id: newId,
                                    }
                                })
                            }}
                            disabled={!props.isNewAnnotationDefinition}
                            className={classes.defaultFormControl}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                    </InputWrapper>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                    <InputWrapper name={props.localize('annotationDefinition.name.name')} disabled={false}
                                  keyValue={"addAnnotationViewInputName"}
                                  caption={props.localize('annotationDefinition.name.caption')}>
                        <TextField
                            value={props.annotationDefinition.name}
                            onChange={e => {
                                props.updateAnnotationDefinition({
                                    ...props.annotationDefinition,
                                    ...{
                                        name: e.target.value,
                                    }
                                })
                            }}
                            className={classes.defaultFormControl}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                    </InputWrapper>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                    <InputWrapper name={props.localize('annotationDefinition.shortName.name')} disabled={false}
                                  keyValue={"addAnnotationViewInputShortName"}
                                  caption={props.localize('annotationDefinition.shortName.caption')}>
                        <TextField
                            value={props.annotationDefinition.shortName}
                            onChange={e => {
                                props.updateAnnotationDefinition({
                                    ...props.annotationDefinition,
                                    ...{
                                        shortName: e.target.value,
                                    }
                                })
                            }}
                            className={classes.defaultFormControl}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                    </InputWrapper>
                </Grid>
                {renderAnnotationTypeSpecificInputs(props.annotationDefinition)}
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                    <Button size="large" color="primary" variant={"contained"} fullWidth
                            disabled={FetchStatus.ACTIVE === props.annotationDefinition.fetchStatus}
                            onClick={() => {
                                props.save(props.annotationDefinition, props.isNewAnnotationDefinition)
                            }}>
                        {props.annotationDefinition.fetchStatus === FetchStatus.ACTIVE ?
                            <CircularProgress color={"secondary"} size={22} className={classes.iconInButton}/> :
                            <SaveIcon className={classes.iconInButton}/>}{ props.localize(
                        'annotationDefinition.save')}
                    </Button>
                </Grid>
            </Grid>
        </Container>
    </div>;
}

const mapStateToProps = (state: AppState, ownProps: EditAnnotationDefinitionPageProps): Object => {
    return ({
        annotationDefinition: ownProps.location.pathname.startsWith('/manage/new_annotationDefinition')
            ? state.manage.newAnnotationDefinition : (ownProps.match.params.id ?
                state.manage.annotationDefinitions[ownProps.match.params.id] : null),
        isNewAnnotationDefinition: ownProps.location.pathname.startsWith('/manage/new_annotationDefinition'),
        annotationDefinitions: state.manage.annotationDefinitions
    });
};

const mapDispatchToProps = (dispatch: Function): Object => ({
    updateAnnotationDefinition: (annotationDefinition: AnnotationDefinitionInStore) => {
        dispatch(AnnotationDefinitionAction.updateState(annotationDefinition));
    },
    save: (annotationDefinition: AnnotationDefinitionInStore, isNewAnnotationDefinition: boolean) => {
        if(isNewAnnotationDefinition) {
            dispatch(StoreAnnotationDefinitionAction.start(annotationDefinition));
        } else {
            dispatch(UpdateAnnotationDefinitionAction.start(annotationDefinition));
        }
    },
    reloadAnnotationDefinition: (annotationDefinition: AnnotationDefinitionInStore) => {
        dispatch(LoadAnnotationDefinitionAction.start(annotationDefinition.id));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(
    withRouter(withLocalization((EditAnnotationDefinitionPage))));

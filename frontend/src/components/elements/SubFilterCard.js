// @flow
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import type {WithLocalizationComponentProps} from "../../types/Types";
import type {DocumentSelection, SubFilter, SubFilterOption} from "../../types/project/ProjectTypes";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";
import {KeyboardDateTimePicker} from "@material-ui/pickers";
import type {DocumentSelectionParameters} from "../../types/annotate/DocumentSelectionParameters";
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        flexWrap: 'nowrap'
    },
    card: {
        maxWidth: 1280,
        backgroundColor: 'white',
        margin: `${theme.spacing(1)}px !important`,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        flexGrow: 1,
        fontWeight: 400
    },
    defaultFormControl: theme.defaultFormControl
}));

type SubFilterCardProps = WithLocalizationComponentProps & {
    documentSelection: ?DocumentSelection,
    onClose: Function,
    onApply: Function,
    onClear: Function,
    setSubFilterAction: Function,
    selectionState: DocumentSelectionParameters,
    setDateFilterFromAction: Function,
    setDateFilterToAction: Function
};

/**
 * Card for displaying subfilter for additional filtering options during the annotation process
 */
export default function SubFilterCard(props: SubFilterCardProps) {
    const classes = useStyles();
    let subFilter = [];

    if((props.documentSelection?.subFilter?.length ?? 0) > 0) {
        subFilter = props.documentSelection?.subFilter?.map((f: SubFilter) => {
            if(f.selectionType === 'AGGREGATE_ALL_VALUES') {
                return <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={`annotate.subFilterCard.${f.key}`}>
                    <Autocomplete
                        fullWidth
                        autoComplete={true}
                        value={props.selectionState.subFilter[f.key]}
                        options={f.options}
                        className={classes.defaultFormControl}
                        autoHighlight={false}
                        autoSelect={true}
                        getOptionLabel={(option: SubFilterOption) => option.value + " (" + option.count + ")"}
                        onChange={(e) => {
                            props.setSubFilterAction({
                                ...props.selectionState.subFilter,
                                ...{
                                    [f.key]: e.target.value
                                }
                            })
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={f.displayName}
                                variant="outlined"
                            />
                        )}
                    />
                </Grid>
            } else if(f.selectionType === 'INPUT_FIELD') {
                return <Grid item xs={12} sm={6} md={6} lg={4} xl={3}  key={`annotate.subFilterCard.${f.key}`}>
                    <TextField
                        value={props.selectionState.subFilter[f.key]}
                        label={f.displayName}
                        onChange={(e) => {
                            let value = e.target.value;
                            if (value == null || value.length === 0) {
                                value = undefined;
                            }
                            props.setSubFilterAction({
                                ...props.selectionState.subFilter,
                                ...{
                                    [f.key]: value
                                }
                            })
                        }}
                        className={classes.defaultFormControl}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                /></Grid>
            } else {
                console.log("Error invalid selectionType");
                return null;
            }
        });
    }
    return (
        <div className={classes.wrapper}>
            <Card className={classes.card}>
                <CardHeader title={props.localize("subfilter.title")}/>
                <CardContent>
                    <Grid container spacing={1}>
                        {
                            subFilter
                        }
                    </Grid>
                    <Grid container spacing={1}>
                        {
                            (props.documentSelection?.dateRangeFilter != null) ? <Grid item xs={12} sm={6}>
                                <KeyboardDateTimePicker
                                    label={props.localize("daterange.label.start")}
                                    className={classes.defaultFormControl}
                                    fullWidth
                                    value={props.selectionState.dateFilterFrom}
                                    ampm={false}
                                    emptyLabel={props.localize("daterange.start.empty")}
                                    format={props.localize("dateTimeFormat")}
                                    inputVariant={"outlined"}
                                    clearable={true}
                                    autoOk={true}
                                    invalidDateMessage={props.localize("daterange.invalid.msg")}
                                    invalidLabel={props.localize("daterange.invalid.label")}
                                    okLabel={props.localize("daterange.dialog.ok")}
                                    clearLabel={props.localize("daterange.dialog.clear")}
                                    cancelLabel={props.localize("daterange.dialog.cancel")}
                                    onChange={(date: any) => {
                                        props.setDateFilterFromAction(date ? date.toString() : null)
                                    }}

                                />
                            </Grid> : null
                        }
                        {
                            (props.documentSelection?.dateRangeFilter != null) ? <Grid item xs={12} sm={6}>
                                <KeyboardDateTimePicker
                                    label={props.localize("daterange.label.end")}
                                    className={classes.defaultFormControl}
                                    fullWidth
                                    value={props.selectionState.dateFilterTo}
                                    ampm={false}
                                    emptyLabel={props.localize("daterange.end.empty")}
                                    format={props.localize("dateTimeFormat")}
                                    inputVariant={"outlined"}
                                    clearable={true}
                                    initialFocusedDate={""}
                                    autoOk={true}
                                    invalidDateMessage={props.localize("daterange.invalid.msg")}
                                    invalidLabel={props.localize("daterange.invalid.label")}
                                    okLabel={props.localize("daterange.dialog.ok")}
                                    clearLabel={props.localize("daterange.dialog.clear")}
                                    cancelLabel={props.localize("daterange.dialog.cancel")}
                                    onChange={(date: any) => {
                                        props.setDateFilterToAction(date ? date.toString() : null)
                                    }}

                                />
                            </Grid> : null
                        }
                    </Grid>
                </CardContent>
                <CardActions>
                    <Button color="primary" size="small" onClick={
                        () => props.onApply()
                    }>{props.localize("subfilter.apply")}</Button>
                    <Button size="small" onClick={
                        () => props.onClear()
                    }>{props.localize("subfilter.clear")}</Button>
                    <Button size="small" onClick={
                        () => props.onClose()
                    }>{props.localize("subfilter.close")}</Button>
                </CardActions>
            </Card>
        </div>
    );
}
// @flow
import React, {useEffect, useState} from 'react';
import {withLocalization} from "react-localize";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {Badge, makeStyles, OutlinedInput, Typography} from "@material-ui/core";
import Refresh from "@material-ui/icons/Refresh";
import FilterList from "@material-ui/icons/FilterList";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import IconButton from "@material-ui/core/IconButton";
import AnnotateDocumentCard from "../elements/interaction/AnnotateDocumentCard";
import Hidden from "@material-ui/core/Hidden";
import DefaultPopover from "../elements/DefaultPopover";
import Box from "@material-ui/core/Box";
import Check from "@material-ui/icons/Check";
import SkipNext from "@material-ui/icons/SkipNext";
import Clear from "@material-ui/icons/Clear";
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import OverflowMenuItem from "../elements/OverflowMenuItem";
import Grid from "@material-ui/core/Grid";
import DocumentDataPanel from "../elements/illustration/DocumentDataPanel";
import withWidth, {isWidthDown, WithWidth} from "@material-ui/core/withWidth";
import {Element, scroller} from 'react-scroll';
import CircularProgress from '@material-ui/core/CircularProgress';
import type {
    Dictionary,
    DocumentID,
    ProjectID,
    WithLocalizationComponentProps,
    WithStylesComponentProps
} from "../../types/Types";
import FetchStatus from "../../api/helper/FetchStatus";
import SubFilterCard from "../elements/SubFilterCard";
import type {AnnotateProject} from "../../types/annotate/DTOTypes";
import type {AnnotationDataState, AnnotationDocumentInState} from "../../types/redux/annotate/AnnotationDataState";
import type {AnnotationProjectState} from "../../types/redux/AnnotationConfigState";
import type {UsedAnnotateProject} from "../../types/project/UsedAnnotateProject";
import type {CurationProjectState} from "../../types/redux/CurationConfigState";
import type {CurationDataState, CurationDocumentInState} from "../../types/redux/annotate/CurationDataState";
import FinishedAnnotationPanel from "./FinishedAnnotationPanel";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {StyledMenuItem} from "../helper/StyledMenuItem";
import MenuList from "@material-ui/core/MenuList";

type AnnotationProps = WithLocalizationComponentProps & WithStylesComponentProps & WithWidth & {
    // State
    projectState: AnnotationProjectState | CurationProjectState,
    dataState: AnnotationDataState | CurationDataState,
    // Actions
    // Refresh
    forceRefresh: Function,
    triggerRefresh: Function,
    startRefreshing: Function,
    stopRefreshing: Function,
    // Projects
    loadProject: Function,
    setProjectActive: Function,
    // Data
    setDocumentActive: Function,
    setAnnotationValue: Function,
    deleteDocumentsForProject: Function,
    sendDocument: Function,
    // Selection
    setSubFilter: Function,
    setDateFilterFrom: Function,
    setDateFilterTo: Function,
    // Other
    resetAnnotations: (projectID: ProjectID, documentID: DocumentID) => void,
    skipDocument: (projectID: ProjectID, documentID: DocumentID) => void
};

const useStyles = makeStyles(theme => ({
    root: theme.pageRoot,
    firstRow: {
        display: 'flex',
        width: '100%',
        flexWrap: 'nowrap',
        [theme.breakpoints.up('md')]: {
            justifyContent: 'center'
        }
    },
    firstRowContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 1280,
        margin: theme.spacing(1),
        flexWrap: 'nowrap',
        flexGrow: 1,
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'start',
            flexWrap: 'nowrap',
            marginBottom: 0
        }
    },
    formControl: {
        [theme.breakpoints.down('sm')]: {
            minWidth: 40,
            maxWidth: 'inherit',
            flexGrow: 1
        },
        [theme.breakpoints.up('md')]: {
            minWidth: 160,
            marginRight: theme.spacing(2),
        }
    },
    label: {
        transform: "translate(13px, 13px) scale(1)"
    },
    input: {
        padding: '12px 16px',
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    contentBody: {
        display: 'flex',
        margin: theme.spacing(2),
        alignItems: 'center'
    },
    grow: {
        flexGrow: 1,
    },
    descriptionButton: {},
    refreshButton: {
        marginLeft: theme.spacing(2),
        marginRight: 0,
        [theme.breakpoints.down('sm')]: {
            marginLeft: 0
        }
    },
    subFilterButton: {

    },
    description: {
        flexGrow: 1
    },
    popoverContent: theme.defaultPopoverContent,
    bottomWhitespace: {
        height: theme.spacing(6),
        [theme.breakpoints.up('md')]: {
            height: theme.spacing(8),
        },
        '@media (min-width: 1500px)': {
            height: 0
        },
        width: '100%'
    },
    fab: {
        bottom: theme.spacing(2),
        right: theme.spacing(3),
        margin: 0,
        top: 'auto',
        left: 'auto',
        position: 'fixed',
        [theme.breakpoints.up('md')]: {
            bottom: theme.spacing(2),
            right: theme.spacing(5),
        }
    },
    noDocuments: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: theme.spacing(8)
    },
    noDocumentsTextRow: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
    },
    noDocumentsButtonRow: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
    },
    noDocumentsButton: {
        margin: theme.spacing(2)
    },
    actionButtonWrapper: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        flexWrap: 'nowrap'
    },
    actionButtonRow: {
        maxWidth: 1280,
        backgroundColor: 'white',
        justifyContent: 'right',
        margin: theme.spacing(1),
        flexGrow: 1,
    },
    primaryButton: theme.buttons.primaryButton,
    defaultButton: theme.buttons.defaultButton,
    fullWidthFinishButton: {
        flexGrow: 1
    },
    fullWidthFinishButtonDropdownButton: {
        width: 0
    }
}));

/**
 * Main view showing the annotation UI, used in AnnotatePage and CuratePage
 */
function AnnotateView(props: AnnotationProps) {
    const classes = useStyles();
    const [showSubFilter, setShowSubFilter] = useState(false);
    // Action buttons at bottom
    const actionButtonAnchorRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const toggleButtonDropdown = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const handleButtonDropdownClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        Object.values(props.projectState.projects).sort(function (a: any, b: any) {
                    return b.priority - a.priority
        }).forEach((c: any, index: number) => {
            if (index === 0 && !props.projectState.activeProjectID) {
                props.loadProject(c.id);
                props.setProjectActive(c.id);
            }
        });
        if (props.projectState.projects && props.projectState.activeProjectID
            && props.projectState.projects[props.projectState.activeProjectID].layout) {
            // Have active project
            const activeProject = props.projectState.projects[props.projectState.activeProjectID];
            const allProjectDocuments: Dictionary<DocumentID, AnnotationDocumentInState> =
                props.dataState.documents[activeProject.id]
                    ? props.dataState.documents[activeProject.id] : {};
            const relevantProjectDocuments = (Object.values(allProjectDocuments): any)
                .filter((d: AnnotationDocumentInState | CurationDocumentInState) => !d.skipped);
            if(relevantProjectDocuments.length === 0
                && props.dataState.fetchStatus !== FetchStatus.ACTIVE
                && props.dataState.fetchStatus !== FetchStatus.ERROR) {
                props.triggerRefresh();
            }
        }
    });

    useEffect(() => {
        props.startRefreshing();
        props.forceRefresh();
    }, []);

    useEffect(() => {
        return () => props.stopRefreshing();
    }, []);

    const onProjectChange = (event) => {
        if (event.target.value) {
            props.loadProject(event.target.value);
            props.setProjectActive(event.target.value);
        }
    }

    const projectList = Object.values(props.projectState.projects)
        .sort(function(a: any, b: any) {
                return a.priority - b.priority
            }
        ).map((c: any) => {
            return <OverflowMenuItem value={c.id} key={`annotateProjectItem${c.id}`}>{c.name}</OverflowMenuItem>
        });
    let activeProject: ?AnnotateProject = null;
    let documentDataPanel: DocumentDataPanel = null;
    let finishedAnnotationsPanel: ?FinishedAnnotationPanel;
    let documentCard: AnnotateDocumentCard = null;
    let activeDocument: ?AnnotationDocumentInState | ?CurationDocumentInState = null;
    if (props.projectState.projects && props.projectState.activeProjectID
        && props.projectState.projects[props.projectState.activeProjectID].layout) {
        // ^ Make sure full project is loaded
        activeProject = (props.projectState.projects[props.projectState.activeProjectID]: any);
        const allProjectDocuments: Dictionary<DocumentID, AnnotationDocumentInState> = props
            .dataState.documents[activeProject.id] ?
            props.dataState.documents[activeProject.id] : {};
        const relevantProjectDocuments = (Object.values(allProjectDocuments): any)
                .filter((d: AnnotationDocumentInState | CurationDocumentInState) => !d.skipped);
        if (props.dataState.activeDocumentID && relevantProjectDocuments
            .find((d: AnnotationDocumentInState | CurationDocumentInState) => d.documentID === props
                .dataState.activeDocumentID)) {
            activeDocument = props.dataState.documents[activeProject.id][props.dataState.activeDocumentID];
            documentDataPanel = <Element name="documentDataPanel">
                <DocumentDataPanel project={activeProject} document={activeDocument}
                                 key={`documentDataPanel${activeProject.id}Document${activeDocument.documentID}`}
                />
            </Element>;
            if(activeDocument.annotationResults) {
                finishedAnnotationsPanel = <FinishedAnnotationPanel
                        activeProject={activeProject}
                        annotationResults={activeDocument.annotationResults ?? []}/>;
            }
            documentCard = <AnnotateDocumentCard
                project={activeProject}
                document={activeDocument}
                setAnnotationValue={props.setAnnotationValue}
                key={`documentCardProject${activeProject.id}Document${activeDocument.documentID}`}
            />;
        } else if (relevantProjectDocuments.length > 0) {
            const sortedRelevantDocumentsByOrder = relevantProjectDocuments.sort(
                (a: AnnotationDocumentInState, b: AnnotationDocumentInState) =>
                    props.dataState.documentOrder[props.projectState.activeProjectID].indexOf(a.documentID) -
                    props.dataState.documentOrder[props.projectState.activeProjectID].indexOf(b.documentID)
            );
            const toBeActiveDocument: AnnotationDocumentInState = (sortedRelevantDocumentsByOrder[0] : any);
            props.setDocumentActive(props.projectState.activeProjectID, toBeActiveDocument.documentID);
            scroller.scrollTo("documentDataPanel", {duration: 160, offset: -64, smooth: true, delay: 0});
        } else {
            documentCard = <Grid container className={classes.noDocuments}>
                <Grid item xs={12} className={classes.noDocumentsTextRow}>
                    <Typography>{props.localize("annotateView.noMoreDocuments")}</Typography>
                </Grid>
            </Grid>;
        }
    }

    const finishDocument = () => {
        if (activeProject != null && activeDocument != null) {
            const usedProject: UsedAnnotateProject = {
                id: activeProject.id,
                name: activeProject.name,
                description: activeProject.description,
                priority: activeProject.priority,
                layout: activeProject.layout,
                allowManualEscalationToCurator: activeProject.allowManualEscalationToCurator,
                generatedAnnotationResultHandlingPolicy: activeProject.generatedAnnotationResultHandlingPolicy
            };
            if (!activeDocument.isSending) {
                props.sendDocument(
                    activeDocument,
                    usedProject
                );
            }
        }
    }

    const hasActiveDocument = activeDocument != null;
    const isSendingDocument = activeDocument?.isSending ?? false;

    return <div className={classes.root}>
        <div className={classes.firstRow}>
            <div className={classes.firstRowContent}>
                <FormControl className={classes.formControl} variant="outlined">
                    <InputLabel htmlFor="annotateProject"
                                classes={{root: classes.label}}>Project</InputLabel>
                    <Select value={props.projectState.activeProjectID}
                            onChange={onProjectChange}
                            input={<OutlinedInput labelWidth={50} name="projectID" id="annotateProject"
                                                  classes={{input: classes.input}}/>}>
                        {projectList}
                    </Select>
                </FormControl>
                <Hidden smDown>
                    <Typography variant={'body2'} color={'secondary'} className={classes.description}>
                        {activeProject ? activeProject.description : ""}
                    </Typography>
                </Hidden>
                <Hidden mdUp>
                    <DefaultPopover trigger={"CLICK"} targets={
                        <IconButton
                            color="secondary"
                            className={classes.descriptionButton}>
                            <InfoOutlined/>
                        </IconButton>
                    } content={
                        <Box className={classes.popoverContent}>
                            {activeProject ? activeProject.description : ""}
                        </Box>
                    } keyValue={"projectDescriptionPopover"}/>
                </Hidden>
                <Badge badgeContent={
                    (Object.values(props.projectState.selection.subFilter): any)
                        .filter(x => x != null && x.length > 0).length} color="secondary"
                       showZero={false} max={99}>
                    <IconButton
                        color="secondary"
                        disabled={activeProject == null || activeProject.selection.subFilter == null
                        || activeProject.selection.subFilter.length === 0
                        }
                        onClick={() => {
                            setShowSubFilter(!showSubFilter)
                        }}
                        className={classes.subFilterButton}>
                        <FilterList/>
                    </IconButton>
                </Badge>
                <IconButton
                    color="secondary"
                    onClick={() => {
                        if(activeProject != null) {
                            props.deleteDocumentsForProject(activeProject.id);
                        }
                        props.forceRefresh();
                    }}
                    className={classes.refreshButton}>
                    <Refresh/>
                </IconButton>
            </div>
        </div>
        {showSubFilter ? <SubFilterCard localize={props.localize}
                                                   documentSelection={activeProject ? activeProject.selection :
                                                       null}
                                                   selectionState={props.projectState.selection}
                                                   setSubFilterAction={(subFilter) => {
                                                       props.setSubFilter(subFilter)
                                                   }}
                                                   setDateFilterFromAction={(date) => {
                                                       props.setDateFilterFrom(date)
                                                   }}
                                                   setDateFilterToAction={(date) => {
                                                       props.setDateFilterTo(date)
                                                   }}
                                                   onApply={() => {
                                                       if(activeProject) {
                                                           // Delete all documents for active project
                                                           props.deleteDocumentsForProject(activeProject.id);
                                                           // Trigger pulling new documents from backend
                                                           props.triggerRefresh();
                                                       }
                                                       // Close box
                                                       setShowSubFilter(false)
                                                   }
                                                   }
                                                   onClear={() => {
                                                       props.setSubFilter({
                                                       })
                                                   }}
                                                   onClose={() => setShowSubFilter(false)}
        /> : null}
        {documentDataPanel}
        {finishedAnnotationsPanel}
        {documentCard}
        {hasActiveDocument &&
            <div className={classes.actionButtonWrapper}>
                <Grid container className={classes.actionButtonRow}>
                    <Grid item xs={12} align="left">
                        <ButtonGroup variant="contained" color="primary" ref={actionButtonAnchorRef}
                                     fullWidth={isWidthDown("xs", props.width)}
                                     aria-label="Action button">
                            <Button color="primary" aria-label="Finished" onClick={finishDocument}
                                    className={isWidthDown("xs", props.width)
                                        ? classes.fullWidthFinishButton : undefined}
                                    disabled={isSendingDocument}
                                    startIcon={isSendingDocument ? <CircularProgress size={20}/> : <Check/>}>
                                {props.localize("annotateView.finish")}
                            </Button>
                            <Button
                                color="primary"
                                size="small"
                                disabled={isSendingDocument}
                                aria-haspopup="true"
                                className={isWidthDown("xs", props.width)
                                    ? classes.fullWidthFinishButtonDropdownButton : undefined}
                                onClick={toggleButtonDropdown}>
                                <ArrowDropDownIcon/>
                            </Button>
                        </ButtonGroup>
                        <Popper open={open} anchorEl={actionButtonAnchorRef.current} transition disablePortal
                        placement={"top-end"}>
                            {({TransitionProps, placement}) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                }}>
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleButtonDropdownClose}>
                                            <MenuList>
                                                {props.projectState.type === "annotate" &&
                                                    activeProject?.allowManualEscalationToCurator &&
                                                    <StyledMenuItem key={"Ask curator"}
                                                                onClick={() => {
                                                                    alert("not implemented")
                                                                    setOpen(false)
                                                                }}
                                                                disabled={isSendingDocument}>
                                                    <ListItemIcon>
                                                        <ContactSupportIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={props.localize("annotateView.askCurator")}/>
                                                </StyledMenuItem>}
                                                <StyledMenuItem key={"Skip"}
                                                                onClick={() => {
                                                                    if(activeDocument != null) {
                                                                        props.skipDocument(activeDocument.projectID,
                                                                            activeDocument.documentID)
                                                                    }
                                                                    setOpen(false)
                                                                }}
                                                                disabled={isSendingDocument}>
                                                    <ListItemIcon>
                                                        <SkipNext fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={props.localize("annotateView.skip")}/>
                                                </StyledMenuItem>
                                                <StyledMenuItem key={"Reset"}
                                                                onClick={() => {
                                                                    if(activeDocument != null) {
                                                                        props.resetAnnotations(activeDocument.projectID,
                                                                            activeDocument.documentID)
                                                                    }
                                                                    setOpen(false)
                                                                }}
                                                                disabled={isSendingDocument}>
                                                    <ListItemIcon>
                                                        <Clear fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={props.localize("annotateView.reset")} />
                                                </StyledMenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </Grid>
                </Grid>
            </div>
        }
    </div>
}

export default withWidth()(withLocalization((AnnotateView)));
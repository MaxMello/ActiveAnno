import React, { Component } from "react";
import {Typography, withStyles} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import {withLocalization} from "react-localize";
import Grid from '@material-ui/core/Grid';
import {LayoutAreaTypes} from "../../../constants/LayoutAreaTypes";
import {grey} from "@material-ui/core/colors";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {createIllustrationComponent} from "../../helper/LayoutMapper";
import type {AnnotationConfigFull, AnnotationDocument, DocumentToAnnotate} from "../../../types/AnnotationTypes";
import type {LayoutAreaType, Row} from "../../../types/LayoutConfigTypes";

type DocumentDataPanelProps = {
    config: AnnotationConfigFull,
    document: DocumentToAnnotate
};

const style: Function = (theme: Object): Object => {
    return ({
        wrapper: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            flexWrap: 'nowrap'
        },
        panel: {
            maxWidth: 1280,
            backgroundColor: 'white',
            margin: `${theme.spacing(2)}px !important`,
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            flexGrow: 1,
            fontWeight: 400,
            [theme.breakpoints.down('xs')]: {
                marginTop: theme.spacing(1),
            },
        },
        panelSummary: {

        },
        panelDetails: {
            display: 'flex',
            flexWrap: 'wrap'
        },
        row: {
            paddingBottom: theme.spacing(1),
            paddingTop: theme.spacing(1)
        },
        column: {
            alignContent: 'center',
            paddingRight: theme.spacing(1),
            paddingLeft: theme.spacing(1),
        },
        divider: {
            backgroundColor: grey[200]
        },
        defaultTypography: {
            fontWeight: 'inherit'
        },
        bold: {
            fontWeight: 500,
            display: 'inline'
        },
        italic: {
            fontStyle: 'italic'
        },
        interactiveIcon: {
            bottom: 2,
        },
        nonInteractiveIcon: {
            bottom: 2,
            '&:hover': {
                backgroundColor: 'transparent',
                cursor: 'auto'
            }
        },
        documentTextInputField: {
            fontWeight: 'inherit',
            color: 'inherit',
            fontStyle: 'inherit'
        },
        popoverContent: theme.defaultPopoverContent
    });
};


class DocumentDataPanel extends Component<DocumentDataPanelProps> {

    constructor(props) {
        super(props);
        this.state = {
            panelHeaderText: props.localize('datapanel.defaultTitle'),
            expanded: true
        };
    }

    createRow(layoutAreaType: LayoutAreaType, document: AnnotationDocument, row: Row, rowIndex: number, key: string) {
        return <Grid container className={this.props.classes.row}
                      key={`${key}Row${rowIndex}`}>
            {row.cols.map((c, columnIndex) => {
                return <Grid item
                              xs={c.width.xs ? c.width.xs : undefined}
                              sm={c.width.sm ? c.width.sm : undefined}
                              md={c.width.md ? c.width.md : undefined}
                              lg={c.width.lg ? c.width.lg : undefined}
                              xl={c.width.xl ? c.width.xl : undefined}
                              className={this.props.classes.column}
                              key={`${key}Row${rowIndex}Column${columnIndex}`}>
                    {c.children.map((child, index) => {
                        return createIllustrationComponent(child, document.documentData, `${key}Row${rowIndex}Column${columnIndex}Element${index}`)
                    })}
                </Grid>
            })}
        </Grid>;
    }

    render() {
        const config = this.props.config;
        if(!config.layout || !(LayoutAreaTypes.COMMON in config.layout.layoutAreas)) {
            return null;
        }
        const document = this.props.document;
        const panel = [];
        panel.push(
            config.layout.layoutAreas[LayoutAreaTypes.COMMON].rows.map((r, rowIndex) => {
                return [
                    this.createRow(LayoutAreaTypes.COMMON, document, r, rowIndex, `config${config.id}Document${document.documentID}LayoutCommonPanel`),
                    (rowIndex < (config.layout.layoutAreas[LayoutAreaTypes.COMMON].rows.length - 1) ? <Divider variant={'fullWidth'} className={this.props.classes.divider} key={`config${config.id}Document${document.documentID}Divider${rowIndex}`}/> : null)
                ];
            })
        );
        return <div className={this.props.classes.wrapper}>
            <ExpansionPanel defaultExpanded={true}  className={this.props.classes.panel} onChange={(_, expanded) => {
                this.setState({
                    expanded: expanded,
                    panelHeaderText: expanded ? this.props.localize('datapanel.defaultTitle') : `"${this.props.document.documentData["DOCUMENT_TEXT"]}"`
                })
            }}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} className={this.props.classes.panelSummary} >
                    <Typography variant={this.state.expanded ? "h5" : "body1"}>{this.state.panelHeaderText}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={this.props.classes.panelDetails}>
                    {panel}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>;
    }
}

export default withLocalization(withStyles(style)(DocumentDataPanel));
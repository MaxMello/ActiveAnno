// @flow
import React, {Component} from "react";
import {Typography, withStyles} from "@material-ui/core";
import {withLocalization} from "react-localize";
import Grid from '@material-ui/core/Grid';
import type {LayoutAreaType} from "../../../constants/LayoutAreaTypes";
import {LayoutAreaTypes} from "../../../constants/LayoutAreaTypes";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {createIllustrationComponent} from "../../helper/LayoutMapper";
import type {AnnotateProject} from "../../../types/annotate/DTOTypes";
import type {AnnotationDocumentInState} from "../../../types/redux/annotate/AnnotationDataState";
import type {Row} from "../../../types/project/layout/Layout";
import type {WithLocalizationComponentProps, WithStylesComponentProps} from "../../../types/Types";
import type {AnalyzedDocument} from "../../../types/manage/AnalyzeProjectResultsTypes";

type DocumentDataPanelProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    project: AnnotateProject,
    document: AnnotationDocumentInState | AnalyzedDocument
};

type DocumentDataPanelState = {
    panelHeaderText: string,
    expanded: boolean
}

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
            margin: `${theme.spacing(1)}px !important`,
            flexGrow: 1,
            fontWeight: 400
        },
        panelDetails: {
            display: 'flex',
            flexWrap: 'wrap'
        },
        expansionPanelSummary: {
            padding: theme.spacing(0, 2, 0, 2)
        }
    });
};

/**
 * Display "COMMON" Layout area, mainly the documents text and metadata.
 */
class DocumentDataPanel extends Component<DocumentDataPanelProps, DocumentDataPanelState> {

    constructor(props) {
        super(props);
        this.state = {
            panelHeaderText: props.localize('datapanel.defaultTitle'),
            expanded: true
        };
    }

    createRow(layoutAreaType: LayoutAreaType, document: AnnotationDocumentInState, row: Row,
              rowIndex: number, key: string) {
        return <Grid container spacing={1}
                      key={`${key}Row${rowIndex}`}>
            {row.cols.map((c, columnIndex) => {
                return <Grid item
                              xs={c.width.xs ? c.width.xs : undefined}
                              sm={c.width.sm ? c.width.sm : undefined}
                              md={c.width.md ? c.width.md : undefined}
                              lg={c.width.lg ? c.width.lg : undefined}
                              xl={c.width.xl ? c.width.xl : undefined}
                              key={`${key}Row${rowIndex}Column${columnIndex}`}>
                    {c.children.map((child, index) => {
                        return createIllustrationComponent(child, document.documentData,
                            `${key}Row${rowIndex}Column${columnIndex}Element${index}`)
                    })}
                </Grid>
            })}
        </Grid>;
    }

    render() {
        const project = this.props.project;
        if(!project.layout || !(LayoutAreaTypes.COMMON in project.layout.layoutAreas)) {
            return null;
        }
        const document = this.props.document;
        const panel = [];
        panel.push(
            // $FlowIgnore
            project.layout.layoutAreas[LayoutAreaTypes.COMMON].rows.map((r, rowIndex) => {
                return this.createRow(LayoutAreaTypes.COMMON, document, r, rowIndex,
                    `project${project.id}Document${document.documentID}LayoutCommonPanel`);
            })
        );
        return <div className={this.props.classes.wrapper}>
            <ExpansionPanel defaultExpanded={true}  className={this.props.classes.panel} onChange={(_, expanded) => {
                this.setState({
                    expanded: expanded,
                    panelHeaderText: expanded ? this.props.localize('datapanel.defaultTitle')
                        : `"${this.props.document.documentData["DOCUMENT_TEXT"]}"`
                })
            }}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} classes={{
                    root: this.props.classes.expansionPanelSummary
                }}>
                    <Typography variant={this.state.expanded ? "h5" : "body1"}>{this.state.panelHeaderText}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{root: this.props.classes.panelDetails}}>
                    {panel}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>;
    }
}

export default withLocalization(withStyles(style)(DocumentDataPanel));
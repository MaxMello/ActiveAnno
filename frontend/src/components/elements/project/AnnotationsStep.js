// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withLocalization} from "react-localize";
import type {
    WithLocalizationComponentProps,
    WithStylesComponentProps
} from "../../../types/Types";
import {Grid, OutlinedInput} from "@material-ui/core";
import InteractionComponentWrapper from "../interaction/InteractionComponentWrapper";
import Select from "@material-ui/core/Select";
import OverflowMenuItem from "../OverflowMenuItem";
import FormControl from "@material-ui/core/FormControl";
import type {Annotations} from "../../../types/AnnotationConfigTypes";
import {AnnotationType} from "../../../constants/AnnotationType";


type AnnotationsStepProps = WithStylesComponentProps & WithLocalizationComponentProps & {
    id: string,
    updateConfigValue: Function,
    isNewConfig: boolean,
    annotations: Annotations
};

const style: Function = (theme: Object): Object => ({
    dropDown: {
        width: '100%',
        flexGrow: 1
    },
    defaultFormControl: theme.defaultFormControl,
});

function annotationView(type: string) {
    switch(type) {
        case AnnotationType.BooleanAnnotation: return null;
        case AnnotationType.ClosedNumberAnnotation: return null;
        case AnnotationType.NumberRangeAnnotation: return null;
        case AnnotationType.OpenNumberAnnotation: return null;
        case AnnotationType.OpenTagAnnotation: return null;
        case AnnotationType.OpenTextAnnotation: return null;
        case AnnotationType.PredefinedTagSetAnnotation: return null;
    }
}

class AnnotationsStep extends Component<AnnotationsStepProps> {

    render() {
        console.log(this.props.annotations);
        const existingAnnotationsView = Object.values(this.props.annotations.annotationMap).map(a => {
            return this.renderAnnotationView(a.type)
        });
        const addAnnotationView = this.addAnnotationView();
        return <Grid container spacing={4}>
            {
                existingAnnotationsView
            }
            {
                addAnnotationView
            }
        </Grid>;
    }

    renderAnnotationView(type: string) {
        return <div></div>;
    }

    addAnnotationView() { return <Grid item xs={12}>
            <InteractionComponentWrapper name={this.props.localize('project.annotations.add.name')}
                                         caption={this.props.localize('project.annotations.add.caption')}
                                         validationErrors={""}
                                         keyValue={"projectConfigAddAnnotation"}>
                <FormControl className={this.props.classes.dropDown} variant="outlined">
                    <Select onChange={e => annotationView(e)}
                            input={<OutlinedInput notched={false} labelWidth={50} name="addAnnotation"/>}>
                        {
                            Object.values(AnnotationType).map(t => {
                                return <OverflowMenuItem value={t}>
                                    {this.props.localize(`project.annotation.type.${t}`)}
                                </OverflowMenuItem>
                            })
                        }

                    </Select>
                </FormControl>
            </InteractionComponentWrapper>
        </Grid>
    }
}

export default withLocalization(withStyles(style)(AnnotationsStep));
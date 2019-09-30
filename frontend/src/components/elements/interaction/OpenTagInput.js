import {makeStyles} from "@material-ui/core";
import React from "react";
import type {AnnotationInteractionProps, Annotations} from "../../../types/Types";
import ChipInput from 'material-ui-chip-input'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {CaseBehavior} from "../../../constants/CaseBehavior";
import InteractionComponentWrapper from "./InteractionComponentWrapper";

const useStyles = makeStyles(theme => ({
    interactionCaption: theme.interactionCaption,
    chipInput: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    interactionHeader: theme.interactionHeader
}));

function createCaption(annotationConfig: Annotations, referenceAnnotation: string, localize: Function): string {
    const isMultiSelect = annotationConfig[referenceAnnotation].maxNumberOfTags > 1;
    const isOptional = annotationConfig[referenceAnnotation].minNumberOfTags < 1;
    if(isMultiSelect && isOptional) {
        return `${localize('card.multiSelect')} (${localize('card.maxAnswers')}: ${annotationConfig[referenceAnnotation].maxNumberOfTags}) - (${localize('card.optional')})`;
    } else if(isMultiSelect && !isOptional) {
        return `${localize('card.multiSelect')} (${localize('card.maxAnswers')}: ${annotationConfig[referenceAnnotation].maxNumberOfTags})`;
    } else if(!isMultiSelect && isOptional) {
        return `(${localize('card.optional')})`;
    } else {
        return null;
    }
}

function applyCaseBehavior(behavior, chipText: string): string {
    if(behavior === CaseBehavior.KEEP_ORIGINAL) {
        return chipText;
    } else if(behavior === CaseBehavior.TO_LOWER) {
        return chipText.toLowerCase();
    } else if(behavior === CaseBehavior.TO_UPPER) {
        return chipText.toUpperCase();
    } else if(behavior === CaseBehavior.CAPITALIZE) {
        return chipText.length > 0 ? chipText.charAt(0).toUpperCase() + chipText.slice(1) : chipText;
    } else {
        return chipText;
    }
}

/**
 * Interaction type that accepts potentially multiple open input texts, but with predefined tags as suggestions to reduce too similar but different tags.
 * NOTE: This component uses an additional library that still needs an old version of material UI, if that is ever updated, please migrate and remove the
 * <MuiThemeProvider> wrapper as well as the dependency to the old version of material ui.
 */
export default function OpenTagInput(props: AnnotationInteractionProps) {
    const classes = useStyles();
    let currentValues = props.annotations[props.element.referenceAnnotation] ? props.annotations[props.element.referenceAnnotation].value : [];

    return <InteractionComponentWrapper name={props.annotationConfig[props.element.referenceAnnotation].name}
                                        caption={createCaption(props.annotationConfig, props.element.referenceAnnotation, props.localize)}
                                        validationErrors={props.validationErrors}
                                        key={props.keyValue} keyValue={props.keyValue}>
        <MuiThemeProvider><ChipInput
            className={classes.chipInput}
            value={currentValues}
            onAdd={(chip) => {
                if(!props.annotationConfig[props.element.referenceAnnotation].maxNumberOfTags || currentValues.length < props.annotationConfig[props.element.referenceAnnotation].maxNumberOfTags) {
                    currentValues.push(applyCaseBehavior(props.annotationConfig[props.element.referenceAnnotation].caseBehavior, chip.trim()));
                    props.setAnnotationValue(props.configID, props.documentID, props.element.referenceAnnotation, currentValues); // TODO span
                }
            }}
            onDelete={(chip) => {
                currentValues = currentValues.filter(c => c !== chip);
                props.setAnnotationValue(props.configID, props.documentID, props.element.referenceAnnotation, currentValues); // TODO span
            }}
            allowDuplicates={false}
            dataSource={props.annotationConfig[props.element.referenceAnnotation].predefinedTags}
            fullWidth={true}
            newChipKeyCodes={[13, 9]}
            id={props.keyValue}
        /></MuiThemeProvider>
    </InteractionComponentWrapper>;
}
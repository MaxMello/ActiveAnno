import type {Column, Layout} from "../../types/project/layout/Layout";
import {AnnotationDefinition} from "../../constants/AnnotationDefinition";
import type {Dictionary} from "../../types/Types";
import type {TargetType} from "../../redux/annotate/annotationData";
import {Target} from "../../redux/annotate/annotationData";
import {LayoutAreaTypes} from "../../constants/LayoutAreaTypes";
import type {DenormalizedActionElement, LayoutElement} from "../../types/project/layout/LayoutElement";
import {ActionElements} from "../../constants/LayoutElement";

/**
 * Build object of target to annotationDefinitions from the denormalized layout elements
 */
export function getAnnotationDefinitionsFromLayout(layout: Layout):
    Dictionary<TargetType, Array<AnnotationDefinition>> {
    const dictionary = {};
    layout.layoutAreas[LayoutAreaTypes.DOCUMENT_TARGET].rows.forEach(row => {
        row.cols.forEach((col: Column) => {
            col.children.forEach((child: LayoutElement) => {
                if (Object.values(ActionElements).includes(child.type)) {
                    const actionElement: DenormalizedActionElement = (child: any);
                    dictionary[Target.DOCUMENT] ? dictionary[Target.DOCUMENT].push(actionElement.annotationDefinition)
                        : dictionary[Target.DOCUMENT] = [actionElement.annotationDefinition];
                }
            })
        })
    });
    return dictionary;
}
// @flow
import type {ProjectID} from "../Types";
import type {Layout} from "./layout/Layout";
import type {HandlingPolicy} from "../manage/AnnotationSchema";

export type UsedAnnotateProject = {|
    id: ProjectID,
    name: string,
    description: string,
    priority: number,
    layout: Layout,
    allowManualEscalationToCurator: Boolean,
    generatedAnnotationResultHandlingPolicy: HandlingPolicy
|}
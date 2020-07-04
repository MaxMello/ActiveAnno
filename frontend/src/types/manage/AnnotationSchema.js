import type {AnnotationID} from "../Types";
import type {Target} from "../annotationdefinition/target/Target";


export type AnnotationSchema = {|
    elements: Array<AnnotationSchemaElement>,
    generatedAnnotationResultHandling: GeneratedAnnotationResultHandling
|};

export type AnnotationSchemaElement = {|
    annotationDefinitionID: AnnotationID,
    target: Target
|};

export type GeneratedAnnotationResultHandling = {|
    handlingPolicy: HandlingPolicy,
    updateGeneratedAnnotationDataOnNewVersion: boolean,
    generatorTiming: GeneratorTiming
|};

export type HandlingPolicy = {|
    type: "Ignore" | "Preselection" | "GeneratorAsAnnotator",
    showProbabilities?: boolean, // Only Preselection,
    preferDocumentsWithGeneratedAnnotations?: boolean // only Preselection
|};

export type GeneratorTiming = {|
    type: "Never" | "Always" | "OnGetDocumentRequest" | "OnGenerateMissingAnnotationsRequest"
|};

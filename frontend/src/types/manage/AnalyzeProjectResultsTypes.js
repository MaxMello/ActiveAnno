import type {AnnotationID, AnnotationMap, Dictionary, DocumentID, ProjectID, UserIdentifier} from "../Types";
import type {FilterCondition, Policy} from "./ManageTypes";
import type {AnnotationResultCreator} from "../document/annotation/AnnotationResultCreator";
import type {AnnotateProject} from "../annotate/DTOTypes";


export type AnalyzeProjectRequest = {|
    projectID: ProjectID,
    annotators: Array<string>,
    curators: Array<string>,
    finalizedBefore: ?number,
    finalizedAfter: ?number,
    ignoreDocumentIDs: Array<DocumentID>,
    ignoreAnnotationResultIDs: Array<string>,
    generatedAnnotationResultHandlingPolicyType: "Ignore" | "Preselection" | "GeneratorAsAnnotator" | null,
    onlyGeneratorIncorrect: boolean,
    onlyAnnotatorDisagreement: boolean,
    onlyAnyAnnotatorIncorrect: boolean,
    additionalFilter: ?FilterCondition
|};

export type AnalyzeProjectResponse = {|
    projectID: string,
    analyzedDocuments: Array<AnalyzedDocument>,
    topLevelStatistics: ?TopLevelStatistics,
    annotateProject: AnnotateProject,
    annotationNames: Dictionary<AnnotationID, string>,
    userNames: Dictionary<UserIdentifier, string>,
    errorMessage: ?string
|};

export type TopLevelStatistics = {|
    documentAccuracyStatistics: AccuracyStatistics,
    perAnnotationAccuracyStatistics: Dictionary<AnnotationID, AccuracyStatistics>,
    perAnnotatorAverageFullDuration: Dictionary<UserIdentifier, TimeWrapper>,
    averageAnnotatorFullDuration: number,
    perAnnotatorAverageInteractionDuration: Map<UserIdentifier, TimeWrapper>,
    averageAnnotatorInteractionDuration: number
|};

export type AccuracyStatistics = {|
    interAnnotatorAgreement: PercentageWrapper,
    annotatorAccuracy: Dictionary<UserIdentifier, PercentageWrapper>,
    averageAnnotatorAccuracy: number,
    generatorAccuracy: ?PercentageWrapper
|};

export type AnalyzedDocument = {|
    documentID: DocumentID,
    storeTimestamp: number,
    documentData: Dictionary<String, any>,
    documentStatistics: DocumentStatistics,
    perAnnotationStatistics: Dictionary<AnnotationID, DocumentStatistics>,
    analyzedAnnotationResults: Array<AnalyzedAnnotationResult>,
    finalizedAnnotationResult: FinalizedAnnotationResultForAnalysis
|};

export type DocumentStatistics = {|
    annotatorCorrectness: Dictionary<UserIdentifier, boolean>,
    annotatorsAgree: boolean,
    generatorCorrect: ?boolean
|};

export type PercentageWrapper = {|
    absolute: number,
    n: number,
    percentage: number
|};

export type TimeWrapper = {|
    average: number,
    n: number
|};


export type AnalyzedAnnotationResult = {|
    annotationResultID: string,
    timestamp: number,
    annotations: AnnotationMap,
    creator: AnnotationResultCreator,
    fullDuration: ?number,
    interactionDuration: ?number
|};

export type FinalizedAnnotationResultForAnalysis = {|
    annotationResultIDs: Array<String>,
    finalizedReason: {|
        type: "Policy" | "Curator",
        curator: ?UserIdentifier    // Only curator
    |},
    usedPolicy: Policy,
    timestamp: number
|};
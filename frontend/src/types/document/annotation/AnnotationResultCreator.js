// @flow

export type Annotator = {|
    type: "Annotator",
    displayName: string
|}

export type Curator = {|
    type: "Curator",
    displayName: string
|}

export type Generators = {|
    type: "Generators",
    displayName: string
|}

export type Import = {|
    type: "Import",
    displayName: string
|}

export type Consensus = {|
    type: "Consensus",
    displayName: string
|}

export type AnnotationResultCreator = Annotator | Curator | Generators | Import | Consensus;

export const AnnotationResultCreatorTypes = {
    ANNOTATOR: "Annotator",
    CURATOR: "Curator",
    GENERATORS: "Generators",
    IMPORT: "Import",
    CONSENSUS: "Consensus"
}

// @flow
import type {Dictionary} from "../Types";

/**
 * Type that holds information for GET parameters to further filter / select documents to query
 */
export type DocumentSelectionParameters = {|
    subFilter: Dictionary<string, string>,
    dateFilterFrom: ?string,
    dateFilterTo: ?string
|}
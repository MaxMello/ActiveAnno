// @flow

export type DocumentSelection = {|
    subFilter: Array<SubFilter>,
    dateRangeFilter: ?DateRangeFilter
|};

export type SubFilter = {|
    key: string,
    displayName: string,
    selectionType: SelectionType,
    options?: Array<SubFilterOption>
|};

export type SubFilterOption = {|
    value: string,
    count: number
|}

export type SelectionType = 'AGGREGATE_ALL_VALUES' | 'INPUT_FIELD';

export type DateRangeFilter = {
    dateKey: string,
    dateFormat: ?string
}
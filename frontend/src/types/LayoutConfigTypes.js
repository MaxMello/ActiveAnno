
export type ColumnSizes = {
    xs?: number, // 1 - 12 parallel to material UI cols for all sizes
    sm?: number,
    md?: number,
    lg?: number,
    xl?: number
}

export type Column = {
    width: ColumnSizes,
    children: Array<Object>
}

export type Row = {
    cols: Array<Column>
}

export type LayoutAreaType = 'Common' | 'SharedTarget' | 'DocumentTarget' | 'SpanTarget';

export type LayoutArea = {
    id: LayoutAreaType,
    rows: Array<Row>
}

export type Layout = {
    layoutAreas: Map<LayoutAreaType, LayoutArea>,
    exampleDocument: Object // Frontend only
}
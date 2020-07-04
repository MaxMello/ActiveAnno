// @flow
import type {LayoutElement} from "./LayoutElement";
import type {LayoutAreaType} from "../../../constants/LayoutAreaTypes";
import type {AnyObject, Dictionary} from "../../Types";

export type ColumnSizes = {|
    xs?: number, // 1 - 12 parallel to material UI cols for all sizes
    sm?: number,
    md?: number,
    lg?: number,
    xl?: number
|}

export type Column = {|
    width: ColumnSizes,
    children: Array<LayoutElement>
|}

export type Row = {|
    cols: Array<Column>
|}


export type LayoutArea = {|
    id: LayoutAreaType,
    rows: Array<Row>
|}

export type Layout = {|
    layoutAreas: Dictionary<string, LayoutArea>,
    exampleDocument: ?AnyObject // Frontend only
|}
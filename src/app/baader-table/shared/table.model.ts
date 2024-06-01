
/**
 * Use this string to create a tracking entry for row data.
 */
export const TABLE_INDEX_COLUMN_NAME = '__index';

/**
 * Describe sorting state of a column
 */
export enum ColumnSort {
    NONE = 0,
    DESC = 1,
    ASC = 2
}

/**
 * Used to describe columns, preferred display names in header column, and to describe the dataType in the column.
 */
export interface ColumnSpec {
    name: string;
    displayName: string;
    dataType?: string;
}

/**
 * The following interfaces represent the state of the data viewed,
 * I.e. by which column they are sorted or filtered, what range of the data is looked at (i.e. based on pagination).
 */
export interface SortState {
    column: string;
    mode: ColumnSort;
}

export interface FilterState {
    column: string;
    filter: string;
}

export interface RangeState {
    start: number;
    length: number;
}

/**
 * A TableSpect describes a table by it's columns i.e. a set of ColumnSpecs 
 */
export type TableSpec = Record<string, ColumnSpec>

/**
 * A table row is a set of key value pairs with these possible value types.
 */
export type TableRow = Record<string, string | number | boolean | null>;

/**
 * A Table is the combination of row data data and description of it's columns
 */
export interface Table {
    spec: TableSpec;
    data: TableRow[];
    url?: string;
}

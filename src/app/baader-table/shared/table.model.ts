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
    sort?: ColumnSort;
}

/**
 * The following interfaces represent the state of the data viewed,
 * I.e. by which column they are sorted or filtered, what range of the data is looked at (i.e. based on pagination).
 */
export interface SortState {
    column: string;
    sort: ColumnSort;
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
 * A table is described by a TableSpec, i.e. a set of ColumnSpecs 
 */
export type TableSpec = Record<string, ColumnSpec>

/**
 * A table row is a set of key value pairs with these possible value types.
 */
export type TableRow = Record<string, string | number | boolean | null>;
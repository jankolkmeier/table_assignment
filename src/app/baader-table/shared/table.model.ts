
/**
 * Use this string to create a tracking entry for row data.
 */
export const TABLE_INDEX_COLUMN_NAME = '__index';

/**
 * Describe sorting state of a column.
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
    /**
     * The property name of the row
     */
    name: string;

    /**
     * The name to display in the header
     */
    displayName: string;

    /**
     * The data type of the column data. May be used in the future for input validation. Currently not in use.
     */
    dataType?: string;
}

/**
 * The following interfaces represent the state of the data viewed,
 * I.e. by which column they are sorted or filtered, what range of the data is looked at (i.e. based on pagination).
 */

/**
 * Represents how a table is sorted. 
 */
export interface SortState {
    /**
     * The column to sort by (empty string means default sorting)
     */
    column: string;

    /**
     * The direction to sort in.
     */
    mode: ColumnSort;
}

/**
 * Represents the search function state of a TableView
 */
export interface FilterState {
    /**
     * The column to search in (search through all columns if empty string)
     */
    column: string;

    /**
     * The search string to filter on.
     */
    filter: string;
}

/**
 * Represents the range of data a table is looking at.
 */
export interface RangeState {
    /**
     * The index of the first row to look at.
     */
    start: number;

    /**
     * The number of rows to show after.
     */
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
 * A Table is the combination of row data data and description of it's columns.
 * Optionally, the data source url can be stored.
 */
export interface Table {
    spec: TableSpec;
    data: TableRow[];
    url?: string;
}

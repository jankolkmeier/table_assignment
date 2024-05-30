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
    filter?: string;
}

/**
 * A table is described by a TableSpec, i.e. a set of ColumnSpecs 
 */
export type TableSpec = Record<string, ColumnSpec>

/**
 * A table row is a set of key value pairs with these possible value types.
 */
export type TableRow = Record<string, string | number | boolean | null>;
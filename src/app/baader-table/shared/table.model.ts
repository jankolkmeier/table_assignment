
export interface ColumnSpec {
    name: string;
    dataType: string;
}

export type TableSpec = Record<string, ColumnSpec>
export type TableRow = Record<string, string | number | boolean | null>;
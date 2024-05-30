import { ColumnSpec, TableSpec, TableRow, ColumnSort } from "./table.model";


/**
 * Reusable static methods for working with table data
 */
export class TableUtils {

  /**
   * Return a flattened version of an object, such that all properties in o['a']['b']['c'] are
   * properties o['a.b.c'] in the result
   * @param o An object to flatten.
   * @returns A flattened copy of the object of type TableRow
   */
  static flattenObjectToRow(o: object): TableRow {
    const o_flat: TableRow = {};
    for (const key of Object.keys(o) as (keyof typeof o)[]) {
      // This will flatten arrays and objects alike
      if (typeof (o[key]) === 'object' && o[key] !== null) {
        const nested = TableUtils.flattenObjectToRow(o[key]);
        // nestedKey is either property name of object or index of array.
        for (const nestedKey of Object.keys(nested)) {
          o_flat[`${key}.${nestedKey}`] = nested[nestedKey];
        }
      } else {
        o_flat[key] = o[key];
      }
    }
    return o_flat;
  }

  /**
   * Infer data types in the table columns by analysing multiple rows of a table
   * @param rows table row data in flattened form (can be a subset of the table).
   * @returns a TableSpec object with an entry for each column by name, describing column data type.
   */
  static inferColumnTypes(rows: TableRow[]): TableSpec {
    const columns: TableSpec = {};
    for (const row of rows) {
      for (const key in row) {
        const dataType = typeof row[key];

        if (row[key] === null) // Do not infer column type from missing data
          continue;

        if (columns[key] === undefined) {
          columns[key] = {
            name: key,
            displayName: key,
            dataType: dataType,
            sort: ColumnSort.NONE
          } as ColumnSpec;
        } else if (columns[key].dataType !== dataType) {
          columns[key].dataType = "mixed";
        }
      }
    }
    return columns;
  }

  /**
   * Generate a sort function that compares TableRows based on property columnName.
   * @param columnName Name of the column to compare in the sort fn
   * @param sortMode Sort direction, either ColumnSort.ASC or ColumnSort.DESC
   * @returns a sort function
   */
  static sortTableFn(columnName: string, sortMode: ColumnSort): (a: TableRow, b: TableRow) => number {
    return (a, b) => {
      const aval = a[columnName];
      const bval = b[columnName];
      let cval = 0;
      if (bval === null && aval === null) {
        cval = 0;
      } else if (aval !== null && bval !== null && aval > bval || aval === null && bval !== null) {
        cval = 1;
      } else if (aval !== null && bval !== null && aval < bval || aval !== null && bval === null) {
        cval = -1;
      }
      return sortMode === ColumnSort.ASC ? cval : -cval;
    }
  }
}
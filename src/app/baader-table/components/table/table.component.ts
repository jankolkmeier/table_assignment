import { Component, Input } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { TableDataService } from '../../services/table-data.service';
import { ColumnSpec, TableRow, ColumnSort } from '../../shared/table.model';
import { TableUtils } from '../../shared/table-utils'

/**
 * Table Component for displaying, searching and sorting tables.
 */
@Component({
  selector: 'baader-table',
  standalone: true,
  imports: [KeyValuePipe, CdkTableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {

  @Input()
  set url(url: string) {
    this.updateDataSource(url);
  }

  @Input()
  set data(data: object[]) {
    this.prepareTable(data);
  }

  @Input()
  set columns(columns: ColumnSpec[]) {
    if (columns) {
      this.setDisplayColumns(columns);
    }
  }

  _url?: string;
  _displayColumns?: ColumnSpec[];
  _displayColumnNames?: string[]

  _data: TableRow[] | null = null;
  _error: string | null = null;

  constructor(private dataService: TableDataService) { }

  /**
   * Sets the objects required for rendering the table based on the selected columns to Display.
   * @param columns Columns to display as list of column specifications (holding the 'name' of column and 'displayName' for the header).
   */
  setDisplayColumns(columns: object[]) {
    this._displayColumns = columns as ColumnSpec[];
    this._displayColumnNames = this._displayColumns.map((col) => col.name);
  }

  /**
   * Set the data source of the table and fetch the data.
   * @param url 
   */
  updateDataSource(url: string) {
    this._url = url;
    this.fetchData();
  }

  /**
   * Fetches the data from url & updates the table.
   */
  fetchData() {
    if (!this._url) {
      console.warn("Data source not set, not fetching data.");
      return;
    }
    this.dataService.getTableData$(this._url).subscribe({
      next: (data) => {
        this.prepareTable(data);
      },
      error: (e) => {
        this._error = `Failed to fetch data from url ${this.url}`;
        console.error(e);
      }
    });
  }
  /**
   * TrackBy function for data. Good practice with large datasets to help with performance.
   * @param index index in data
   * @param row element
   * @returns the unique __index property set in prepareTable
   */
  trackTableIndex(index: number, row: TableRow) {
    return row["__index"];
  }

  /**
   * Given new table data, infer columnTypes and set up default columns to display.
   * Also sets up a unique index for tracking.
   * @param data Table data
   */
  prepareTable(data: object[]): void {
    this._data = data.map(TableUtils.flattenObjectToRow);
    for (let idx = 0; idx < this._data.length; idx++) {
      this._data[idx]["__index"] = idx;
    }

    const tableSpec = TableUtils.inferColumnTypes(this._data);

    if (!this._displayColumns) {
      // Display all columns if none selected
      this.setDisplayColumns(Object.values(tableSpec));
    } else {
      // Merge user configured column settings with inferred column specs
      this._displayColumns = this._displayColumns.map((colspec: ColumnSpec) => {
        Object.assign(tableSpec[colspec.name], colspec);
        return tableSpec[colspec.name];
      });
    }
  }

  /**
   * TODO: 
   *  - Refactor the sorting functions to be able to either toggle or set the sorting setting 
   *    of a given column
   *  - Then make function that sorts the table based on the current sorting state (no parameters)
   *    to allow users of the component to provide a default sorting direction in the columns parameter.
   */

  /**
   * Update sorting state by going through column specifications and toggling the current 
   * sorting mode of the column provided
   * @param columnName name of column to change sort mode on
   */
  toggleSortMode(columnName: string) {
    // Get total number of sort modes (used for modulo operation when toggling)
    const n_sort_modes = Object.keys(ColumnSort).length / 2;
    let spec: ColumnSpec | null = null;
    let mode: ColumnSort = ColumnSort.NONE;

    if (!this._data || !this._displayColumns)
      return;

    for (const col of this._displayColumns) {
      // Reset sort state for all other rows
      if (col.name === columnName) {
        spec = col;
      } else {
        col.sort = ColumnSort.NONE;
      }
    }

    // Found column to sort on
    if (spec !== null) {
      spec.sort = spec.sort === undefined ? ColumnSort.ASC : ++spec.sort % n_sort_modes;
      mode = spec.sort;
    }

    // If column is unknown or we revert to not sort on the given column...
    if (spec === null || mode == ColumnSort.NONE) {
      // Just return to sorting the data based on how we originally have gotten it.
      mode = ColumnSort.ASC;
      columnName = "__index";
    }

    this.sortTable(columnName, mode);
  }

  /**
   * Sort our table based on the column name and direction
   * @param columnName name of column to sort on
   * @param mode sort mode - either ColumnSort.ASC or ColumnSort.DESC 
   */
  sortTable(columnName: string, mode: ColumnSort) {
    if (!this._data)
      return;
    this._data.sort(TableUtils.sortTableFn(columnName, mode));
    this._data = [...this._data];
  }
}

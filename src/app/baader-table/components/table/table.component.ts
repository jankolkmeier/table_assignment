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

    for (let idx = 0; idx < this._data.length; idx++) {
      this._data[idx]["__index"] = idx;
    }
  }

  /**
   * 
   */
  toggleSortMode(columnName: string) {
    // Get total number of sort modes (used for modulo operation when toggling)
    const n_sort_modes = Object.keys(ColumnSort).length / 2;
    if (!this._displayColumns)
      return;
    for (const col of this._displayColumns) {
      // Reset sort state for all other rows
      if (col.name === columnName) {
        // toggle through sort modes. 
        col.sort = col.sort === undefined ? ColumnSort.ASC : ++col.sort % n_sort_modes;
      } else {
        col.sort = ColumnSort.NONE;
      }
    }
  }
}

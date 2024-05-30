import { Component, Input } from '@angular/core';
import { TableDataService } from '../../services/table-data.service';
import { TableSpec, TableRow } from '../../shared/table.model';
import { KeyValuePipe } from '@angular/common';
import { TableUtils } from '../../shared/table-utils'

/**
 * Table Component for displaying, searching and sorting tables.
 */
@Component({
  selector: 'baader-table',
  standalone: true,
  imports: [KeyValuePipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {

  @Input()
  set url(url: string) {
    this.setDataSource(url);
    this.fetchData();
  }

  @Input()
  set data(data: object[]) {
    this.prepareTable(data);
  }

  @Input()
  set columns(columns: string[]) {
    this._displayColumns = columns;
  }

  _url?: string;
  _displayColumns?: string[];

  _data: TableRow[] | null = null;
  _tableSpec: TableSpec | null = null;

  _error: string | null = null;

  constructor(private dataService: TableDataService) { }

  setDataSource(url: string) {
    this._url = url;
  }

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
   * Given new table data, infer columnTypes and set up default columns to display.
   * @param data Table data
   */
  prepareTable(data: object[]): void {
    this._data = data.map(TableUtils.flattenObjectToRow);
    this._tableSpec = TableUtils.inferColumnTypes(this._data);

    if (this._displayColumns === undefined) {
      this._displayColumns = Object.keys(this._tableSpec);
    }
  }

}

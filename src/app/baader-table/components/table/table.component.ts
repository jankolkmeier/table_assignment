import { Component, Input, AfterViewInit, EventEmitter, ViewChild } from '@angular/core';
import { KeyValuePipe, AsyncPipe } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { TableDataService } from '../../services/table-data.service';
import { ColumnSpec, TableRow, ColumnSort, SortState, FilterState, RangeState } from '../../shared/table.model';
import { TableUtils } from '../../shared/table-utils'
import { PaginationComponent } from '../pagination/pagination.component'
import { Observable, merge, of, switchMap } from 'rxjs';

/**
 * Table Component for displaying, searching and sorting tables.
 */
@Component({
  selector: 'baader-table',
  standalone: true,
  imports: [PaginationComponent, KeyValuePipe, AsyncPipe, CdkTableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements AfterViewInit {

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

  @Input()
  set paginate(n_items: number | null) {
    this._paginationItems = n_items;
    // Set default range:
    if (n_items !== null) {
      this.range = {
        start: 0,
        length: n_items
      }
    }
  }

  _paginationItems: number | null = null;
  @ViewChild(PaginationComponent) pagination!: PaginationComponent;

  _url?: string;
  _displayColumns?: ColumnSpec[];
  _displayColumnNames?: string[]
  _data: TableRow[] | null = null;

  _dataFiltered: TableRow[] | null = null;

  _error: string | null = null;

  dataChanged: EventEmitter<TableRow[]> = new EventEmitter<TableRow[]>();
  rangeChanged: EventEmitter<RangeState> = new EventEmitter<RangeState>();
  sortChanged: EventEmitter<SortState> = new EventEmitter<SortState>();
  filterChanged: EventEmitter<FilterState> = new EventEmitter<FilterState>();

  sort: SortState | null = null;
  range: RangeState | null = null;
  filter: FilterState | null = null;

  constructor(private dataService: TableDataService) {
  }

  /**
   * We wait for all child views (such as pagination) to be resolved
   * in AfterViewInit before wiring the events, as some depend on children.
   */
  ngAfterViewInit() {
    // TODO: check which ones make sense to reset the page on:
    /*
    this.sortChanged.subscribe(() => (this.pagination?.setPage(0)));
    this.filterChanged.subscribe(() => (this.pagination?.setPage(0)));
    this.dataChanged.subscribe(() => (this.pagination?.setPage(0)))
    */


    // When any of these events happen, we need to re-filter the data based on the 
    // current page, sort and filter settings.
    merge(
      this.sortChanged,
      this.rangeChanged,
      this.filterChanged,
      this.dataChanged
    )
      .pipe(
        switchMap(() => {
          return this.filterData();
        })
      ).subscribe(data => {
        this._dataFiltered = data;
      });
  }

  /**
   * Apply the configured filters. This is implemented as an async operation as
   * I figured we might 
   * @returns 
   */
  filterData(): Observable<TableRow[]> {
    if (this._data !== null) {
      let filtered = this._data;

      // Filter first
      if (this.filter !== null && this.filter.column) {
        // TODO: Filter rows 
        filtered = filtered.filter((row: TableRow) => {
          if (this.filter && row[this.filter.column]?.toString()) {
            return row[this.filter.column]?.toString().includes(this.filter.filter)
          }
          return false;
        })
      }

      // Then sort remainder
      if (this.sort != null) {
        filtered.sort(TableUtils.sortTableFn(this.sort.column, this.sort.sort));
      }

      // Then Slice
      if (this.range !== null) {
        filtered = filtered.slice(this.range.start, this.range.start + this.range.length);
      }
      return of([...filtered]);
    } else {
      return of([]); //
    }
  }

  /**
   * Set the range of data to be displayed based on the page number.
   * This has no effect if pagination is disabled.
   * @param page page number to look at.
   */
  setPage(page: number) {
    if (this._paginationItems !== null) {
      this.range = {
        start: page * this._paginationItems,
        length: this._paginationItems
      };
    } else {
      this.range = {
        start: 0,
        length: Number.POSITIVE_INFINITY
      };
    }
    this.rangeChanged.emit(this.range);
  }

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
    const newData = data.map(TableUtils.flattenObjectToRow);
    for (let idx = 0; idx < newData.length; idx++) {
      newData[idx]["__index"] = idx;
    }

    const tableSpec = TableUtils.inferColumnTypes(newData);

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

    this._data = newData;
    this.dataChanged.emit(this._data);
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

    this.sort = {
      column: columnName,
      sort: mode
    };
    this.sortChanged.emit(this.sort);
  }
}

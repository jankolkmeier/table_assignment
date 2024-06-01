import { Component, Input, AfterViewInit, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { KeyValuePipe, AsyncPipe, CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TableDataService } from '../../services/table-data.service';
import { ColumnSpec, TableRow, ColumnSort, SortState, FilterState, RangeState, TABLE_INDEX_COLUMN_NAME, Table } from '../../shared/table.model';
import { TableUtils } from '../../shared/table-utils'
import { PaginationComponent } from '../pagination/pagination.component'
import { FilterInputComponent } from '../filter-input/filter-input.component';
import { Observable, debounce, interval, map, merge, of } from 'rxjs';
import { FormsModule } from '@angular/forms';

/**
 * Table Component for displaying, searching and sorting tables.
 */
@Component({
  selector: 'baader-table-view',
  standalone: true,
  imports: [FormsModule, DragDropModule, CommonModule, FilterInputComponent, PaginationComponent, KeyValuePipe, AsyncPipe, CdkTableModule],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.css'
})
export class TableViewComponent implements AfterViewInit, OnInit {

  @Input()
  set url(url: string) {
    this.setDataSource(this.dataService.getTable$(url));
  }

  @Input()
  set data(table: Table) {
    this.setDataSource(of(table));
  }

  @Input()
  set data$(table$: Observable<Table>) {
    this.setDataSource(table$);
  }

  @Input()
  set columns(columns: ColumnSpec[] | null) {
    this.displayColumns = columns;
  }

  @Input() showPaginator = true;
  @Input() showFilter = true;

  @Input() paginatorPosition = 'bottom';
  @Input() filterInputPosition = 'top';

  /* View Customization */
  @Input() sortIcons = ['▤', '▼', '▲'];
  @Input() editRowLabel = '🖫';
  @Input() saveRowLabel = '✎';
  @Input() showErrors = true;
  @Input() loadingText = "Initializing table...";

  @ViewChild(PaginationComponent) paginator!: PaginationComponent;

  dataSource$: Observable<Table> | null = null;

  table: Table | null = null;

  displayColumns: ColumnSpec[] | null = null;
  displayColumnNames: string[] | null = null;
  dataView: TableRow[] | null = null;
  dataFilteredForPaginator = 0;

  error: string | null = null;

  readonly INDEX = TABLE_INDEX_COLUMN_NAME;

  dataChanged: EventEmitter<TableRow[]> = new EventEmitter<TableRow[]>();
  rangeChanged: EventEmitter<RangeState> = new EventEmitter<RangeState>();
  sortChanged: EventEmitter<SortState> = new EventEmitter<SortState>();
  filterChanged: EventEmitter<FilterState> = new EventEmitter<FilterState>();

  editColumnName = '__edit';

  editingRowIndex = -1;

  sort: SortState = {
    mode: ColumnSort.ASC,
    column: this.INDEX
  };
  range: RangeState = {
    start: 0,
    length: 0
  };
  filter: FilterState = {
    filter: "",
    column: ""
  };

  constructor(private dataService: TableDataService) {
  }

  ngOnInit() {
    // At this point either url or data inputs are configured and we can start getting the data.

    // When any of these events happen, we need to re-filter the data based on the 
    // current page, sort and filter settings.
    merge(
      this.sortChanged,
      this.rangeChanged,
      this.filterChanged,
      this.dataChanged
    ).pipe(
      // Debounce these events slightly in case many get triggered in quick succession
      debounce(() => interval(10))
    ).subscribe(() => {
      if (this.table !== null) {
        this.dataView = this.createDataView(this.table.data);
      }
    });

    // Fetch the prepared data. When completed, this will trigger the dataChanged event,
    // which will cause the above pipe to trigger and update the view.
    this.fetchData();
  }

  /**
   * We wait for all child views (such as pagination) to be resolved   
   * in AfterViewInit before wiring the events.
   */
  ngAfterViewInit() {
    // Jump back to first page when we change sort or filter
    this.sortChanged.subscribe(() => (this.paginator?.setPage(0)));
    this.filterChanged.subscribe(() => (this.paginator?.setPage(0)));
    this.dataChanged.subscribe(() => (this.paginator?.setPage(0)));
  }

  /**
   * Is the current output filtered by a search term?
   * @returns true if filtered
   */
  isFiltered() {
    return this.filter.filter !== "";
  }

  /**
   * Is the current view sorting the data by anything else than the default sort order?
   * @returns true if not in default sort order
   */
  isCustomSorted() {
    return this.sort.column !== this.INDEX;
  }

  /**
   * Get the number of items that match the filter (the filtered data before it is subset for pagination).
   * @returns number of items
   */
  currentFilteredItems() {
    return this.dataFilteredForPaginator;
  }

  /**
   * Return a list of content column names that are displayed and part of the data.
   * This should not return columns like __index or __edit.
   * @returns a list of column names
   */
  getFilterColumnNames(): string[] {
    return this.displayColumnNames == null ? [] : this.displayColumnNames?.filter((n) => {
      return this.displayColumns?.some((colspec) => (colspec.name == n));
    });
  }

  /**
   * Apply the configured filters. This is implemented as an async operation as
   * I figured we might 
   * @returns the filtered set
   */
  createDataView(d: TableRow[]): TableRow[] {
    let filtered = d;

    // Filter rows by looking at all rows containing a field that includes the search string
    if (this.isFiltered()) {
      filtered = filtered.filter((row: TableRow) => {
        return Object.keys(row)
          .filter(key => {
            // Search only through displayed columns.
            // If column name is configured in filter state, only search that column.
            return this.getFilterColumnNames().indexOf(key) > -1 && (this.filter.column == "" || key === this.filter.column);
          })
          .some(key => { // Check if any of the search columns in this row contain the search string.
            return this.filter.filter === "" || row[key as string]?.toString().toLowerCase().includes(this.filter.filter.toLowerCase());
          });
      });
    }

    this.dataFilteredForPaginator = filtered.length;

    // Then sort remainder
    if (this.isCustomSorted()) {
      filtered.sort(TableUtils.sortTableFn(this.sort.column, this.sort.mode));
    }

    // Then Slice
    if (this.showPaginator && this.range !== null) {
      filtered = filtered.slice(this.range.start, this.range.start + this.range.length);
    }
    return filtered; // [...filtered?]
  }

  /**
   * Set the range of data to be displayed based on the page number.
   * This has no effect if pagination is disabled.
   * @param page page number to look at.
   */
  setRange(range: RangeState) {
    this.range = range;
    this.rangeChanged.emit(this.range);
  }

  /**
   * Sets the objects required for rendering the table based on the selected columns to Display.
   * Adds the column(s) for additional features of this table component, such as:
   *   - Column for editing a given row.
   *   - Column for reordering / drag & dropping rows.
   * @param columns Columns to display as list of column specifications (holding the 'name' of column and 'displayName' for the header).
   */
  setDisplayColumns(columns: ColumnSpec[]) {
    this.displayColumns = columns;
    this.displayColumnNames = this.displayColumns.map((col) => col.name);
    this.displayColumnNames.unshift(this.editColumnName);
  }

  /**
   * Set the data source. If there already is other data, fetch the new data to replace view.
   * @param t observable of a table object
   */
  setDataSource(t: Observable<Table>) {
    this.dataSource$ = t;
    if (this.table !== null) {
      // Only fetch if table isn't set yet (otherwise fetch is called in ngOnInit)
      this.fetchData();
    }
  }

  /**
   * Fetches the data from url & updates the table.
   */
  fetchData() {
    if (this.dataSource$ === null) {
      this.error = "No data source configured. Set either url or data property.";
      return;
    }

    this.dataSource$.pipe(
      map((table) => {
        this.setTableView(table, this.displayColumns);
        this.table = table;
        this.dataChanged.emit(this.table.data);
      })
    ).subscribe({
      error: (e) => {
        this.error = `Failed to get data from dataSource`;
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
    return row[this.INDEX];
  }

  /**
   * Set up the table view based on an optional view configuration 
   * @param data Table data
   */
  setTableView(table: Table, viewSpec: ColumnSpec[] | null): void {
    if (viewSpec === null) {
      // Display all columns if view configuration is specified
      this.setDisplayColumns(Object.values(table.spec));
    } else {
      // Merge user configured column settings with inferred column specs
      this.setDisplayColumns(viewSpec.map((colspec: ColumnSpec) => {
        Object.assign(table.spec[colspec.name], colspec);
        return table.spec[colspec.name];
      }));
    }
  }

  /**
   * Complete editing row.
   * @param rowIndex of the edited row
   */
  stopEditRow(rowIndex: number) {
    console.log(`Finished editing row ${rowIndex}. New data: `, this.table!.data.filter((r) => (r[this.INDEX] === rowIndex)));
    this.editingRowIndex = -1;
  }

  /**
   * Start/stop editing a row. If another one was edited, stop it first, then start editing the new row.
   * @param rowIndex of the row to start/stop editing row
   */
  toggleEditRow(rowIndex: number) {
    if (this.editingRowIndex == rowIndex) {
      this.stopEditRow(rowIndex);
    } else {
      if (this.editingRowIndex >= 0)
        this.stopEditRow(this.editingRowIndex);
      this.editingRowIndex = rowIndex;
    }
  }

  /**
   * Make the column header sorting functionality accessible by keyboard events.
   * @param keyEvent check if key event is a "confirm-like" button.
   * @param columnName column to sort 
   */
  sortColumnKbd(keyEvent: KeyboardEvent, columnName: string) {
    if (keyEvent.code === "Space" || keyEvent.code === "Enter") {
      this.toggleSortMode(columnName);
    }
  }

  /**
   * Make the edit buttons accessible by keyboard events.
   * @param keyEvent check if key event is a "confirm-like" button.
   * @param fn function pointer to row edit operation
   * @param param row to edit
   */
  editRowKbd(keyEvent: KeyboardEvent, fn: (p: number) => void, param: number) {
    if (keyEvent.code === "Space" || keyEvent.code === "Enter") {
      fn.bind(this, param)();
    }
  }

  /**
   * Update sorting state by going through column specifications and toggling the current 
   * sorting mode of the column provided
   * @param columnName name of column to change sort mode on
   */
  toggleSortMode(columnName: string) {
    // Get total number of sort modes (used for modulo operation when toggling)
    const n_sort_modes = Object.keys(ColumnSort).length / 2;
    if (this.sort.column != columnName) {
      // Sorting a different column, start with ASC
      this.sort.mode = ColumnSort.ASC;
    } else {
      this.sort.mode = --this.sort.mode % n_sort_modes;
    }

    this.sort.column = columnName;

    // If back to default, sort by __index column instead.
    if (this.sort.mode == ColumnSort.NONE) {
      this.sort.column = this.INDEX;
      this.sort.mode = ColumnSort.ASC;
    }

    // Trigger re-filter data
    this.sortChanged.emit(this.sort);
  }

  /**
   * Handle Drop event from Cdk's DragDropModule.
   * @param event CdkDragDrop event describing the drag and drop operation.
   */
  dropRow(event: CdkDragDrop<TableRow>) {
    /*
    Note that there are some oddities with how drag & drop should/could behave when working with a sorted or filtered table.
     - I propose that we update only the filtered view order when any kind of filter or sorting is applied. 
     - That means once a filter is applied again or changed, the effect of the reordering is voided.
     - However if there is no other filter applied, we can change the order of the base dataset by changing the __index value.
    This is still not a perfect solution without also making this transparent to the user.
    But how to do this would require knowing more context of how this table is used. Ideally of course, this behaviour is configurable. 
    */
    const dragged_index = event.item.data[this.INDEX];
    const move_to_index = this.dataView![event.currentIndex][this.INDEX];

    // Update view only first
    moveItemInArray(this.dataView!, event.previousIndex, event.currentIndex);
    this.dataView = [...this.dataView!];

    if (!this.isFiltered() && !this.isCustomSorted()) {
      // If no finter is applied, we can meaningfully change the order in the source data
      const data_dragged_pos = this.table!.data.findIndex((row) => (row[this.INDEX] === dragged_index));
      const data_move_to_pos = this.table!.data.findIndex((row) => (row[this.INDEX] === move_to_index));
      moveItemInArray(this.table!.data, data_dragged_pos, data_move_to_pos);
      // Re-index 
      for (let idx = 0; idx < this.table!.data.length; idx++) {
        this.table!.data[idx][this.INDEX] = idx;
      }

      // Trigger change detection
      this.table!.data = [...this.table!.data!];
    }
  }

}

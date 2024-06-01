import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, shareReplay, tap } from 'rxjs';
import { TABLE_INDEX_COLUMN_NAME, Table, TableRow } from '../shared/table.model';
import { TableUtils } from '../shared/table-utils';

/**
 * Service for fetching & processing table data. 
 * Table data is cached, such that multiple table views can be created of the same data.
 * There is a placeholder for saving changes to API/File. Further implementation details would depend on the context.
 */
@Injectable({
  providedIn: 'root'
})
export class TableDataService {

  constructor(private http: HttpClient) { }

  private cache = new Map<string, Table>();
  private ongoingRequests = new Map<string, Observable<Table>>();

  dataSourceChanged = new EventEmitter<string>();

  /**
   * Fetch json table data from some url (such as an API endpoint)
   * Expects the root element of the response to be an array-of-records-type (use getData$() instead otherwise)
   * @param url The URL to fetch data from.
   * @returns An Observable of the fetched table rows.
   */
  getTableData$(url: string): Observable<object[]> {
    return this.http.get<object[]>(url);
  }

  /**
   * Fetch json data from some url (such as an API endpoint)
   * @param url The URL to fetch data from.
   * @returns An Observable of the fetched data.
   */
  getData$(url: string): Observable<object> {
    return this.http.get<object>(url);
  }

  /**
   * Fetch data from an endpoint with table data and process it.
   * Cache the results.
   * @param url the url to fetch data from. Response data must be a table-like response with an array as the root object
   * @param cached if available, use a cached result (request will still be cached/overwrite cached copies)
   * @returns An Observable of the table being fetched and processed
   */
  getTable$(url: string, cached = true): Observable<Table> {
    const cachedResponse = this.cache.get(url);
    if (cached && cachedResponse) {
      return of(cachedResponse);
    }

    const ongoingRequest = this.ongoingRequests.get(url);
    if (ongoingRequest) {
      return ongoingRequest;
    }

    const request$ = this.getTableData$(url).pipe(
      map(response => {
        return this.processTableData(response, url)
      }),
      tap(table => {
        console.log(`Cached ${url} with a table of ${Object.keys(table.spec).length} columns and ${table.data.length} rows`);
        this.cache.set(url, table);
        this.ongoingRequests.delete(url);
      }),
      shareReplay(1)
    );

    this.ongoingRequests.set(url, request$);
    return request$;
  }

  /**
   * Process generic array object to Table data
   * @param raw array of objects
   * @param src string to describe the source (url) of the Table
   * @returns 
   */
  processTableData(raw: object[], src?: string): Table {
    const data = raw.map(TableUtils.flattenObjectToRow);

    const spec = TableUtils.inferColumnTypes(data.slice(0, 10));

    for (let idx = 0; idx < data.length; idx++) {
      data[idx][TABLE_INDEX_COLUMN_NAME] = idx;
    }

    return {
      spec: spec,
      data: data,
      url: src
    } as Table;
  }

  /**
   * Save a changed row: implemented here as a simple replace operation on the cached memory.
   * For a proper implementation this would need more context to properly update the data (i.e. a REST API definition).
   * 
   * Also beware that for a proper implementation, we would need to be able to undo the flattening process of nested objects
   * i.e. by keeping track of a mapping when flattening, or by deriving it from the seperator used in the column name.  
   * 
   * @param src the url of the table in cache
   * @param newRowData the new row data (will replace the row based on the __index field in newRowData)
   */
  saveTableChages(src: string, newRowData: TableRow) {
    if (!this.isCached(src)) {
      console.warn(`Can't save data not managed by TableDataService`);
      return;
    }
    const table = this.cache.get(src);
    const replaceIndex = table!.data.findIndex((r) => (r[TABLE_INDEX_COLUMN_NAME] == newRowData[TABLE_INDEX_COLUMN_NAME]));
    console.log(`Replacing row ${replaceIndex} Old Data / New Data:`, table!.data[replaceIndex], newRowData);
    table!.data[replaceIndex] = newRowData;
    this.dataSourceChanged.emit(src);
  }

  isCached(url?: string): boolean {
    if (!url)
      return false;
    return this.cache.has(url);
  }

}

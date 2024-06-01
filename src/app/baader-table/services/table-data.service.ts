import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, shareReplay, tap } from 'rxjs';
import { TABLE_INDEX_COLUMN_NAME, Table } from '../shared/table.model';
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

    console.log(request$);

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
    for (let idx = 0; idx < data.length; idx++) {
      data[idx][TABLE_INDEX_COLUMN_NAME] = idx;
    }

    const spec = TableUtils.inferColumnTypes(data.slice(0, 10));
    return {
      spec: spec,
      data: data,
      url: src
    } as Table;
  }


  /**
   * TODO: To be implemented 
   * @param src 
   * @param index 
   * @param newRowData 
   */
  /*
  saveTableChages(src: string, index: number, newRowData: TableRow) {
  }
  */

}

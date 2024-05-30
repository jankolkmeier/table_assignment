import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service for fetching table data.
 */
@Injectable({
  providedIn: 'root'
})
export class TableDataService {

  constructor(private http: HttpClient) { }

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

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RangeState } from '../../shared/table.model';

/**
 * Generic Pagination component.
 * Configured by setting totalItems and itemsPerPage.
 * Triggers pageChanges event whenever the selected page changes.
 * 
 * ```typescript
 * // your.component.ts
 * 
 * @Component({
 *   // ...
 *   imports: [PaginationComponent],
 *   templateUrl: './your.component.html',
 *   // ...
 * })
 * export class YourComponent {
 *   mydata : object[] = [];
 * 
 *   setRage(range : RangeState) {
 *     // Your logic here that causes the view of mydata to show only the range of data provided by the paginator.
 *   }
 * }
 * ```
 * 
 * ```html
 * <!-- your.component.html -->
 * <baader-pagination [totalItems]="mydata.length" (pageChanged)="setRange($event)"></baader-pagination>
 * <!-- Your data view template here  -->
 * ```
 */
@Component({
  selector: 'baader-pagination',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit {

  @Input()
  pageItems = 10;

  @Output() pageItemsChange = new EventEmitter<number>();

  @Input()
  pageItemOptions = [5, 10, 20, 50, 100];

  @Input()
  showPageItemsSelection = true;

  @Input()
  set totalItems(n: number | null) {
    this._totalItems = n;
  }

  @Output() pageChanged = new EventEmitter<RangeState>();

  @Input() pageLabel = "Page";
  @Input() previousLabel = "←";
  @Input() nextLabel = "→";
  @Input() pageItemsLabel = "Show Items";

  _totalItems: number | null = null;
  _currentPage = 0;

  ngOnInit() {
    this.setPage(0);
  }

  /**
   * Calculate total number of pages
   * @returns total number needed for all data
   */
  totalPages(): number {
    if (this._totalItems === null)
      return 1;
    return Math.max(1, Math.ceil(this._totalItems / this.pageItems));
  }

  /**
   * Set desired page directly (i.e. from dropdown or externally)
   * @param page page to set to
   */
  setPage(page: number) {
    this._currentPage = Math.min(Math.max(0, page), this.totalPages() - 1);
    this.pageChanged.emit({
      start: this._currentPage * this.pageItems,
      length: this.pageItems
    });
  }

  /**
   * Increase/decrease page by n='direction' pages
   * @param direction number of pages to change (positive or negative)
   */
  changePage(direction: number) {
    this.setPage(this._currentPage + direction);
  }

  /**
   * Handle the number of items per page selector value change.
   * @param event Event from HTML Input element (selector) containing selected value
   */
  pageItemsChanged(event: Event) {
    this.pageItems = Number((event.target as HTMLInputElement).value);
    this.pageItemsChange.emit(this.pageItems);
    this.setPage(this._currentPage);
  }

  /**
   * Make the "Next" and "Prev" buttons accessible by keyboard events.
   * @param direction number of pages to change (positive or negative)
   * @param keyEvent check if key event is a "confirm-like" button.
   */
  navButtonKbd(direction: number, keyEvent: KeyboardEvent) {
    if (keyEvent.code === "Space" || keyEvent.code === "Enter") {
      this.setPage(this._currentPage + direction);
    }
  }
}

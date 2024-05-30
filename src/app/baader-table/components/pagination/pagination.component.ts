import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Generic Pagination component.
 * Configured by setting total items and items per page.
 * Triggers pageChanges event whenever the selected page changes.
 */
@Component({
  selector: 'baader-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  @Input()
  set pageItems(n: number | null) {
    this._pageItems = n;
  }

  @Input()
  set totalItems(n: number | null) {
    this._totalItems = n;
  }

  @Output() pageChanged = new EventEmitter<number>();

  _pageItems: number | null = null;
  _totalItems: number | null = null;
  _currentPage = 0;

  /**
   * Calculate total number of pages
   * @returns total number needed for all data
   */
  totalPages(): number {
    if (this._pageItems === null || this._pageItems === 0 || this._totalItems === null)
      return 0;
    return Math.ceil(this._totalItems / this._pageItems);
  }

  /**
   * Set desired page directly (i.e. from dropdown or externally)
   * @param page page to set to
   */
  setPage(page: number) {
    this._currentPage = Math.min(Math.max(0, page), this.totalPages() - 1);
    this.pageChanged.emit(this._currentPage);
  }

  /**
   * Increase/decrease page by n='direction' pages
   * @param direction number of pages to change (positive or negative)
   */
  changePage(direction: number) {
    this.setPage(this._currentPage + direction);
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

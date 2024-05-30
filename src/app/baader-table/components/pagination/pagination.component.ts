import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  totalPages(): number {
    if (this._pageItems === null || this._pageItems === 0 || this._totalItems === null)
      return 0;
    return Math.ceil(this._totalItems / this._pageItems);
  }

  setPage(page: number) {
    this._currentPage = Math.min(Math.max(0, page), this.totalPages() - 1);
    this.pageChanged.emit(this._currentPage);
  }

  changePage(direction: number) {
    this.setPage(this._currentPage + direction);
  }

  navButtonKbd(direction: number, keyEvent: KeyboardEvent) {
    if (keyEvent.code === "Space") {
      this.setPage(this._currentPage + direction);
    }
  }
}

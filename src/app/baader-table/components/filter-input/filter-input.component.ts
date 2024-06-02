import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterState } from '../../shared/table.model';


/**
 * A generic component that can be used to create filter input fields.
 * Optional features are:
 *  - Provide a list of categories to select from for the filter
 * 
 * ```typescript
 * // your.component.ts
 * 
 * @Component({
 *   // ...
 *   imports: [FilterInputComponent],
 *   templateUrl: './your.component.html',
 *   // ...
 * })
 * export class YourComponent {
 *   filter: string = ""; // Search string to filter data on
 *   category: string = ""; // Additional category to limit search to
 *   categories: string[] = [ "products", "users" ];
 *   
 *   filterChanged(f : string) {
 *     // update search results based on new filter string
 *   }
 * 
 *   categoryChanged(c : string) {
 *     // update search results based on new category
 *   }
 * }
 * ```
 * 
 * ```html
 * <!-- your.component.html -->
 * <baader-filter-input [filter]="filter" (filterChange)="filterChanged()"></baader-filter-input>
 * 
 * <!-- Your data view template here  -->
 * 
 * ```
 */
@Component({
  selector: 'baader-filter-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-input.component.html',
  styleUrl: './filter-input.component.css'
})
export class FilterInputComponent {

  @Input()
  set categorySelect(categories: string[] | null) {
    this._categories = categories;
  }
  _categories: string[] | null = null;

  @Input() filter: FilterState = { column: "", filter: "" };
  @Output() filterChange = new EventEmitter<FilterState>();

  @Input() filterLabel = "Search:";
  @Input() categoryLabel = "In Category:";

  @Input() categoryDefaultValue = "";
  @Input() resetLabel = "Clear";

  /**
   * Input field for filter string changed
   */
  filterValueChanged(event: Event) {
    this.filter.filter = (event.target as HTMLInputElement).value;
    this.filterChange.emit(this.filter);
  }

  /**
   * Which category to filter on changed 
   * @param index index of the _categories array
   */
  selectedCategoryChanged(event: Event) {
    this.filter.column = (event.target as HTMLInputElement).value;
    this.filterChange.emit(this.filter);
  }

  /**
   * Clear all filter parameters
   */
  resetFilter() {
    this.filter.filter = "";
    this.filter.column = "";
    this.filterChange.emit(this.filter);
  }

}

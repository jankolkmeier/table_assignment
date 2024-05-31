import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';


/**
 * A generic component that can be used to create filter input fields.
 * Optional features are:
 *  - Provide a list of categories to select from for the filter
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

  @Input() category = "";
  @Output() categoryChange = new EventEmitter<string>();

  @Input() filter = "";
  @Output() filterChange = new EventEmitter<string>();

  @Input() filterLabel = "Filter:";
  @Input() categoryLabel = "In Category:";

  @Input() categoryDefaultValue = "";

  @Input() resetLabel = "Clear";


  /**
   * Input field for filter string changed
   */
  filterValueChanged(event: Event) {
    this.filter = (event.target as HTMLInputElement).value;
    this.filterChange.emit(this.filter);
  }

  /**
   * Which category to filter on changed 
   * @param index index of the _categories array
   */
  selectedCategoryChanged(event: Event) {
    this.category = (event.target as HTMLInputElement).value;
    this.categoryChange.emit(this.category);
  }

  /**
   * Clear all filter parameters
   */
  resetFilter() {
    this.category = "";
    this.filter = "";
    this.categoryChange.emit(this.category);
    this.filterChange.emit(this.filter);
  }

}

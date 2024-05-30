import { Component } from '@angular/core';

import { TableComponent } from '../../baader-table/components/table/table.component';
import { ColumnSpec } from '../../baader-table/shared/table.model';

/**
 * Product Page component. Shows a table of products.
 */
@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css'
})
export class ProductsPageComponent {

  products_data_url = "/data/products.json";
  products_display_columns = [
    { name: "id", displayName: "ID" },
    { name: "title", displayName: "Title" },
    { name: "category", displayName: "Category" },
    { name: "price", displayName: "Price" },
  ] as ColumnSpec[];

}

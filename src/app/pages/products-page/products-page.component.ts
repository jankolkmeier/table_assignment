import { Component } from '@angular/core';

import { TableViewComponent } from '../../baader-table/components/table-view/table-view.component';

/**
 * Product Page component. Shows a table of products.
 */
@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [TableViewComponent],
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
  ];

}

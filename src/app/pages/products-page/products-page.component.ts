import { Component } from '@angular/core';

import { TableComponent } from '../../baader-table/components/table/table.component';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css'
})
export class ProductsPageComponent {

  products_data_url = "/data/products.json";
  products_display_columns = ["id", "title", "category", "price"];

}

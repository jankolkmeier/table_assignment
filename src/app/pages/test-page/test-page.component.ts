import { Component } from '@angular/core';
import { TableViewComponent } from '../../baader-table/components/table-view/table-view.component';
import { ColumnSpec } from '../../baader-table/shared/table.model';

interface TableSettings {
  url: string,
  columns: ColumnSpec[]
}

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [TableViewComponent],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css'
})
export class TestPageComponent {

  tables = [
    {
      url: "/data/products.json",
      columns: [
        { name: "id", displayName: "ID" },
        { name: "title", displayName: "Title" },
        { name: "category", displayName: "Category" },
        { name: "price", displayName: "Price" },
      ]
    }, {
      url: "/data/users.json",
      columns: [
        { name: "name.first", displayName: "First Name" },
        { name: "name.last", displayName: "Last Name" },
        { name: "dob.age", displayName: "Age" },
        { name: "location.country", displayName: "Country" },
        { name: "location.state", displayName: "State" },
        { name: "location.street.name", displayName: "Street Name" },
        { name: "location.street.number", displayName: "Street Number" }
      ]
    }

  ] as TableSettings[];

  thirdTableIdx = 0;

  cycleThirdTable() {
    this.thirdTableIdx = (this.thirdTableIdx + 1) % this.tables.length;
  }

}

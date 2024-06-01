import { Component } from '@angular/core';
import { TableViewComponent } from '../../baader-table/components/table-view/table-view.component';
import { TableDataService } from '../../baader-table/services/table-data.service';
import { ColumnSpec, Table } from '../../baader-table/shared/table.model';

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
  testData = [
    {
      "userId": 1,
      "id": 1,
      "title": "delectus aut autem",
      "completed": false
    },
    {
      "userId": 1,
      "id": 2,
      "title": "quis ut nam facilis et officia qui",
      "completed": false
    },
    {
      "userId": 1,
      "id": 3,
      "title": "fugiat veniam minus",
      "completed": false
    },
    {
      "userId": 1,
      "id": 4,
      "title": "et porro tempora",
      "completed": true
    },
    {
      "userId": 1,
      "id": 5,
      "title": "laboriosam mollitia et enim quasi adipisci quia provident illum",
      "completed": false
    },
    {
      "userId": 1,
      "id": 6,
      "title": "qui ullam ratione quibusdam voluptatem quia omnis",
      "completed": false
    },
    {
      "userId": 1,
      "id": 7,
      "title": "illo expedita consequatur quia in",
      "completed": false
    },
    {
      "userId": 1,
      "id": 8,
      "title": "quo adipisci enim quam ut ab",
      "completed": true
    },
    {
      "userId": 1,
      "id": 9,
      "title": "molestiae perspiciatis ipsa",
      "completed": false
    },
    {
      "userId": 1,
      "id": 10,
      "title": "illo est ratione doloremque quia maiores aut",
      "completed": true
    },
    {
      "userId": 1,
      "id": 11,
      "title": "vero rerum temporibus dolor",
      "completed": true
    },
    {
      "userId": 1,
      "id": 12,
      "title": "ipsa repellendus fugit nisi",
      "completed": true
    },
    {
      "userId": 1,
      "id": 13,
      "title": "et doloremque nulla",
      "completed": false
    },
    {
      "userId": 1,
      "id": 14,
      "title": "repellendus sunt dolores architecto voluptatum",
      "completed": true
    },
    {
      "userId": 1,
      "id": 15,
      "title": "ab voluptatum amet voluptas",
      "completed": true
    },
    {
      "userId": 1,
      "id": 16,
      "title": "accusamus eos facilis sint et aut voluptatem",
      "completed": true
    },
    {
      "userId": 1,
      "id": 17,
      "title": "quo laboriosam deleniti aut qui",
      "completed": true
    },
    {
      "userId": 1,
      "id": 18,
      "title": "dolorum est consequatur ea mollitia in culpa",
      "completed": false
    },
    {
      "userId": 1,
      "id": 19,
      "title": "molestiae ipsa aut voluptatibus pariatur dolor nihil",
      "completed": true
    },
    {
      "userId": 1,
      "id": 20,
      "title": "ullam nobis libero sapiente ad optio sint",
      "completed": true
    }
  ];

  testDataProcessed: Table;

  constructor(private dataService: TableDataService) {
    this.testDataProcessed = dataService.processTableData(this.testData);
  }

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

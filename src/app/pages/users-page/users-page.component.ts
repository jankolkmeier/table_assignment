import { Component } from '@angular/core';
import { TableViewComponent } from '../../baader-table/components/table-view/table-view.component';

/**
 * User Page component. Shows a table of users.
 */
@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [TableViewComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css'
})
export class UsersPageComponent {
  users_data_url = "/data/users.json";
  users_display_columns = [
    { name: "name.first", displayName: "First Name" },
    { name: "name.last", displayName: "Last Name" },
    { name: "dob.age", displayName: "Age" },
    { name: "location.country", displayName: "Country" },
    { name: "location.state", displayName: "State" },
    { name: "location.street.name", displayName: "Street Name" },
    { name: "location.street.number", displayName: "Street Number" }
  ];
}

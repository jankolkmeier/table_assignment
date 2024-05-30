import { Component } from '@angular/core';
import { TableComponent } from '../../baader-table/components/table/table.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css'
})
export class UsersPageComponent {
  users_data_url = "/data/users.json";
  users_display_columns = ["name.first", "name.last", "dob.age", "location.country", "location.state", "location.street.name", "location.street.number"];
}

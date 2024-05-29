import { Component } from '@angular/core';
import { MarkdownService, MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-assignment-page',
  standalone: true,
  imports: [MarkdownComponent],
  providers: [MarkdownService],
  templateUrl: './assignment-page.component.html',
  styleUrl: './assignment-page.component.css'
})
export class AssignmentPageComponent {

}

import { Component } from '@angular/core';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-report-page',
  standalone: true,
  imports: [MarkdownComponent],
  providers: [MarkdownService],
  templateUrl: './report-page.component.html',
  styleUrl: './report-page.component.css'
})
export class ReportPageComponent {

}

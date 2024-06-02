import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideHttpClient } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown'

import { MarkdownComponent } from 'ngx-markdown';

import { ReportPageComponent } from './report-page.component';

describe('ReportPageComponent', () => {
  let component: ReportPageComponent;
  let fixture: ComponentFixture<ReportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportPageComponent, MarkdownComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideMarkdown()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

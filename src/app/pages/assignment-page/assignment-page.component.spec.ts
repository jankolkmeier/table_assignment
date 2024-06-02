import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideHttpClient } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown'

import { AssignmentPageComponent } from './assignment-page.component';
import { MarkdownComponent } from 'ngx-markdown';

describe('AssignmentPageComponent', () => {
  let component: AssignmentPageComponent;
  let fixture: ComponentFixture<AssignmentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentPageComponent, MarkdownComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideMarkdown()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AssignmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideHttpClient } from '@angular/common/http';

import { UsersPageComponent } from './users-page.component';

describe('UsersPageComponent', () => {
  let component: UsersPageComponent;
  let fixture: ComponentFixture<UsersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(UsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  /*
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [UsersPageComponent, HttpTestingController]
      })
        .compileComponents();
  
      fixture = TestBed.createComponent(UsersPageComponent);
      component = fixture.componentInstance;
      //httpTestingController = TestBed.inject(HttpTestingController);
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    */
});

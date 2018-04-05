// general testing imports 
import { async, ComponentFixture, TestBed, fakeAsync, inject } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// general imports 
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { BrowserModule, By } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
// component specific imports 
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarModule, MatSnackBarConfig, MatSnackBarRef, 
  SimpleSnackBar } from '@angular/material';
import { CookieService } from 'ng2-cookies';

import { SidebarComponent } from './sidebar.component';

export class MockCookieService extends CookieService {}

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let cookieServiceStub: MockCookieService;
  let testBedCookieService: MockCookieService;
  let router : Router;
  let snackBar : MatSnackBar;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarComponent ], 
      imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule

      ],
      providers: [ 
        {provide: CookieService, useClass: MockCookieService}, 
        HttpClientModule, 
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    testBedCookieService = TestBed.get(CookieService);
    cookieServiceStub = fixture.debugElement.injector.get(CookieService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.isAdmin).toBeDefined();
  });

  it('should have cookie service injected and instantiated', () => {
    expect(cookieServiceStub instanceof MockCookieService).toBe(true);
    inject([CookieService], (injectService: CookieService) => {
      expect(injectService).toBe(testBedCookieService);
    });
  });

  it('should invoke cookie service at ngOnInit', ()=>{
    let spy = spyOn(cookieServiceStub, 'get');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  })
});

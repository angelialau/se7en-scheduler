import { async, ComponentFixture, TestBed, fakeAsync, inject } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { User } from './../../models/user.model';
import { UserService } from './../services/user.service';
import { Observable } from 'rxjs/Observable';
import { HttpResponse } from '@angular/common/http';

import { LoginComponent } from './login.component';

export class MockUserService extends UserService{
  postLogin(email : string, password : string ) : Observable<any>{
    return Observable.of(HttpResponse);
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userServiceStub: MockUserService;
  let testBedUserService: MockUserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ], 
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
        {provide: UserService, useClass: MockUserService}, 
        HttpClientModule, 
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    testBedUserService = TestBed.get(UserService);
    userServiceStub = fixture.debugElement.injector.get(UserService);
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // test dependency injection 
  it('UserService injected via inject(...) and TestBed.get(...) should be the same instance',
      inject([UserService], (injectService: UserService) => {
        expect(injectService).toBe(testBedUserService);
      })
  );

  it('UserService injected via component should be an instance of MockUserService', () => {
    expect(userServiceStub instanceof MockUserService).toBeTruthy();
  });

  it("user should be null user at ngOnInit", () => {
    const nullUser = new User(null,null,null,null,null,null);
    expect(component.user).toEqual(nullUser);
  });

  it('should trigger login() when login button clicked',() => {
    spyOn(component, 'login');
    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.login).toHaveBeenCalled();
      }
    )
  });

  it('login() should update user data', () => {
    const spy = spyOn(userServiceStub, 'postLogin').and.returnValue(
      Observable.of(HttpResponse)
    );
    // component.ngOnInit();
    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.detectChanges();
    expect(component.user).toBeDefined();
    expect(spy.calls.any()).toEqual(true);
  });
});

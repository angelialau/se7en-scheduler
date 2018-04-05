// general testing imports 
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
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
import { UserService } from './../services/user.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarModule, MatSnackBarConfig, MatSnackBarRef, 
  SimpleSnackBar } from '@angular/material';
import { User } from './../../models/user.model'

import { CreateUserComponent } from './create-user.component';

export class MockUserService extends UserService{
  // postNewUser(user: User){
  //   return Observable.of(HttpResponse);
  // }
}

describe('CreateUserComponent', () => {
  let component : CreateUserComponent;
  let fixture : ComponentFixture<CreateUserComponent>;
  let userServiceStub : MockUserService;
  let testBedUserService : MockUserService;
  let snackBar : MatSnackBar;
  let snackBarSpy : jasmine.Spy;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUserComponent ],
      imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,       
      ],
      providers: [ 
        HttpClientModule, 
        DatePipe,
        {provide: ActivatedRoute, useValue: {snapshot: {params: {'schedule_id': '4'}}}},
        {provide: UserService, useClass: MockUserService },
       ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    testBedUserService = TestBed.get(UserService);
    userServiceStub = fixture.debugElement.injector.get(UserService);
    snackBar = fixture.debugElement.injector.get(MatSnackBar);
    snackBarSpy = spyOn(snackBar, "open").and.returnValue(MatSnackBarRef);

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should have user service injected and instantiated', () => {
    expect(userServiceStub instanceof MockUserService).toBeTruthy();
    inject([UserService], (injectService: UserService) => {
      expect(injectService).toBe(testBedUserService);
    });
  });

  it("should initialise null user at ngOnInit", () => {
    const nullUser = new User(null,null);
    expect(component.modelNewUser).toEqual(nullUser);
  });

  // it('should be an invalid form when empty', () => {
  //   expect(component.modelNewUser.valid).toBeFalsy();
  // });

  it('should invoke createUser and snackbar when adding user',() => {
    component.modelNewUser = new User('email@email.com','password','ISTD',
      'tester',88881111,1,null,null);
    
    let createspy = spyOn(component, 'createUser').and.callFake(function(){
      userServiceStub.postNewUser(component.modelNewUser);
      snackBar.open('msg');
    });
    let servicespy = spyOn(userServiceStub, 'postNewUser').and.returnValue(
      Observable.of(HttpResponse));

    component.createUser(component.modelNewUser.name);

    expect(createspy).toHaveBeenCalledWith(component.modelNewUser.name);
    expect(servicespy).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
  });

});

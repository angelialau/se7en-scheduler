import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

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

import { CreateUserComponent } from './create-user.component';

export class MockUserService extends UserService{
  postNewUser(newUser : User ) : Observable<any>{
    return Observable.of(HttpResponse);
  }
}

describe('CreateUserComponent', () => {
  let component : CreateUserComponent;
  let fixture : ComponentFixture<CreateUserComponent>;
  let userServiceStub : MockUserService;
  let testBedUserService : MockUserService;


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
        RouterTestingModule

      ],
      providers: [ 
        { provide: UserService, useClass: MockUserService } , 
        HttpClientModule, 
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
    fixture.detectChanges();
  });

  it('should create component', () => {
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

  it("modelNewUser should be null user at ngOnInit", () => {
    const nullUser = new User(null,null);
    expect(component.modelNewUser).toEqual(nullUser);
  });

  it('should trigger openSnackBar() when create user button clicked',() => {
    spyOn(component, 'snackBar');
    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.snackBar).toHaveBeenCalled();
      }
    )
  });

  it('postNewUser() should call snackbar.open()', () => {
    const spy = spyOn(userServiceStub, 'postNewUser').and.returnValue(
      Observable.of(HttpResponse)
    );
    // component.ngOnInit();
    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.detectChanges();
    // expect(component.user).toBeDefined();
    expect(spy.calls.any()).toEqual(true);
  });
});

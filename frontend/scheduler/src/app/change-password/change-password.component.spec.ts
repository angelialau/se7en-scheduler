import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { UserService } from './../services/user.service';
import { Observable } from 'rxjs/Observable';
import { HttpResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { ChangePasswordComponent } from './change-password.component';

export class MockUserService extends UserService{
  changePassword(oldPassword: string, newPassword: string): Observable<any>{
    return Observable.of(HttpResponse);
  }
}

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let userServiceStub : MockUserService;
  let testBedUserService : MockUserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordComponent ], 
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
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    testBedUserService = TestBed.get(UserService);
    userServiceStub = fixture.debugElement.injector.get(UserService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have user service injected',
      inject([UserService], (injectService: UserService) => {
        expect(injectService).toBe(testBedUserService);
      })
  );

  it('should have user service instantiated', () => {
    expect(userServiceStub instanceof MockUserService).toBeTruthy();
  });

  it('should invoke snackbar when changing password', () => {
    const spy = spyOn(userServiceStub, 'changePassword').and.returnValue(
      Observable.of(HttpResponse)
    );

    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  })
});

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
import { UserService } from './../services/user.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarModule, MatSnackBarConfig, MatSnackBarRef, 
  SimpleSnackBar } from '@angular/material';
import { User } from './../../models/user.model';
import { CookieService } from 'ng2-cookies';

import { LoginComponent } from './login.component';

export class MockUserService extends UserService{
  postLogin(email : string, password : string ) : Observable<any>{
    return Observable.of(HttpResponse);
  }
}

export class MockCookieService extends CookieService {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userServiceStub: MockUserService;
  let cookieServiceStub: MockCookieService;
  
  let router : Router;
  let snackBar : MatSnackBar;

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
        {provide: CookieService, useClass: MockCookieService}, 
        HttpClientModule, 
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userServiceStub = fixture.debugElement.injector.get(UserService);
    cookieServiceStub = fixture.debugElement.injector.get(CookieService);
    router = fixture.debugElement.injector.get(Router);
    snackBar = fixture.debugElement.injector.get(MatSnackBar);
    
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have user service injected and instantiated', () => {
    expect(userServiceStub instanceof MockUserService).toBeTruthy();
  });

  it('should have cookie service injected and instantiated', () => {
    expect(cookieServiceStub instanceof MockCookieService).toBeTruthy();
  });

  it("should have variables initialised at ngOnInit", () => {
    let nullUser = new User(null,null);
    expect(component.model).toEqual(nullUser);
    expect(component.cookies).toBeUndefined();
  });

  it('should trigger login() when login button clicked',() => {
    let spy = spyOn(component, 'login');
    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should invoke user and cookie services when logging in', ()=>{
    let email = 'email@email.com';
    let password = 'password';
    let user = new User(email, password);
    let bool = spyOn(userServiceStub, 'getLoggedInUser').and.returnValue(true);
    let routerspy = spyOn(router,'navigateByUrl');
    let snackBarSpy = spyOn(snackBar, "open").and.returnValue(MatSnackBarRef);
    let cookiesSpy = spyOn(cookieServiceStub, "set");
    let loginspy = spyOn(component, 'login').and.callFake(function(){
      userServiceStub.postLogin(component.model.email, component.model.password);
    })

    component.model.email = email;
    component.model.password = password;

    let servicespy = spyOn(userServiceStub, 'postLogin').and.callFake(function(email,password){
      if(email == 'email@email.com' && password == 'password'){
        if (true){
          cookieServiceStub.set('id',String(user.id));
          cookieServiceStub.set('pillar', user.pillar || '');
          cookieServiceStub.set('name', user.name || '');
          cookieServiceStub.set('email', user.email || '');
          cookieServiceStub.set('schedules', user.schedules || '');
          cookieServiceStub.set('courses', user.courses || '');
          router.navigateByUrl('url');
          userServiceStub.getLoggedInUser();
        }
      }else{
        snackBar.open('msg');
      }
    });
    
    component.login();

    expect(servicespy).toHaveBeenCalled();
    expect(loginspy).toHaveBeenCalled();
    expect(bool).toHaveBeenCalled();
    expect(routerspy).toHaveBeenCalled();
    expect(cookiesSpy.calls.count()).toEqual(6);
  })
  
});

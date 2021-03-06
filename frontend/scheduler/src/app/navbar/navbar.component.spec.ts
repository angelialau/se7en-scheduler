// general testing imports 
import { async, ComponentFixture, TestBed, fakeAsync, inject } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// general imports 
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// component specific imports 
import { UserService } from './../services/user.service';
import { CookieService } from 'ng2-cookies';
import { User } from './../../models/user.model';

import { NavbarComponent } from './navbar.component';

export class MockUserService extends UserService{
  postLogin(email : string, password : string ) : Observable<any>{
    return Observable.of(HttpResponse);
  }
}

export class MockCookieService extends CookieService {}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let userServiceStub: MockUserService;
  let testBedUserService: MockUserService;
  let cookieServiceStub: MockCookieService;
  let testBedCookieService: MockCookieService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,

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
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    testBedUserService = TestBed.get(UserService);
    userServiceStub = fixture.debugElement.injector.get(UserService);
    testBedCookieService = TestBed.get(CookieService);
    cookieServiceStub = fixture.debugElement.injector.get(CookieService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.administrator).toBeDefined();
  });
  
  it('should have user service injected and instantiated', () => {
    expect(userServiceStub instanceof MockUserService).toBeTruthy();
    inject([UserService], (injectService: UserService) => {
      expect(injectService).toBe(testBedUserService);
    });
  });

  it('should have cookie service injected and instantiated', () => {
    expect(cookieServiceStub instanceof MockCookieService).toBeTruthy();
    inject([CookieService], (injectService: CookieService) => {
      expect(injectService).toBe(testBedCookieService);
    });
  });

  it('should invoke cookie service at ngOnInit', ()=>{
    let spy = spyOn(cookieServiceStub, 'get');
    component.ngOnInit();
    fixture.autoDetectChanges();
    fixture.whenStable().then(()=>{
      expect(spy).toHaveBeenCalled();
    })
  })

  it('should invoke user and cookie services when signing out', ()=>{
    let spy = spyOn(cookieServiceStub, 'deleteAll');
    let userspy = spyOn(userServiceStub, 'resetUser');
    let signoutspy = spyOn(component, 'signOut').and.callThrough();
    
    component.signOut();

    fixture.autoDetectChanges();
    fixture.whenStable().then(()=>{
      expect(spy).toHaveBeenCalled();
      expect(userspy).toHaveBeenCalled();
      expect(signoutspy).toHaveBeenCalled();
    })
  })

});

// // general testing imports 
// import { async, ComponentFixture, TestBed, fakeAsync, inject } from '@angular/core/testing';
// import { HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// // general imports 
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { RouterModule, Router, ActivatedRoute } from '@angular/router';
// import { BrowserModule, By } from '@angular/platform-browser';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
// import { RouterTestingModule } from '@angular/router/testing';
// // component specific imports 
// import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
// import { DatePipe } from '@angular/common';
// import { MatSnackBar, MatSnackBarModule, MatSnackBarConfig, MatSnackBarRef, 
//   SimpleSnackBar } from '@angular/material';
// import { User } from './../models/user.model';
// import { CookieService } from 'ng2-cookies';
// import { UserService } from './services/user.service'; 
// import {Location} from '@angular/common';

// // component imports 
// import { AppComponent } from './app.component';

// export class MockUserService extends UserService{}
// export class MockCookieService extends CookieService{}

// describe('AppComponent', () => {
//   let component: AppComponent;
//   let fixture: ComponentFixture<AppComponent>;
//   let location: Location;
//   let router: Router;
//   let userServiceStub: MockUserService;
//   let testBedUserService: MockUserService;
//   let cookieServiceStub: MockCookieService;
//   let testBedCookieService: MockCookieService;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         AppComponent,
//       ],
//       imports: [
//         BrowserModule,
//         HttpClientModule,
//         BrowserAnimationsModule,
//         MatSnackBarModule,
//         FormsModule,
//         ReactiveFormsModule,
//         RouterTestingModule

//       ],
//       providers: [ 
//         {provide: UserService, useClass: MockUserService}, 
//         {provide: CookieService, useClass: MockCookieService}, 
//         HttpClientModule, 
//         Location
//       ],
//       schemas: [ NO_ERRORS_SCHEMA ]
//     }).compileComponents();

//   }));
//   beforeEach(() => {
//     fixture = TestBed.createComponent(AppComponent);
//     router = TestBed.get(Router);
//     location = TestBed.get(Location);
//     router.initialNavigation();

//     component = fixture.componentInstance;
//     testBedUserService = TestBed.get(UserService);
//     userServiceStub = fixture.debugElement.injector.get(UserService);
//     testBedCookieService = TestBed.get(CookieService);
//     cookieServiceStub = fixture.debugElement.injector.get(CookieService);

//     fixture.detectChanges();
//   });

//   it('should create the app', async(() => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.debugElement.componentInstance;
//     expect(app).toBeTruthy();
//   }));
// });

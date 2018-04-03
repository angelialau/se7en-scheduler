// import { TestBed, async } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { RouterModule, Router, ActivatedRoute } from '@angular/router';
// import { BrowserModule } from '@angular/platform-browser';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { Location } from "@angular/common";
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
// import { RouterTestingModule } from '@angular/router/testing';
// import { MatToolbarModule, MatButtonModule, MatIconModule,
//  MatSidenavModule, MatListModule, MatCardModule, MatFormFieldModule,
//  MatInputModule, MatSnackBarModule } from '@angular/material';
// import { ROUTES } from "./app.module";

// import { UserService } from './services/user.service'; 
// import { ScheduleService } from './services/schedule.service'; 

// // component imports 
// import { AppComponent } from './app.component';
// import { NavbarComponent } from './navbar/navbar.component';
// import { SidebarComponent } from './sidebar/sidebar.component';
// import { LoginComponent } from './login/login.component';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { NotificationsComponent } from './notifications/notifications.component';
// import { ViewSchedulesComponent } from './view-schedules/view-schedules.component';
// import { ChangePasswordComponent } from './change-password/change-password.component';
// import { ScheduleDetailsComponent } from './schedule-details/schedule-details.component';
// import { CreateCourseComponent } from './create-course/create-course.component'
// describe('AppComponent', () => {
//   let component: AppComponent;
//   let location: Location;
//   let router: Router;
//   let fixture;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         AppComponent,
//         NavbarComponent,
//         SidebarComponent,
//         LoginComponent,
//         CreateUserComponent,
//         NotificationsComponent,
//         ViewSchedulesComponent,
//         ChangePasswordComponent,
//         ScheduleDetailsComponent,
//         CreateCourseComponent
//       ],
//       imports: [
//         BrowserModule,
//         HttpClientModule,
//         BrowserAnimationsModule,
//         RouterModule, 
//         FormsModule,
//         ReactiveFormsModule,
//         RouterTestingModule.withRoutes(ROUTES),
//         MatToolbarModule, 
//         MatButtonModule, 
//         MatIconModule, 
//         MatSidenavModule, 
//         MatListModule, 
//         MatCardModule,
//         MatFormFieldModule, 
//         MatInputModule,
//         MatSnackBarModule

//       ], providers: [
//         UserService, ScheduleService
//       ],
//       schemas: [ NO_ERRORS_SCHEMA ]
//     }).compileComponents();

//     router = TestBed.get(Router);
//     location = TestBed.get(Location);
//     fixture = TestBed.createComponent(AppComponent);
//     router.initialNavigation();
//   }));
//   beforeEach(() => {
//     fixture = TestBed.createComponent(AppComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create the app', async(() => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.debugElement.componentInstance;
//     expect(app).toBeTruthy();
//   }));
// });

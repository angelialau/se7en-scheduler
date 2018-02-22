import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// material.angular imports
import { MatToolbarModule, MatButtonModule, MatIconModule,
 MatSidenavModule, MatListModule, MatCardModule, MatFormFieldModule,
 MatInputModule, MatSnackBarModule } from '@angular/material';

// service imports 
import { UserService } from './services/user.service'; 
import { ScheduleService } from './services/schedule.service'; 

// component imports 
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { TimetableReqFormComponent } from './timetable-req-form/timetable-req-form.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ViewSchedulesComponent } from './view-schedules/view-schedules.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ScheduleDetailsComponent } from './schedule-details/schedule-details.component'

const ROUTES: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' }, // use when login page is done
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: NotificationsComponent },
  { path: 'create-user', component: CreateUserComponent },
  { path: 'schedules', component: ViewSchedulesComponent },
  { path: 'schedules/details', component: ScheduleDetailsComponent },
  { path: 'password', component: ChangePasswordComponent },

  { path: 'timetable-requirements-form', component: TimetableReqFormComponent }, // to be deprecated
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
    CreateUserComponent,
    TimetableReqFormComponent,
    NotificationsComponent,
    ViewSchedulesComponent,
    ChangePasswordComponent,
    ScheduleDetailsComponent
  ],
  imports: [
    BrowserModule, 
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES), 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSidenavModule, 
    MatListModule, 
    MatCardModule,
    MatFormFieldModule, 
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  providers: [UserService, ScheduleService],
  bootstrap: [AppComponent]
})
export class AppModule { }

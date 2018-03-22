import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from 'ng-fullcalendar';

// material.angular imports
import { MatToolbarModule, MatButtonModule, MatIconModule,
 MatSidenavModule, MatListModule, MatCardModule, MatFormFieldModule,
 MatInputModule, MatSnackBarModule } from '@angular/material';

// service imports 
import { UserService } from './services/user.service'; 
import { ScheduleService } from './services/schedule.service'; 
import { EventService } from './services/event.service';

// component imports 
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ViewSchedulesComponent } from './view-schedules/view-schedules.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ScheduleDetailsComponent } from './schedule-details/schedule-details.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { CreateEventComponent } from './create-event/create-event.component'

export const ROUTES: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' }, // use when login page is done
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: NotificationsComponent },
  { path: 'user', component: CreateUserComponent },
  { path: 'schedules', component: ViewSchedulesComponent },
  { path: 'schedules/:schedule_id', component: ScheduleDetailsComponent },
  // { path: 'schedules/courses/add', component: CreateCourseComponent },
  { path: 'password', component: ChangePasswordComponent },
  { path: 'viewschedule', component: ScheduleComponent},
  { path: 'event', component: ScheduleComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
    CreateUserComponent,
    NotificationsComponent,
    ViewSchedulesComponent,
    ChangePasswordComponent,
    ScheduleDetailsComponent,
    CreateCourseComponent,
    ScheduleComponent,
    CreateEventComponent
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
    FullCalendarModule,
  ],
  providers: [UserService, ScheduleService, EventService],
  bootstrap: [AppComponent]
})
export class AppModule { }

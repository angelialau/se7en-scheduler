import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import {HttpModule} from '@angular/http'
import { FullCalendarModule } from 'ng-fullcalendar';

// material.angular imports
import { MatToolbarModule, MatButtonModule, MatIconModule,
 MatSidenavModule, MatListModule, MatCardModule, MatFormFieldModule,
 MatInputModule, MatSnackBarModule, MatDialogModule } from '@angular/material';

// service imports 
import { UserService } from './services/user.service'; 
import { ScheduleService } from './services/schedule.service'; 
import { EventService } from './services/event.service';
import { WindowService } from './services/window.service'
import { CookieService } from 'ng2-cookies';

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
import { CreateEventComponent } from './create-event/create-event.component';
import { CreateAnnouncementComponent } from './create-announcement/create-announcement.component';
import { ViewAppealComponent } from './view-appeal/view-appeal.component';
import { AppealreplyComponent } from './appealreply/appealreply.component';
import { ViewEventsComponent } from './view-events/view-events.component';
import { ViewCalendarComponent } from './view-calendar/view-calendar.component';
import { ChangecalendarComponent } from './changecalendar/changecalendar.component'

export const ROUTES: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: NotificationsComponent },
  { path: 'announcements', component: CreateAnnouncementComponent },
  { path: 'user', component: CreateUserComponent },
  { path: 'schedules', component: ViewSchedulesComponent },
  { path: 'schedules/:schedule_id', component: ScheduleDetailsComponent },
  { path: 'password', component: ChangePasswordComponent },
  { path: 'viewschedule/:calendar_id', component: ScheduleComponent},
  { path: 'viewappeal', component: ViewAppealComponent},
  { path: 'appealstatus', component: AppealreplyComponent},
  { path: 'events', component: ViewEventsComponent},
  { path: 'events/:schedule_id', component: CreateEventComponent},
  { path: 'viewcalendar', component: ViewCalendarComponent},
  { path: 'changecalendar/:calendar_id', component: ChangecalendarComponent}

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
    CreateEventComponent,
    CreateAnnouncementComponent,
    ViewAppealComponent,
    AppealreplyComponent,
    ViewEventsComponent,
    ViewCalendarComponent,
    ChangecalendarComponent
  ],
  imports: [
    BrowserModule, 
    HttpClientModule,
    HttpModule,
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
    MatDialogModule,
    FullCalendarModule,
  ],
  providers: [UserService, ScheduleService, EventService, DatePipe, CookieService, WindowService],
  bootstrap: [AppComponent]
})
export class AppModule { }

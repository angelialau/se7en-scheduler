// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { RouterModule, Router, ActivatedRoute } from '@angular/router';
// import { BrowserModule } from '@angular/platform-browser';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatSnackBarModule } from '@angular/material';
// import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
// import { RouterTestingModule } from '@angular/router/testing';

// import { Schedule } from './../../models/schedule.model';
// import { User } from './../../models/user.model';
// import { UserService } from './../services/user.service';
// import { Course, Session, CourseDetail, courseDetails, class_type, 
//   durations } from './../../models/course.model';
// import { ScheduleService } from './../services/schedule.service';

// import { ScheduleDetailsComponent } from './schedule-details.component';

// describe('ScheduleDetailsComponent', () => {
//   let component: ScheduleDetailsComponent;
//   let fixture: ComponentFixture<ScheduleDetailsComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ScheduleDetailsComponent ],
//       imports: [
//         BrowserModule,
//         HttpClientModule,
//         BrowserAnimationsModule,
//         MatSnackBarModule,
//         FormsModule,
//         ReactiveFormsModule,
//         RouterTestingModule

//       ],
//       providers: [ UserService, ScheduleService, HttpClientModule, 
//       {provide: ActivatedRoute, useValue: {snapshot: {params: {'schedule_id': '4'}}}} ],
//       schemas: [ NO_ERRORS_SCHEMA ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ScheduleDetailsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

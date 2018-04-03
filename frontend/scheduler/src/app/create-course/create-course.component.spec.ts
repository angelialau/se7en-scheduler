import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { BrowserModule, By } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { User } from './../../models/user.model';
import { UserService } from './../services/user.service';
import { Course, Session, CourseDetail, courseDetails, class_type, 
  durations } from './../../models/course.model';
import { ScheduleService } from './../services/schedule.service';
import { Observable } from 'rxjs/Observable';
import { HttpResponse } from '@angular/common/http';

import { CreateCourseComponent } from './create-course.component';

export class MockUserService extends UserService{
  postNewUser(newUser : User ) : Observable<any>{
    return Observable.of(HttpResponse);
  }
}

export class MockScheduleService extends ScheduleService{
  
}

describe('CreateCourseComponent', () => {
  let component: CreateCourseComponent;
  let fixture: ComponentFixture<CreateCourseComponent>;
  let userServiceStub : MockUserService;
  let testBedUserService : MockUserService;
  let scheduleServiceStub : MockScheduleService;
  let testBedScheduleService: MockScheduleService;
  let formSubmitButton : DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCourseComponent ],
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
        HttpClientModule, 
        {provide: ActivatedRoute, useValue: {snapshot: {params: {'schedule_id': '4'}}}},
        {provide: UserService, useClass: MockUserService },
        {provide: ScheduleService, useClass: MockScheduleService },
       ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCourseComponent);
    component = fixture.componentInstance;
    testBedUserService = TestBed.get(UserService);
    userServiceStub = fixture.debugElement.injector.get(UserService);

    testBedScheduleService = TestBed.get(ScheduleService);
    scheduleServiceStub = fixture.debugElement.injector.get(ScheduleService);
    
    formSubmitButton = fixture.debugElement.nativeElement.querySelector("#addCourseSubmitButton");
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // testing dependency injections
  it('UserService injected via inject(...) and TestBed.get(...) should be the same instance',
      inject([UserService], (injectService: UserService) => {
        expect(injectService).toBe(testBedUserService);
      })
  );

  it('ScheduleService injected via inject(...) and TestBed.get(...) should be the same instance',
      inject([ScheduleService], (injectService: ScheduleService) => {
        expect(injectService).toBe(testBedScheduleService);
      })
  );

  it('UserService injected via component should be an instance of MockUserService', () => {
    expect(userServiceStub instanceof MockUserService).toBeTruthy();
  });

  it('ScheduleService injected via component should be an instance of MockScheduleService', () => {
    expect(scheduleServiceStub instanceof MockScheduleService).toBeTruthy();
  });

  // it('creating a course emits addedCourse event', () => {
  //   fixture.nativeElement.querySelector('#addCourseSubmitButton').click()

  //   // formSubmitButton.triggerEventHandler('click', null);
  //   expect(component.addedCourse.emit).toHaveBeenCalled();
  // })



});

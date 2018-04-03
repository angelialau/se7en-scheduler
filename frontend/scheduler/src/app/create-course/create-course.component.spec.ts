// general testing imports 
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
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
import { ScheduleService } from './../services/schedule.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarModule, MatSnackBarConfig, MatSnackBarRef, 
  SimpleSnackBar } from '@angular/material';
import { Announcement } from './../../models/announcement.model'
import { User } from './../../models/user.model'
import { Course, Session, CourseDetail, courseDetails, class_type, 
  durations } from './../../models/course.model';

import { CreateCourseComponent } from './create-course.component';

export class MockUserService extends UserService{}
export class MockScheduleService extends ScheduleService{}
export const aNewForm = (new FormBuilder).group({
      courseDetail: ['', Validators.required], // course object for course number, name, term
      core: ['', Validators.required],
      no_classes: ['', Validators.required], // 1-12
      class_size: ['', Validators.required], // 1-55
      prof_list: new FormArray([
        new FormGroup({
          id: new FormControl('', Validators.required)
        })
      ]), // to filter the profs for professors later
      sessions: new FormArray([
        new FormGroup({
          class_types: new FormControl('', Validators.required),
          venue_types: new FormControl('No preference'),
          sessions_hrs: new FormControl('', Validators.required),
          profs_involved: new FormArray([
            new FormGroup({
              profId: new FormControl('')
            })
          ])
        })
      ]), 
    })

describe('CreateCourseComponent', () => {
  let component: CreateCourseComponent;
  let fixture: ComponentFixture<CreateCourseComponent>;
  let userServiceStub : MockUserService;
  let testBedUserService : MockUserService;
  let scheduleServiceStub : MockScheduleService;
  let testBedScheduleService: MockScheduleService;

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
        RouterTestingModule,       
      ],
      providers: [ 
        HttpClientModule, 
        DatePipe,
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
    
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.profsInvolved).toBeTruthy();
    expect(component.tempInstructors).toBeUndefined();
    expect(component.tempInstructor_ids).toBeUndefined();
  });

  it('should have user service injected and instantiated', () => {
    expect(userServiceStub instanceof MockUserService).toBeTruthy();
    inject([UserService], (injectService: UserService) => {
      expect(injectService).toBe(testBedUserService);
    });
  });

  it('should have schedule service injected and instatiated', () => {
    expect(scheduleServiceStub instanceof MockScheduleService).toBeTruthy();
    inject([ScheduleService], (injectService: ScheduleService) => {
      expect(injectService).toBe(testBedScheduleService);
    });
  });

  it('should instantiate form and list of instructors at ngOnInit', () => {
    expect(component.newForm instanceof FormGroup).toBe(true);
    expect(component.instructors).toEqual(new Array);

    let creatFormSpy = spyOn(component, 'createForm');
    let getInstructorsSpy = spyOn(component, 'getInstructors');

    component.ngOnInit()
    
    expect(component.newForm).toBeDefined();
    expect(component.instructors).toBeDefined();
    expect(creatFormSpy).toHaveBeenCalled();
    expect(getInstructorsSpy).toHaveBeenCalled();
    expect(component.sessions instanceof FormArray).toBe(true);
    expect(component.prof_list instanceof FormArray).toBe(true);
  })

  it('should have a schedule id, and the correct class_type and durations when created', () => {
    expect(component.schedule_id).toBeDefined();
    expect(component.class_type).toBe(class_type);
    expect(component.durations).toBe(durations);
  })

  it('should invoke user service when getting instructors list', () => {
    let userServiceSpy = spyOn(userServiceStub, 'getAllInstructors').and.returnValue(
      Observable.of(HttpResponse)
    );    
    component.getInstructors();    
    expect(userServiceSpy).toHaveBeenCalled();
  })

  it('should invoke schedule service when adding a course', () => {
    let spy = spyOn(scheduleServiceStub, 'addCourse').and.returnValue(
      Observable.of(HttpResponse)
    );

    let button = fixture.debugElement.query(By.css("#addCourseSubmitButton"));    
    button.triggerEventHandler("click", null);

    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  })

  it('should call form reset function when rebuilding form', () => {
    let spy = spyOn(component.newForm, "reset");
    component.rebuildForm()
    expect(spy).toHaveBeenCalled();
    expect(component.sessions instanceof FormArray).toBe(true);
    expect(component.prof_list instanceof FormArray).toBe(true);
  })

  it('should invoke push methods of form array when adding items', () => {
    let sessionSpy = spyOn(component.sessions, "push");
    let profListSpy = spyOn(component.prof_list, "push");
    component.addSessionToCourse();
    component.addProfToCourse()
    
    expect(sessionSpy).toHaveBeenCalled();
    expect(profListSpy).toHaveBeenCalled();
  })

  it('should have an invalid form when empty', () => {
    expect(component.newForm.valid).toBeFalsy();
  });

  it('should require all fields when submitting a form', () => {
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.newForm.valid).toBeFalsy();
      let errors = [];
      let courseDetails = component.newForm.controls['courseDetails'];
      let no_classes = component.newForm.controls['no_classes'];
      let core = component.newForm.controls['core'];
      let prof_list = component.newForm.controls['prof_list'];
      let sessions = component.newForm.controls['sessions'];
      errors = [courseDetails.errors, no_classes.errors, core.errors,
        prof_list.errors, sessions.errors];
      for(let i=0; i< errors.length; i++){
        expect(errors[i]['required']).toBeTruthy();   
      }
   })
  });

  it('should return the correct course after filling up form', () => {
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.newForm.valid).toBeFalsy();
      let errors = [];
      let courseDetails = component.newForm.controls['courseDetails'];
      courseDetails.setValue('50.004');
      
      let no_classes = component.newForm.controls['no_classes'];
      no_classes.setValue('1');

      let class_size = component.newForm.controls['no_classes'];
      class_size.setValue('1');
      
      let core = component.newForm.controls['core'];
      core.setValue('1');
      
      let prof_list = component.newForm.controls['prof_list'];
      prof_list.setValue([ { "id": "57" } ]);
      
      let sessions = component.newForm.controls['sessions'];
      sessions.setValue([ { 
        "class_types": "Cohort Based Learning", 
        "venue_types": "Cohort Classroom", 
        "sessions_hrs": "1.5" } ]);
      expect(component.newForm.valid).toBeTruthy();
      let result = component.translateDataToCourse();
      expect(result instanceof Course).toBe(true);
      expect(result).toEqual( new Course(
        3,
        4,
        "50.004",
        "Introduction to Algorithms",
        1,
        1,
        1,
        1,
        "1.5",
        "No preference",
        "Cohort Based Learning",
        "Gemma Roig",
        "57",
        "null")
    )
      errors = [courseDetails.errors, no_classes.errors, core.errors,
        prof_list.errors, sessions.errors];
      for(let i=0; i< errors.length; i++){
        expect(errors[i]['pattern']).toBeFalsy();   
      }
   })
  });



});

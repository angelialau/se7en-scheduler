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
import { CookieService } from 'ng2-cookies';
import { ScheduleService } from './../services/schedule.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarModule, MatSnackBarConfig, MatSnackBarRef, 
  SimpleSnackBar } from '@angular/material';
import { Announcement } from './../../models/announcement.model'
import { User } from './../../models/user.model'
import { Course, Session, CourseDetail, courseDetails, class_type, 
  durations } from './../../models/course.model';
import { courseSorted, courseUnsorted, courseTestInput } from './test';

import { CreateCourseComponent } from './create-course.component';

export class MockUserService extends UserService{}
export class MockScheduleService extends ScheduleService{}

describe('CreateCourseComponent', () => {
  let component: CreateCourseComponent;
  let fixture: ComponentFixture<CreateCourseComponent>;
  let userServiceStub : MockUserService;
  let testBedUserService : MockUserService;
  let scheduleServiceStub : MockScheduleService;
  let testBedScheduleService: MockScheduleService;
  let snackBar : MatSnackBar;
  let snackBarSpy : jasmine.Spy;

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
        CookieService,
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
    snackBar = fixture.debugElement.injector.get(MatSnackBar);
    snackBarSpy = spyOn(snackBar, "open").and.returnValue(MatSnackBarRef);
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

  it('should have schedule service injected and instantiated', () => {
    expect(scheduleServiceStub instanceof MockScheduleService).toBeTruthy();
    inject([ScheduleService], (injectService: ScheduleService) => {
      expect(injectService).toBe(testBedScheduleService);
    });
  });

  it('should instantiate form at ngOnInit', () => {
    let creatFormSpy = spyOn(component, 'createForm');
    component.ngOnInit();

    expect(component.newForm instanceof FormGroup).toBe(true);
    expect(component.sessions instanceof FormArray).toBe(true);
    expect(component.prof_list instanceof FormArray).toBe(true);
    expect(component.newForm).toBeDefined();
    expect(creatFormSpy).toHaveBeenCalled();
  })

  it('should instantiate list of instructors for form at ngOnInit', () => {
    expect(component.instructors).toEqual(new Array);

    let getInstructorsSpy = spyOn(component, 'getInstructors').and.callThrough();
    component.ngOnInit()
    
    expect(component.instructors).toBeDefined();
    expect(getInstructorsSpy).toHaveBeenCalled();
  })

  it('should filter for trimester specific courses for form at ngOnInit', () => {

    let getInstructorsSpy = spyOn(component, 'getInstructors').and.callThrough();
    let schedSpy = spyOn(scheduleServiceStub, 'getSchedule').and.callFake(()=>{
      let options, currArray;
      component.filterHelper(options, currArray);
    });
    let filterHelperSpy = spyOn(component, 'filterHelper');
    let filterSpy = spyOn(component, 'filterCourseDetails').and.callFake(()=>{
      let id;
      scheduleServiceStub.getSchedule(id);
    });

    component.ngOnInit()
    
    expect(getInstructorsSpy).toHaveBeenCalled();
    expect(filterSpy).toHaveBeenCalled();
    expect(filterHelperSpy).toHaveBeenCalled();
    expect(schedSpy).toHaveBeenCalled();
  })

  it('should initialise schedule id and form options at ngOnInit', () => {
    expect(component.schedule_id).toBeDefined();
    expect(component.class_type).toBe(class_type);
    expect(component.durations).toBe(durations);
    expect(component.no_classesRange).toEqual([1,2,3,4,5,6,7,8,9,10,11,12]);
    expect(component.class_sizeRange).toEqual([ 1, 2, 3, 4, 5, 6, 7, 8, 9,
     10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
     28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
     46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60 ]);
  })

  it('should invoke user service when getting instructors list', () => {
    let userServiceSpy = spyOn(userServiceStub, 'getAllInstructors').and.returnValue(
      Observable.of(HttpResponse)
    );    
    component.getInstructors();    
    expect(userServiceSpy).toHaveBeenCalled();
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
        expect(errors[i]['required']).toBe(true);   
      }
   })
  });

  it('should call removeAt method when deleting prof or session', () => {
    let profsISpy = spyOn(component.profsInvolved, "splice");
    let profListSpy = spyOn(component.prof_list, "removeAt");
    let sessionSpy = spyOn(component.sessions, "removeAt");
    let index = 0;

    let prof_list = component.newForm.controls['prof_list'];
    prof_list.setValue([ { "id": "57" }]);
    let sessions = component.newForm.controls['sessions'];
    sessions.setValue([ { 
      "class_types": "Cohort Based Learning", 
      "venue_types": "Cohort Classroom", 
      "sessions_hrs": "1.5" } ]);

    fixture.whenStable().then(()=>{
      component.deleteProf(index);
      component.deleteSession(index);
      // expect(profsISpy).toHaveBeenCalled(); //TODO
      expect(profListSpy).toHaveBeenCalled();  
      expect(sessionSpy).toHaveBeenCalled();  
    })
  })

  it('should remove prof id and name when user deletes prof', ()=> {
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.newForm.valid).toBe(false);
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
      prof_list.setValue([ { "id": "57" }, { "id": "58" }, { "id": "59" } ]);
      
      let sessions = component.newForm.controls['sessions'];
      sessions.setValue([ { 
        "class_types": "Cohort Based Learning", 
        "venue_types": "Cohort Classroom", 
        "sessions_hrs": "1.5" }, { 
        "class_types": "Lab", 
        "venue_types": "No preference", 
        "sessions_hrs": "2" }  ]);
      expect(component.newForm.valid).toBe(true);
      component.deleteProf(0);
      component.deleteSession(0)
      let result = component.translateDataToCourse();
      expect(result instanceof Course).toBe(true);
      expect(result).toEqual( new Course(
        3,4,"50.004","Introduction to Algorithms","ISTD",1,1,1,1,
        "1.5,2",
        "No preference",
        "Lab",
        "David Yau,Subhajit Datta",
        "58,59",
        "null")
    )
      errors = [courseDetails.errors, no_classes.errors, core.errors,
        prof_list.errors, sessions.errors];
      for(let i=0; i< errors.length; i++){
        expect(errors[i]['pattern']).toBe(false);   
      }
    })
  })

  it('should build the correct course from the form submitted', () => {
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.newForm.valid).toBe(false);
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
      expect(component.newForm.valid).toBe(true);
      let result = component.translateDataToCourse();
      expect(result instanceof Course).toBe(true);
      expect(result).toEqual( new Course(
        3,4,"50.004","Introduction to Algorithms","ISTD",1,1,1,1,
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
        expect(errors[i]['pattern']).toBe(false);
      }
    })
  })

  it('should invoke schedule service, course builder and snack bar when adding a course', () => {
    let schedSpy = spyOn(scheduleServiceStub, 'addCourse').and.returnValue(
      Observable.of(HttpResponse)
    );

    component.ngOnInit();
    fixture.whenStable().then(() => {
      let sendSpy = spyOn(component, 'onSend');
      let translateSpy = spyOn(component, 'translateDataToCourse').and.returnValue(Course);
      let emitSpy = spyOn(component.addedCourse, 'emit');
      
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

      let button = fixture.debugElement.query(By.css("#addCourseSubmitButton"));    
      button.triggerEventHandler("click", null);

      fixture.detectChanges();
      expect(schedSpy).toHaveBeenCalled();
      expect(sendSpy).toHaveBeenCalled();
      expect(translateSpy).toHaveBeenCalled();
      expect(snackBarSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalled();
    })
  })
  
  it('should generate the right range when creating range', ()=> {
    let ans = [1,2,3,4,5];
    let output = component.createRange(5);
    expect(output).toEqual(ans);
  })

  it('should throw error when trying to create negative or zero range', () => {
    let output;
    expect(function(){output = component.createRange(-3);})
      .toThrowError('range must start from 1');
    expect(function(){output = component.createRange(0);})
      .toThrowError('range must start from 1');
  })

  it('should return correct name and term when querying course',()=> {
    component.courseDetails = courseSorted;
    let course_no= "50.006";
    let course_name= "User Interface Design and Implementation";
    let term = 7;
    let pillar= "ISTD";
    
    let output = component.queryCourse(course_no, "course_name");
    expect(output).toEqual(course_name);
    output = component.queryCourse(course_no, "term");
    expect(output).toEqual(term);
    output = component.queryCourse(course_no, "pillar");
    expect(output).toEqual(pillar);
  })

  it('should throw error if course number or param not found when querying course',()=> {    
    component.courseDetails = courseSorted;
    expect(function(){
      component.queryCourse("50.34", "course_name")
    }).toThrow(new Error('course to be queried not found'));
    expect(function(){
      component.queryCourse("50.006", "curse_name")
    }).toThrow(new Error('param not found'));
  })
  
  it('should return correct name when querying instructors', ()=>{
    component.instructors = [
    new User("david_yau@sutd.edu.sg","password", "ISTD","David Yau", 88881111,58)]
    let output = component.queryInstructors(58);
    expect(output).toBe("David Yau");
  })

  it('should throw error if instructor not found when querying instructors', ()=>{
    component.instructors = [
    new User("david_yau@sutd.edu.sg","password", "ISTD","David Yau", 88881111,58)]
    expect(function(){component.queryInstructors(59)}).toThrow(new 
      Error("instructor to be queried not found"));
  })

  it('should update list of profs involved according to checked condition', ()=>{
    expect(component.profsInvolved).toEqual([]);
    let mockEvent = {
      target: {
        checked: true,
      },
    }
    
    let spy = spyOn(component,'updateProfsInvolved').and.callThrough();
    let sessionIndex = 0;
    let profId = 12;

    component.updateProfsInvolved(mockEvent, sessionIndex, profId);
    component.updateProfsInvolved(mockEvent, sessionIndex, 13);
    component.updateProfsInvolved(mockEvent, 1, 13);
    expect(spy.calls.count()).toEqual(3);
    expect(component.profsInvolved).toEqual([[12,13],[13]]);
    
    let mockUncheckEvent = {
      target: {
        checked: false,
      },
    }
    expect(mockUncheckEvent.target.checked).toBeFalsy();
    sessionIndex = 1;
    profId = 13;
    component.updateProfsInvolved(mockUncheckEvent, sessionIndex, profId);
    expect(spy).toHaveBeenCalledWith(mockUncheckEvent, sessionIndex, profId);
    expect(component.profsInvolved).toEqual([[12,13],[]]);
  })

  it('should parse instructors by session when creating course', ()=>{
    component.instructors = [
    {
        "name": "James Wan",
        "email": "james_wan@sutd.edu.sg",
        "phone": 64994781,
        "password": "password",
        "pillar": "ESD",
        "schedules": null,
        "courses": null,
        "id": 51,
    },
    {
        "name": "Selin Damla Ahipasaoglu",
        "email": "Ahipasaoglu@sutd.edu.sg",
        "phone": 64994529,
        "password": "password",
        "pillar": "ESD",
        "schedules": null,
        "courses": null,
        "id": 55,
    },
    ]
    component.profsInvolved = [[51],[55],[51,55]]; //51|55|51,55
    expect(component.tempInstructor_ids).toBeUndefined();
    expect(component.tempInstructors).toBeUndefined();

    let spy = spyOn(component, 'prof_listParser').and.callThrough();
    let querySpy = spyOn(component, 'queryInstructors').and.callThrough();

    component.prof_listParser();
    expect(spy).toHaveBeenCalled();
    expect(querySpy).toHaveBeenCalled();
    expect(component.tempInstructor_ids).toEqual("51|55|51,55");
    expect(component.tempInstructors).toBe("James Wan|Selin Damla Ahipasaoglu|James Wan,Selin Damla Ahipasaoglu");
  })

  it('should return the correctly delimited string when using sessions parser', ()=>{
    let sessions = [ { 
      "class_types": "Cohort Based Learning", 
      "venue_types": "Cohort Classroom", 
      "sessions_hrs": "1.5" },
      { 
      "class_types": "Lab", 
      "venue_types": "Think Tank", 
      "sessions_hrs": "2" },
      { 
      "class_types": "Lecture", 
      "venue_types": "Lecture Theatre", 
      "sessions_hrs": "3" }
    ];

    let spy = spyOn(component, 'sessionsParser').and.callThrough();

    let result = component.sessionsParser(sessions, "sessions_hrs");
    expect(result).toBe('1.5,2,3');
    result = component.sessionsParser(sessions, "class_types");
    expect(result).toBe('Cohort Based Learning,Lab,Lecture');
    result = component.sessionsParser(sessions, "venue_types");
    expect(result).toBe('Cohort Classroom,Think Tank,Lecture Theatre');
    expect(spy.calls.count()).toBe(3);
  })

  it('should throw exception if param not found for session parser', ()=>{
    let sessions = [ { 
      "class_types": "Cohort Based Learning", 
      "venue_types": "Cohort Classroom", 
      },
    ];
    let spy = spyOn(component, 'sessionsParser').and.callThrough();
    let queryspy = spyOn(component, 'queryInstructors').and.callThrough();
    let result = component.sessionsParser(sessions, "sessions_hrs");
    expect(spy).toThrow(new Error('param not found'));
  })

  // it('should have proper filter helper', ()=>{
  //   // component.courseDetails = courseTestInput;
  //   let options = [[3,5,7],[1,8],[2,4,6]];
  //   let spy = spyOn(component, 'filterHelper').and.callFake((options: Array<number>, currArray: Array<any>)=>{
  //     let newArray = [];
  //     for(let course of currArray){
  //       if(options.includes(course.term)){
  //         newArray.push(course);
  //       }
  //     }  
  //     newArray.sort(function(a,b) {
  //       if(a.pillar.localeCompare(b.pillar) === 0){
  //         if(a.term == b.term){
  //           return a.course_no.localeCompare(b.course_no);  
  //         }else{ return a.term - b.term; }
  //       }else{
  //         return a.pillar.localeCompare(b.pillar);
  //       }
  //     })
  //     return newArray;
  //   });

  //   let ans = component.filterHelper(options, courseTestInput);
  //   expect(ans).toEqual(courseSorted);

  //   expect(spy).toHaveBeenCalled();
  // })
});

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
import { User } from './../../models/user.model'
import { Event, days } from './../../models/event.model';

import { CreateEventComponent } from './create-event.component';

export class MockUserService extends UserService{}
export class MockScheduleService extends ScheduleService{}

describe('CreateEventComponent', () => {
  let component: CreateEventComponent;
  let fixture: ComponentFixture<CreateEventComponent>;
  let userServiceStub : MockUserService;
  let testBedUserService : MockUserService;
  let scheduleServiceStub : MockScheduleService;
  let testBedScheduleService: MockScheduleService;
  let snackBar : MatSnackBar;
  let snackBarSpy : jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEventComponent ],
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
    fixture = TestBed.createComponent(CreateEventComponent);
    component = fixture.componentInstance;
    testBedUserService = TestBed.get(UserService);
    userServiceStub = fixture.debugElement.injector.get(UserService);
    snackBar = fixture.debugElement.injector.get(MatSnackBar);
    snackBarSpy = spyOn(snackBar, "open").and.returnValue(MatSnackBarRef);
    testBedScheduleService = TestBed.get(ScheduleService);
    scheduleServiceStub = fixture.debugElement.injector.get(ScheduleService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should initialise schedule id and form options at ngOnInit', ()=>{
    fixture.detectChanges()
    expect(Number(component.schedule_id)).toBe(4);
    expect(component.today).toBe(scheduleServiceStub.getTodayDate());
    expect(component.searchForm instanceof Event).toBeTruthy();
    expect(Number(component.searchForm.schedule_id)).toBe(4);
    expect(component.newEvent instanceof Event).toBeTruthy();
    expect(Number(component.newEvent.schedule_id)).toBe(4);
    expect(component.timeslots).toEqual([]);    
  })

  it('should invoke user service when getting instructors', ()=>{
    let spy = spyOn(component, 'getInstructors').and.callFake(function(){
      userServiceStub.getAllInstructors();
    });
    let servicespy = spyOn(userServiceStub, 'getAllInstructors');
    component.getInstructors();
    expect(spy).toHaveBeenCalled();
    expect(servicespy).toHaveBeenCalled();
  })

  it('should return correct time slot given a specific HH:MM time', ()=>{
    let time = '10:30';
    let ans = component.parseTime(time);
    expect(ans).toEqual(4);

    time = '15:00';
    ans = component.parseTime(time);
    expect(ans).toEqual(13);
  })

  it('should reject time that is not between 830 and 1600, and are not at 00' 
    + ' or 30 min intervals', ()=>{
    let time = '06:00';
    expect(function(){component.parseTime(time)}).toThrow(
      new Error('invalid time given, should be between 0830 to 1600'));

    time = '16:30';
    expect(function(){component.parseTime(time)}).toThrow(
      new Error('invalid time given, should be between 0830 to 1600'));

    time = '08:45';
    expect(function(){component.parseTime(time)}).toThrow(
      new Error('invalid time given, should be between 0830 to 1600'));
  })

  it('should return the correct day given a specific date', ()=>{
    let d = '2018-04-04';
    let ans = component.parseDate(new Date(d));
    expect(ans).toEqual(3);
  })

  it('should return the correct index given a specific day', ()=>{
    component.searchForm.day = 'Monday';
    let ans = component.parseDay();
    expect(ans).toEqual(1);
  })
});

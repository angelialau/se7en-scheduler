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
import { User } from './../../models/user.model'
import { Event, Search, days} from './../../models/event.model';

import { CreateEventComponent } from './create-event.component';

export class MockUserService extends UserService{}
export class MockScheduleService extends ScheduleService{}
export class MockCookieService extends CookieService {}

describe('CreateEventComponent', () => {
  let component: CreateEventComponent;
  let fixture: ComponentFixture<CreateEventComponent>;
  let userServiceStub : MockUserService;
  let testBedUserService : MockUserService;
  let scheduleServiceStub : MockScheduleService;
  let testBedScheduleService: MockScheduleService;
  let cookieServiceStub: MockCookieService;
  let testBedCookieService: MockCookieService;
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
        {provide: ActivatedRoute, useValue: {snapshot: {params: {'schedule_id': 4}}}},
        {provide: UserService, useClass: MockUserService },
        {provide: ScheduleService, useClass: MockScheduleService },
        {provide: CookieService, useClass: MockCookieService}, 
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
    testBedCookieService = TestBed.get(CookieService);
    cookieServiceStub = fixture.debugElement.injector.get(CookieService);

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

  it('should have cookie service injected and instantiated', () => {
    expect(cookieServiceStub instanceof MockCookieService).toBeTruthy();
    inject([CookieService], (injectService: CookieService) => {
      expect(injectService).toBe(testBedCookieService);
    });
  });

  it('should initialise schedule id and form options at ngOnInit', ()=>{
    let spy = spyOn(cookieServiceStub, 'get');
    component.ngOnInit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();

    expect(component.schedule_id).toBe(4);
    
    
    expect(component.timeslots).toEqual([]); 
    expect(component.venues).toEqual([]); 
    expect(component.dates).toEqual([]); 
    expect(component.startTimes).toEqual([]); 
    expect(component.endTimes).toEqual([]); 

    expect(component.noItems).toBe(false);   
    expect(component.showEventList).toBe(true);   
    expect(component.showEventForm).toBe(true);   
    expect(component.showDateSelection).toBe(false);   
    expect(component.showTimeSelection).toBe(false);   
    expect(component.showEndSelection).toBe(false);   
  })

  it('should call service when adding event', ()=>{
    let event: Event;
    let spy = spyOn(scheduleServiceStub, 'addEvent');
    let compspy = spyOn(component, 'addEvent').and.callFake(()=>{
      scheduleServiceStub.addEvent(event);
    });
    component.addEvent();
    expect(spy).toHaveBeenCalled();
    expect(compspy).toHaveBeenCalled();
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

  it('should return correct HH:MM given specific index', ()=>{
    let time = 0;
    let ans = component.reverseParseTime(time);
    expect(ans).toEqual('08:30');

    time = 13;
    ans = component.reverseParseTime(time);
    expect(ans).toEqual('15:00');
  })

  it('should reject index that is not between 0 and 19', ()=>{
    let time = -1;
    expect(function(){component.reverseParseTime(time)}).toThrow(
      new Error('To reverse parse time, n must be between 0 and 19'));

    time = 20;
    expect(function(){component.reverseParseTime(time)}).toThrow(
      new Error('To reverse parse time, n must be between 0 and 19'));
  })

  it('should return correct time slot given a specific HH:MM time', ()=>{
    let time = '10:30';
    let ans = component.parseTime(time);
    expect(ans).toEqual(4);

    time = '15:00';
    ans = component.parseTime(time);
    expect(ans).toEqual(13);
  })

  it('should reject time that is not between 830 and 1800, and are not at 00' 
    + ' or 30 min intervals', ()=>{
    let time = '08:00';
    expect(function(){component.parseTime(time)}).toThrowError(
      'invalid time given, should be between 0830 to 1800');

    time = '-08:00';
    expect(function(){component.parseTime(time)}).toThrowError(
      'invalid time given, should be between 0830 to 1800');

    time = '18:30';
    expect(function(){component.parseTime(time)}).toThrowError(
      'invalid time given, should be between 0830 to 1800');

    time = '08:45';
    expect(function(){component.parseTime(time)}).toThrowError(
      'invalid time given, should be between 0830 to 1800');
  })

  it('should return the correct day given a specific date', ()=>{
    let d = '2018-04-04';
    let ans = component.parseDate(d);
    expect(ans).toEqual(3);
  })

  it('should return the correct index given a specific day', ()=>{
    component.searchForm = new Search(component.schedule_id,'','','','','');
    component.searchForm.day = 'Monday';
    let ans = component.parseDay();
    expect(ans).toEqual(1);
  })
});

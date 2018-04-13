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
import { ScheduleService } from './../services/schedule.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarModule, MatSnackBarConfig, MatSnackBarRef, 
  SimpleSnackBar } from '@angular/material';
import { Schedule } from './../../models/schedule.model';
import { CookieService } from 'ng2-cookies';

import { ViewSchedulesComponent } from './view-schedules.component';

export class MockScheduleService extends ScheduleService{}
export class MockCookieService extends CookieService{}

describe('ViewSchedulesComponent', () => {
  let component: ViewSchedulesComponent;
  let fixture: ComponentFixture<ViewSchedulesComponent>;
  let scheduleServiceStub : MockScheduleService;
  let testBedScheduleService: MockScheduleService;
  let cookieServiceStub: MockCookieService;
  let testBedCookieService: MockCookieService;
  let snackBar : MatSnackBar;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSchedulesComponent ],
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
        {provide: ScheduleService, useClass: MockScheduleService },
        {provide: CookieService, useClass: MockCookieService}, 
       ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSchedulesComponent);
    component = fixture.componentInstance;
    snackBar = fixture.debugElement.injector.get(MatSnackBar);
    testBedScheduleService = TestBed.get(ScheduleService);
    scheduleServiceStub = fixture.debugElement.injector.get(ScheduleService);
    testBedCookieService = TestBed.get(CookieService);
    cookieServiceStub = fixture.debugElement.injector.get(CookieService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should get and initialise schedules at ngOnInit', ()=>{
    let data = {
      body: [
      new Schedule(1,2018),
      new Schedule(2,2018),
      new Schedule(3,2018),
      ]
    }
    let servicespy = spyOn(scheduleServiceStub, 'getSchedules').and.callFake(()=>{
      component.schedules = data.body;
    })
    let spy = spyOn(component, 'getSchedules').and.callFake(()=>{
      scheduleServiceStub.getSchedules();
    });

    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(servicespy).toHaveBeenCalled();
    expect(component.schedules).toBeDefined();
    expect(component.schedules).toEqual(data.body);
  })

  it('should call service, snackbar and refresh schedules after adding schedule', ()=>{
    component.schedule = new Schedule(1,2018);
    let snackbarspy = spyOn(snackBar, 'open');
    let compspy = spyOn(component, 'getSchedules');
    let servicespy = spyOn(scheduleServiceStub, 'createSchedule').and
      .callFake((schedule: Schedule)=>{
        snackBar.open('msg');
        component.getSchedules();
    })
    let sendspy = spyOn(component, 'addSchedule').and.callFake(()=>{
      scheduleServiceStub.createSchedule(component.schedule);
    });

    component.addSchedule();

    expect(sendspy).toHaveBeenCalled();
    expect(servicespy).toHaveBeenCalled();
    expect(snackbarspy).toHaveBeenCalled();
    expect(compspy).toHaveBeenCalled();
  })

  it('should call service, snackbar and refresh scedules after deleting schedule', ()=>{
    component.schedule = new Schedule(1,2018);
    let snackbarspy = spyOn(snackBar, 'open');
    let compspy = spyOn(component, 'getSchedules');
    let servicespy = spyOn(scheduleServiceStub, 'deleteSchedule').and
      .callFake((schedule: Schedule)=>{
        snackBar.open('msg');
        component.getSchedules();
    })
    let deletespy = spyOn(component, 'deleteSchedule').and.callFake(()=>{
      scheduleServiceStub.deleteSchedule(component.schedule);
    });

    component.deleteSchedule(component.schedule);

    expect(deletespy).toHaveBeenCalled();
    expect(servicespy).toHaveBeenCalled();
    expect(snackbarspy).toHaveBeenCalled();
    expect(compspy).toHaveBeenCalled();
  })

  it('should toggle schedule list views when clicking on div', ()=>{
    let spy = spyOn(component, 'showSchedules').and.callThrough();
    expect(component.showScheduleList).toBe(true);
    component.showSchedules();
    expect(component.showScheduleList).toBe(false);
    expect(spy).toHaveBeenCalled();
    component.showSchedules();
    expect(component.showScheduleList).toBe(true);
    expect(spy).toHaveBeenCalled();
  })

  it('should toggle schedule form views when clicking on div', ()=>{
    let spy = spyOn(component, 'showScheduleForm').and.callThrough();
    expect(component.showAddScheduleForm).toBe(false);
    component.showScheduleForm();
    expect(component.showAddScheduleForm).toBe(true);
    expect(spy).toHaveBeenCalled();
    component.showScheduleForm();
    expect(component.showAddScheduleForm).toBe(false);
    expect(spy).toHaveBeenCalled();
  })
});

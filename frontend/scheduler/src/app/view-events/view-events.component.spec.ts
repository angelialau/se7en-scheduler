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
import { ScheduleService } from './../services/schedule.service';
import { Schedule } from './../../models/schedule.model';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ng2-cookies';

import { ViewEventsComponent } from './view-events.component';

export class MockScheduleService extends ScheduleService{}
export class MockCookieService extends CookieService{}

describe('ViewEventsComponent', () => {
  let component: ViewEventsComponent;
  let fixture: ComponentFixture<ViewEventsComponent>;
  let scheduleServiceStub : MockScheduleService;
  let testBedScheduleService: MockScheduleService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEventsComponent ],
      imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,       
      ],
      providers: [ 
        HttpClientModule, 
        DatePipe,
        {provide: ActivatedRoute, useValue: {snapshot: {params: {'schedule_id': '25'}}}},
        {provide: ScheduleService, useClass: MockScheduleService },
        {provide: CookieService, useClass: MockCookieService}, 
       ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEventsComponent);
    component = fixture.componentInstance;
    testBedScheduleService = TestBed.get(ScheduleService);
    scheduleServiceStub = fixture.debugElement.injector.get(ScheduleService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.schedules).toEqual([]);
    expect(component.schedule_id).toEqual(-1);
  });

  it('should have schedule service injected and instantiated', () => {
    expect(scheduleServiceStub instanceof MockScheduleService).toBeTruthy();
    inject([ScheduleService], (injectService: ScheduleService) => {
      expect(injectService).toBe(testBedScheduleService);
    });
  });

  it('should call schedule service at ngOnInit', ()=>{
    let data = {
      body: [new Schedule(1,2018), new Schedule(2,2018), new Schedule(3,2018)]
    }
    let serviceSpy = spyOn(scheduleServiceStub, 'getSchedules').and.callFake(()=>{
      component.schedules = data.body;
    })
    let spy = spyOn(component, 'ngOnInit').and.callFake(()=>{
      scheduleServiceStub.getSchedules();
    })
    component.ngOnInit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(serviceSpy).toHaveBeenCalled();
    expect(component.schedules).toEqual(data.body);
  })


});

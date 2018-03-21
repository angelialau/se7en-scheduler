import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { Schedule } from './../../models/schedule.model';
import { ScheduleService } from './../services/schedule.service';

import { ViewSchedulesComponent } from './view-schedules.component';

describe('ViewSchedulesComponent', () => {
  let component: ViewSchedulesComponent;
  let fixture: ComponentFixture<ViewSchedulesComponent>;

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
        RouterTestingModule

      ],
      providers: [ ScheduleService, HttpClientModule, 
      {provide: ActivatedRoute, useValue: {snapshot: {params: {'schedule_id': '4'}}}} ],
      // schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

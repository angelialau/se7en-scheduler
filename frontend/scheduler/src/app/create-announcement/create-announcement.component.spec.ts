// general testing imports 
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// general imports 
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
// component specific imports 
import { UserService } from './../services/user.service';
import { ScheduleService } from './../services/schedule.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarModule, MatSnackBarConfig, MatSnackBarRef, 
  SimpleSnackBar } from '@angular/material';
import { Announcement } from './../../models/announcement.model'
import { User } from './../../models/user.model'

import { CreateAnnouncementComponent } from './create-announcement.component';

export class MockUserService extends UserService{
  changePassword(oldPassword: string, newPassword: string): Observable<any>{
    return Observable.of(HttpResponse);
  }
}
export class MockScheduleService extends ScheduleService{
  
}

describe('CreateAnnouncementComponent', () => {
  let component: CreateAnnouncementComponent;
  let fixture: ComponentFixture<CreateAnnouncementComponent>;
  let userServiceStub : MockUserService;
  let testBedUserService : MockUserService;
  let scheduleServiceStub : MockScheduleService;
  let testBedScheduleService: MockScheduleService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAnnouncementComponent ], 
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
        { provide: UserService, useClass: MockUserService } , 
        { provide: ScheduleService, useClass: MockScheduleService } , 
        HttpClientModule, 
        DatePipe,
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAnnouncementComponent);
    component = fixture.componentInstance;

    testBedUserService = TestBed.get(UserService);
    userServiceStub = fixture.debugElement.injector.get(UserService);

    
    testBedScheduleService = TestBed.get(ScheduleService);
    scheduleServiceStub = fixture.debugElement.injector.get(ScheduleService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  })

  it('should have user service injected',
    inject([UserService], (injectService: UserService) => {
      expect(injectService).toBe(testBedUserService);
    })
  );

  it('should have user service instantiated', () => {
    expect(userServiceStub instanceof MockUserService).toBeTruthy();
  });

  it('should have schedule service injected',
    inject([ScheduleService], (injectService: ScheduleService) => {
      expect(injectService).toBe(testBedScheduleService);
    })
  );

  it('should have schedule service instantiated', () => {
    expect(scheduleServiceStub instanceof MockScheduleService).toBeTruthy();
  });

  it('should define today and newAnnouncement at ngOnInit', () => {
    expect(component.today).toBeDefined();
    expect(component.newAnnouncement instanceof Announcement).toBeDefined();
  })

  it('should call announcement initialiser at ngOnInit', () => {
    const spy = spyOn(component, 'initialiseAnnouncement');

    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  })

  it('should invoke service when making announcement', () => {
    const spy = spyOn(userServiceStub, 'makeAnnouncements').and.returnValue(
      Observable.of(HttpResponse)
    );

    let button = fixture.debugElement.query(By.css("#announcementButton"));    
    button.triggerEventHandler("click", null);

    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  })

});

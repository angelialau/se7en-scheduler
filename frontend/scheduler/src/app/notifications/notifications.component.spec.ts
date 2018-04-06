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
// import { RouterTestingModule } from '@angular/router/testing';
// component specific imports 
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { UserService } from './../services/user.service';
import { CookieService } from 'ng2-cookies';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarModule, MatSnackBarConfig, MatSnackBarRef, 
  SimpleSnackBar } from '@angular/material';
import { Announcement } from './../../models/announcement.model'

import { NotificationsComponent } from './notifications.component';

export class MockUserService extends UserService{}

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let userServiceStub : MockUserService;
  let testBedUserService : MockUserService;
  let snackBar : MatSnackBar;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsComponent ],
      imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        // RouterTestingModule,        
      ],
      providers: [ 
        HttpClientModule, 
        DatePipe,
        {provide: UserService, useClass: MockUserService },
        CookieService,
       ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    testBedUserService = TestBed.get(UserService);
    userServiceStub = fixture.debugElement.injector.get(UserService);
    snackBar = fixture.debugElement.injector.get(MatSnackBar);
    
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.announcements).toEqual([]);
  });

  it('should have user service injected and instantiated', () => {
    expect(userServiceStub instanceof MockUserService).toBeTruthy();
    inject([UserService], (injectService: UserService) => {
      expect(injectService).toBe(testBedUserService);
    });
  });

  it('should invoke refresh announcements and user service at ngOnInit', ()=>{
    let refreshAnnouncementsSpy = spyOn(component, 'refreshAnnouncements').and.callThrough();
    let userspy = spyOn(userServiceStub, 'getAnnouncements').and.returnValue(Observable.of(HttpResponse));
    component.ngOnInit();
    expect(refreshAnnouncementsSpy).toHaveBeenCalled();
    expect(userspy).toHaveBeenCalled();
  })
  
  it('should invoke user service when deleting announcements', ()=>{
    let snackbarspy = spyOn(snackBar, 'open');
    let userspy = spyOn(userServiceStub, 'deleteAnnouncement').and.callFake((id)=>{
      snackBar.open('msg');
      return (Observable.of(HttpResponse))
    })
    let deletespy = spyOn(component, 'deleteAnnouncement').and.callFake((id)=>{
      userServiceStub.deleteAnnouncement(id);
    })
    component.deleteAnnouncement(1);
    fixture.autoDetectChanges();
    fixture.whenStable().then(()=>{
      expect(snackbarspy).toHaveBeenCalled();
      expect(userspy).toHaveBeenCalled();
    })
  })

});

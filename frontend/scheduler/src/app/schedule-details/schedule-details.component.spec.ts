// // general testing imports 
// import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
// import { HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// // general imports 
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { RouterModule, Router, ActivatedRoute } from '@angular/router';
// import { BrowserModule, By } from '@angular/platform-browser';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
// import { RouterTestingModule } from '@angular/router/testing';
// // component specific imports 
// import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
// import { ScheduleService } from './../services/schedule.service';
// import { DatePipe } from '@angular/common';
// import { MatSnackBar, MatSnackBarModule, MatSnackBarConfig, MatSnackBarRef, 
//   SimpleSnackBar } from '@angular/material';
// import { Course } from './../../models/course.model';
// import { Schedule } from './../../models/schedule.model';

// import { ScheduleDetailsComponent } from './schedule-details.component';

// export class MockScheduleService extends ScheduleService{}

// describe('ScheduleDetailsComponent', () => {
//   let component: ScheduleDetailsComponent;
//   let fixture: ComponentFixture<ScheduleDetailsComponent>;
//   let scheduleServiceStub : MockScheduleService;
//   let testBedScheduleService: MockScheduleService;
//   let snackBar : MatSnackBar;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ScheduleDetailsComponent ],
//       imports: [
//         BrowserModule,
//         HttpClientModule,
//         BrowserAnimationsModule,
//         MatSnackBarModule,
//         FormsModule,
//         ReactiveFormsModule,
//         RouterTestingModule,       
//       ],
//       providers: [ 
//         HttpClientModule, 
//         DatePipe,
//         {provide: ActivatedRoute, useValue: {snapshot: {params: {'schedule_id': 3}}}},
//         {provide: ScheduleService, useClass: MockScheduleService },
//        ],
//       schemas: [ NO_ERRORS_SCHEMA ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ScheduleDetailsComponent);
//     component = fixture.componentInstance;
//     snackBar = fixture.debugElement.injector.get(MatSnackBar);
//     testBedScheduleService = TestBed.get(ScheduleService);
//     scheduleServiceStub = fixture.debugElement.injector.get(ScheduleService);

//     fixture.detectChanges();
//   });

//   fit('should create', () => {
//     expect(component).toBeTruthy();
    
//     expect(component.schedule_id).toBeDefined();
//     expect(component.schedule_id).toEqual(3);
//     expect(component.generated).toBeFalsy();
    
//     expect(component.courseIDs).toEqual([]);
//     expect(component.courses).toEqual([]);

//     expect(component.showCourseList).toBeTruthy();
//     expect(component.showEventForm).toBeFalsy();
//     expect(component.showCourseForm).toBeFalsy();
//   });

//   fit('should have schedule service injected and instantiated', () => {
//     expect(scheduleServiceStub instanceof MockScheduleService).toBeTruthy();
//     inject([ScheduleService], (injectService: ScheduleService) => {
//       expect(injectService).toBe(testBedScheduleService);
//     });
//   });

//   fit('should instantiate courses given valid http response at ngOnInit', ()=>{
//     let validCourse = new Course(1,1,'1','1',1,1,1,1,'1','1','1','1','1','1',1);
//     let response = {
//       body: [validCourse, validCourse, validCourse],
//       status: 200,
//     }
//     let spy = spyOn(component, 'refreshCourses').and.callFake(()=>{
//       component.getCourses(component.schedule_id);
//     });
//     let coursespy = spyOn(component, 'getCourses').and.callFake(()=>{
//       scheduleServiceStub.getCoursesInSchedule(component.schedule_id);
//     });
//     let servicespy = spyOn(scheduleServiceStub,'getCoursesInSchedule').and
//       .callFake((id: number)=>{
//         if(response.status ==200){
//           let array : Course[] = response.body;
//             component.courses = array;  
//         }else{
//           component.courses = [];
//         }
//       }
//     )
//     component.ngOnInit();
//     fixture.autoDetectChanges();
//     fixture.whenStable().then(()=>{
//       expect(spy).toHaveBeenCalled();
//       expect(coursespy).toHaveBeenCalled();
//       expect(servicespy).toHaveBeenCalled();
//       expect(component.courses).toEqual([validCourse, validCourse, validCourse]);
//     })
//   })

//   fit('should return empty course array given valid http response, but no courses registered at ngOnInit', ()=>{
//     let nullCourse = new Course(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
//     let response = {
//       body: {
//         message: 'no rows found',
//         success: false,
//       },
//       status: 200,
//     }
//     let spy = spyOn(component, 'refreshCourses').and.callFake(()=>{
//       component.getCourses(component.schedule_id);
//     });
//     let coursespy = spyOn(component, 'getCourses').and.callFake(()=>{
//       scheduleServiceStub.getCoursesInSchedule(component.schedule_id);
//     });
//     let servicespy = spyOn(scheduleServiceStub,'getCoursesInSchedule').and
//       .callFake((id: number)=>{
//         if(response.status ==200){
//           if(response.body.success != undefined && response.body.success===false){
//            component.courses = [nullCourse] 
//           }
//         }else{
//           component.courses = [];
//         }
//       }
//     )
//     component.ngOnInit();
//     fixture.autoDetectChanges();
//     fixture.whenStable().then(()=>{
//       expect(spy).toHaveBeenCalled();
//       expect(coursespy).toHaveBeenCalled();
//       expect(servicespy).toHaveBeenCalled();
//       expect(component.courses).toEqual([nullCourse]);
//     })
//   })

//   fit('should return empty array given invalid http response at ngOnInit', ()=>{
//     let nullCourse = new Course(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
//     let response = {
//       body: {
//         message: 'no rows found',
//         success: false,
//       },
//       status: 404,
//     }
//     let spy = spyOn(component, 'refreshCourses').and.callFake(()=>{
//       component.getCourses(component.schedule_id);
//     });
//     let coursespy = spyOn(component, 'getCourses').and.callFake(()=>{
//       scheduleServiceStub.getCoursesInSchedule(component.schedule_id);
//     });
//     let servicespy = spyOn(scheduleServiceStub,'getCoursesInSchedule').and
//       .callFake((id: number)=>{
//         if(response.status ==200){
//           if(response.body.success != undefined && response.body.success===false){
//            component.courses = [nullCourse] 
//           }
//         }else{
//           component.courses = [];
//         }
//       }
//     )
//     component.ngOnInit();
//     fixture.autoDetectChanges();
//     fixture.whenStable().then(()=>{
//       expect(spy).toHaveBeenCalled();
//       expect(coursespy).toHaveBeenCalled();
//       expect(servicespy).toHaveBeenCalled();
//       expect(component.courses).toEqual([]);
//     })
//   })

//   // test delete courses 

//   // test clicks
//   // it('should toggle event form when clicked', ()=>{

//   // })
// });

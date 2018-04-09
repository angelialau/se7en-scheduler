import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Course } from './../../models/course.model'
import { Schedule } from './../../models/schedule.model'
import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import { Event, Search } from './../../models/event.model';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Injectable()
export class ScheduleService {
  private url : string = "http://devostrum.no-ip.info:6666";
  headers = new HttpHeaders({ 
    'Content-Type': 'application/x-www-form-urlencoded' 
  });
  
  constructor(
    private datePipe: DatePipe,
    private http: HttpClient) { }

  // creating a new schedule
  createSchedule(newSchedule : Schedule): Observable<any>{
    let body = new URLSearchParams(); 
    body.set('trimester', String(newSchedule.trimester)); 
    body.set('year', String(newSchedule.year)); 
    body.set('start', String(newSchedule.startDate)); 
    body.set('end', String(newSchedule.endDate)); 
    let extension = this.url + '/Schedules';
    return this.http.post(extension, body.toString(),
      { headers: this.headers, responseType: 'text' }) 
      .catch(this.handleError); 
  }

  // getting all schedules
  getSchedules(): Observable<Schedule[]>{
    return this.http.get<Schedule[]>(this.url + '/Schedules', { observe: 'response' })
      .catch(this.handleError);
  }

  // getting a specific schedule
  getSchedule(id : number): Observable<any>{
    return this.http.get<Schedule>(this.url + '/Schedules/' + id, { observe: 'response' })
      .catch(this.handleError);
  }

  getGeneratedStatus(id:number) : boolean{
    this.getSchedule(id).subscribe(response => {
      if(response.body.success){
        if(response.body.generated === 1){
          return true;
        }
      }else{
        console.log('getGeneratedStatus error', response);
      }
    })
    return false;
  }

  // get courses under a specific schedule
  getCoursesInSchedule(id: number): Observable<any>{
    return this.http.get<Course[]>(this.url + '/Courses/BySchedule/' + id, {observe: 'response'})
      .catch(this.handleError);
  }

  //updating a specific schedule, whether year, trimester or courses 
  updateSchedule(newSchedule : Schedule): Observable<any>{
    let body = new URLSearchParams(); 
    body.set('trimester', String(newSchedule.trimester)); 
    body.set('year', String(newSchedule.year)); 
    body.set('courses', newSchedule.courses); 
    body.set('id', String(newSchedule.id)); 
    body.set('generated', String(newSchedule.generated)); 
    let extension = this.url + '/Schedules/Update';
    return this.http.post(extension, body.toString(),
      { headers: this.headers, responseType: 'text' }) 
      .catch(this.handleError); 
  }

  //deleting an existing schedule 
  deleteSchedule(schedule : Schedule): Observable<any>{
    let body = new URLSearchParams(); 
    body.set('id', String(schedule.id)); 
    let extension = this.url + '/Schedules/Delete';
    return this.http.post(extension, body.toString(),
      { headers: this.headers, responseType: 'text' }) 
      .catch(this.handleError); 
  }

  getCourse(id: number): Observable<any>{
    return this.http.get<Course>(this.url + '/Courses/' + id, { observe: 'response' })
      .catch(this.handleError);
  }

  addCourse(course : Course): Observable<any>{
    let body = new URLSearchParams(); 
    body.set('schedule_id', String(course.schedule_id)); 
    body.set('term', String(course.term)); 
    body.set('course_no', String(course.course_no)); 
    body.set('course_name', String(course.course_name)); 
    body.set('core', String(course.core)); 
    body.set('no_classes', String(course.no_classes)); 
    body.set('class_size', String(course.class_size)); 
    body.set('no_sessions', String(course.no_sessions)); 
    body.set('sessions_hrs', String(course.sessions_hrs)); 
    body.set('class_types', String(course.class_types)); 
    body.set('instructors', String(course.instructors)); 
    body.set('instructor_ids', String(course.instructor_ids)); 
    body.set('split', String(course.split)); 
    
    let extension = this.url + '/Courses';
    return this.http.post(extension, body.toString(),
      { headers: this.headers, responseType: 'text' }) 
      .catch(this.handleError); 
  }

  updateCourse(courseId: number, course : Course): Observable<any>{
    let body = new URLSearchParams(); 
    body.set('id', String(courseId)); 
    body.set('term', String(course.term)); 
    body.set('course_no', String(course.course_no)); 
    body.set('course_name', String(course.course_name)); 
    body.set('core', String(course.core)); 
    body.set('no_classes', String(course.no_classes)); 
    body.set('class_size', String(course.class_size)); 
    body.set('no_sessions', String(course.no_sessions)); 
    body.set('sessions_hrs', String(course.sessions_hrs)); 
    body.set('class_types', String(course.class_types)); 
    body.set('instructors', String(course.instructors)); 
    body.set('split', String(course.split)); 
    let extension = this.url + '/Courses';
    return this.http.post(extension, body.toString(),
      { headers: this.headers, responseType: 'text' }) 
      .catch(this.handleError); 
  }

  deleteCourse(courseId : number, schedule_id: number): Observable<any>{
    let body = new URLSearchParams(); 
    body.set('schedule_id', String(schedule_id)); 
    body.set('id', String(courseId)); 
    let extension = this.url + '/Courses/Delete';
    return this.http.post(extension, body.toString(),
      { headers: this.headers, responseType: 'text' }) 
      .catch(this.handleError); 
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof Error) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }

  getTodayDate() {
    return this.datePipe.transform(Date.now(), 'yyyy-MM-dd').toString(); 
  }

  getTimeSlots(search: Search): Observable<any>{
    let s = this.url + '/Calendars/Filter/' + search.schedule_id 
    + '/' + search.day + '/' + search.startDate + '/' + search.endDate 
    + '/' + search.startTime + '/' + search.endTime;
    return this.http.get<Course>(s, { observe: 'response' })
      .catch(this.handleError);
  }

  addEvent(event: Event) : Observable<any>{
    let body = new URLSearchParams(); 
    body.set('schedule_id', String(event.schedule_id)); 
    body.set('term', String(event.term)); 
    body.set('pillar', String(event.pillar)); 
    body.set('course', String(event.course)); 
    body.set('prof', String(event.prof)); 
    body.set('prof_id', String(event.prof_id)); 
    body.set('cohort', String(event.cohort)); 
    body.set('location', String(event.location)); 
    body.set('day', String(event.day)); 
    body.set('date', String(event.date)); 
    body.set('start', String(event.start)); 
    body.set('end', String(event.end)); 
    let extension = this.url + '/Calendars';
    return this.http.post(extension, body.toString(),
      { headers: this.headers, responseType: 'text' }) 
      .catch(this.handleError); 
  }

  getEvents(schedule_id: number) : Observable<any>{
    return this.http.get<Course>(this.url + '/Calendars/Events/' + schedule_id, { observe: 'response' })
      .catch(this.handleError);
  }

}

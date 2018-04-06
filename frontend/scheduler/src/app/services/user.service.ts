import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { User } from './../../models/user.model';
import { Announcement } from './../../models/announcement.model';
import { Appeal } from './../../models/appeal.model';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { CookieService } from 'ng2-cookies';

@Injectable()
export class UserService {
  private url : string = "http://devostrum.no-ip.info:6666";
  headers = new HttpHeaders({ 
    'Content-Type': 'application/x-www-form-urlencoded' 
  });

  public atLoginPage : boolean = false;
  private loggedInUser : User = new User("not logged in","password hidden");
  private Cookie;
  
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    ) { }

  getLoggedInUser(){
    let email = this.cookieService.get('email');
    let password = 'password hidden';
    let pillar =  this.cookieService.get('pillar');
    let name =  this.cookieService.get('name');
    let phone =  Number(this.cookieService.get('phone'));
    let id =  Number(this.cookieService.get('id'));
    let schedules =  this.cookieService.get('schedules');
    let courses =  this.cookieService.get('courses');
    this.loggedInUser = new User(email, password, pillar, name, phone, id, schedules, courses);
    return this.loggedInUser;
  }

  // used to reset loggedInUser when user signs out 
  resetUser(){
    this.loggedInUser = new User("not logged in","password hidden");
    this.cookieService.deleteAll();
  }

  getAllUsers(): Observable<any>{
    return this.http.get<User[]>(this.url + '/Users', { observe: 'response' })
      .catch(this.handleError);
  }

  getAllInstructors(): Observable<any>{
    return this.http.get<User[]>(this.url + '/Users/Instructors', { observe: 'response'} )
      .catch(this.handleError);
  }

  getUser(id : number): Observable<User[]>{
    return this.http.get<User[]>(this.url + '/Users/' + id, { observe: 'response' })
      .catch(this.handleError);
  }


  // creating a new user
  postNewUser(newUser : User): Observable<any>{
    let body = new URLSearchParams(); 
    body.set('pillar', String(newUser.pillar)); 
    body.set('name', newUser.name); 
    body.set('email', newUser.email); 
    body.set('phone', String(newUser.phone)); 
    body.set('password', newUser.password); 
    let extension = this.url + '/Users';
    return this.http.post(extension, body.toString(),
      { headers: this.headers, responseType: 'text' }) 
      .catch(this.handleError); 
  }
  
  // @params login email and password 
  // @return user details if successful
  postLogin(email : string, password : string ) : Observable<any>{
    let body = new URLSearchParams(); 
    body.set('email', email.trim()); 
    body.set('password', password); 
    let extension = this.url + '/Users/Login';
    return this.http.post(extension, body.toString(),
      { headers: this.headers, responseType: 'text' }) 
      .catch(this.handleError); 
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    let body = new URLSearchParams(); 
    body.set('id', String(this.loggedInUser.id)); 
    body.set('oldPassword', oldPassword); 
    body.set('newPassword', newPassword); 
    let extension = this.url + '/Users/ChangePassword';
    return this.http.post(extension, body.toString(),
      { headers: this.headers, responseType: 'text' }) 
      .catch(this.handleError); 
  }

  getAnnouncements() : Observable<Announcement[]>{
    return this.http.get<Announcement[]>(this.url + '/Notifications', { observe: 'response'} )
      .catch(this.handleError);
  }

  makeAnnouncements(announcement: Announcement): Observable<any>{
    let body = new URLSearchParams(); 
    body.set('senderId', String(this.loggedInUser.id)); 
    body.set('title', announcement.title); 
    body.set('content', announcement.content); 
    body.set('sender', this.loggedInUser.name);
    console.log('loggedInUser', this.loggedInUser); 
    let extension = this.url + '/Notifications';
    return this.http.post(extension, body.toString(),
      { headers: this.headers, responseType: 'text' }) 
      .catch(this.handleError); 
  }

  deleteAnnouncement(id: number): Observable<any>{
    let body = new URLSearchParams(); 
    body.set('id', String(id)); 
    let extension = this.url + '/Notifications/Delete';
    return this.http.post(extension, body.toString(),
      { headers: this.headers, responseType: 'text' }) 
      .catch(this.handleError); 
  }

  // hides navbar and sidebar if it is the login page
  setAtLoginPage(bool : boolean){
    this.atLoginPage = bool;
  }

  getAtLoginPage(){
    return this.atLoginPage;
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

  makeAppeals(appeal: Appeal): Observable<any>{
    let body = new URLSearchParams();
    body.set('title', appeal.title);
    body.set('content', appeal.content);
    body.set('instructor',this.loggedInUser.name);
    body.set('instructorId', String(this.loggedInUser.id));
    body.set('pillar', this.loggedInUser.pillar);
    body.set('scheduleId', String(this.loggedInUser.id)); //change this to scheduleid
    let extension = this.url + '/Appeals';
    return this.http.post(extension, body.toString(),
      { headers: this.headers, responseType: 'text' }) 
      .catch(this.handleError); 
  }

    getAppeals() : Observable<Appeal[]>{
    return this.http.get<Appeal[]>(this.url + '/Appeals', { observe: 'response'} )
      .catch(this.handleError);
  }

    deleteAppeal(id: number): Observable<any>{
    let body = new URLSearchParams(); 
    body.set('id', String(id)); 
    let extension = this.url + '/Appeals/Delete';
    return this.http.post(extension, body.toString(),
      { headers: this.headers, responseType: 'text' }) 
      .catch(this.handleError); 
  }

  getAppealColumns(): string[]{
    return ["instructor", "pillar", "title", "date"];
  }
}

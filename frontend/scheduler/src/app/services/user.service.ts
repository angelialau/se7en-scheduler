import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { User } from './../../models/user.model'
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  private url : string = "http://devostrum.no-ip.info:6666";
  headers = new HttpHeaders({ 
    'Content-Type': 'application/x-www-form-urlencoded' 
  });

  public atLoginPage : boolean = false;
  private loggedInUser : User = new User("not logged in","password hidden");
  
  constructor(
    private http: HttpClient) { }

  setUser(user: User): boolean{
    this.loggedInUser = user;
    console.log("setUser alr");
    return true;
  }

  getLoggedInUser(){
    return this.loggedInUser;
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
}

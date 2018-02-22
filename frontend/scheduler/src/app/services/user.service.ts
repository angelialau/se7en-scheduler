import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { NewUser } from './../../models/newuser.model'
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
  
  constructor(
    private http: HttpClient) { }

  // creating a new user
  postNewUser(newUser : NewUser): Observable<any>{
    let body = new URLSearchParams(); 
    body.set('admin', String(newUser.admin)); 
    body.set('name', newUser.name); 
    body.set('email', newUser.email); 
    body.set('phone', String(newUser.phone)); 
    body.set('employee_id', String(newUser.employee_id)); 
    body.set('password', newUser.password); 
    let extension = this.url + '/Users';
    return this.http.post(extension, body.toString(),
      { headers: this.headers, responseType: 'text' }) 
      .catch(this.handleError); 
  }
  
  // log in -> if success, returns all user details 
  postUserLogin(employee_id : number, password : string ) : Observable<any>{
    let body = new URLSearchParams(); 
    body.set('employee_id', String(employee_id)); 
    body.set('password', password); 
    let extension = this.url + '/Users/Login';
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
}

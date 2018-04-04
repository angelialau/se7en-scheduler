import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DataFinder } from '../../providers/datafinder';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service'
import { Announcement } from './../../models/announcement.model'
import { User } from './../../models/user.model'
import * as moment from 'moment';

@Injectable()
export class EventService {
    private dataFinder: DataFinder;
    private url: string =  'assets/eventdatainstru.json'; //change this link
    private loggedInUser: User;
    private serverUrl : string = "http://devostrum.no-ip.info:6666";
    headers = new HttpHeaders({ 
      'Content-Type': 'application/x-www-form-urlencoded' 
    });

  constructor(
    private http: HttpClient,
    private userService: UserService,
    ) { 
    this.loggedInUser = this.userService.getLoggedInUser();
  }
  
  public getData(){
      return this.http.get('assets/eventdatainstru.json')
          .catch(this.handleError);
  }

  public getEvents(): Observable<any> {
      return this.http.get(this.url)
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

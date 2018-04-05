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
    private data: any;
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
    this.data = [{
        "title": "Long Event Sudipta",
        "start": "20180307",
        "end": "20180310"
      },
      {
        "title": "Conference Sudipta",
        "start": "20180312T08",
        "end": "20180314T13"
      },
      {
        "title": "Meeting Sudipta",
        "start": "20180319T1030",
        "end": "20180319T1230"
      },
      {
        "title": "Lunch Sudipta",
        "start": "20180319T13",
        "end": "20180319T14"
      },
      {
        "title": "Meeting Sudipta",
        "start": "20180321T1030",
        "end": "20180321T1230"
      },
      {
        "title": "ESC Meeting with Sudipta",
        "start": "20180323T1030",
        "end": "20180323T1230"
      },
      {
        "title": "Lunch Break Sudipta",
        "start": "20180323T1130",
        "end": "20180323T1330"
      },
      {
        "title": "Click for ISTD Website Sudipta",
        "url": "http://istd.edu.sg",
        "start": "20180328T0800",
        "end": "20180328T1700"
      }];

      return this.data;
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

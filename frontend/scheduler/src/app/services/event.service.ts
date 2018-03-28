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
      //const dateObj = new Date();
      //const yearMonth = dateObj.getUTCFullYear() + (dateObj.getUTCMonth() + 1)
      //getUTCMonth() - January represents 0, etc.
      return this.http.get(this.url)
          .catch(this.handleError);
      /*
      let data: any = [
      {
          title: 'Long Event',
          start: moment('20180307'),
          end: moment('20180310')
      },
      {
          title: 'Conference',
          start: '20180312T08',
          end: '20180314T13',
      },
      {
          title: 'Meeting',
          start: moment('20180319T1030'),
          end: moment('20180319T1230')
      },
      {
          title: 'Lunch',
          start: moment('20180319T13'),
          end: moment('20180319T14')
      },
      {
          title: 'Meeting',
          start: moment('20180321T1030'),
          end: moment('20180321T1230')
      },
      {
          title: 'ESC Meeting',
          id: 1,
          start: '10:30',
          end: '12:30',
          dow: [1,5],
          textColor: 'yellow'
      },
      {
          title: 'Click for ISTD Website',
          url: 'http://istd.edu.sg',
          start: moment('20180328'),
          end: moment('20180328')
      }];*/


      // /http://momentjs.com/docs/#/parsing/
      //return Observable.of(data);
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

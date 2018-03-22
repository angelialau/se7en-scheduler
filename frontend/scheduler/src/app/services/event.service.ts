import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as moment from 'moment';

@Injectable()
export class EventService {
    public getEvents(): Observable<any> {
        //const dateObj = new Date();
        //const yearMonth = dateObj.getUTCFullYear() + (dateObj.getUTCMonth() + 1);
        //getUTCMonth() - January represents 0, etc.
       
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
            start: moment('20180323T1030'),
            end: moment('20180323T1230')
        },
        {
            title: 'Click for ISTD Website',
            url: 'http://istd.edu.sg',
            start: moment('20180328'),
            end: moment('20180328')
        }];
        // /http://momentjs.com/docs/#/parsing/
        return Observable.of(data);
    }
};


import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import * as moment from 'moment';
import { EventService } from './../services/event.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
	calendarOptions: Options;
	displayEvent: any;
    @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor(protected eventService: EventService) { }

  ngOnInit() {
    this.eventService.getEvents().subscribe(data => {
      this.calendarOptions = {
        editable: false, //make this true to allow editing of events
        handleWindowResize: true,
        height: 590,
        weekends: false, //to hide weekends
        minTime: moment.duration("08:00:00"), //start time
        maxTime: moment.duration("18:00:00"), //end time
        allDaySlot: false, //remove the all day slot
        defaultView: 'agendaWeek', //show the week view first
        eventLimit: false, // make true for the plus sign

        header: {
          left: 'prev,next',
          center: 'title',
          right: 'month,agendaWeek, agendaDay',
          //right: 'month,agendaWeek,agendaDay,listMonth'
        },
        displayEventTime: true, //Display event
        events: data
      };
    });

  }
  clickButton(model: any) {
    this.displayEvent = model;
  }
  eventClick(model: any) {
    model = {
      event: {
        id: model.event.id,
        start: model.event.start,
        end: model.event.end,
        title: model.event.title,
        allDay: model.event.allDay
        // other params
      },
      duration: {}
    }
    this.displayEvent = model;
  }
  updateEvent(model: any) {
    model = {
      event: {
        id: model.event.id,
        start: model.event.start,
        end: model.event.end,
        title: model.event.title
        // other params
      },
      duration: {
        _data: model.duration._data
      }
    }
    this.displayEvent = model;
  }
}

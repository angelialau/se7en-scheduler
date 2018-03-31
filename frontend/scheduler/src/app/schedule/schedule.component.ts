import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import * as moment from 'moment';
import 'rxjs/add/operator/map'
import { UserService } from './../services/user.service';
import { User } from './../../models/user.model';
import { EventService } from './../services/event.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Appeal} from './../../models/appeal.model'


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
	calendarOptions: Options;
	displayEvent: any;
  user : User = this.userService.getLoggedInUser();
  isAdmin: boolean = false;
  scheduledata: any ;
  specificPillar: string = "ASD"; //default ASD view for admins
  show: boolean = false; //to show Appeal form
  today: string = this.transformDate(Date.now()).toString();
  newAppeal: Appeal = new Appeal(this.user.name, this.user.pillar,this.today);

  
    @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor(
    protected eventService: EventService,
    private userService: UserService,
    private router: Router,
    private datePipe: DatePipe) { }

  ngOnInit() {

    if (this.user.pillar == "Administrator"){
      this.isAdmin = true;
    }
    this.displayCalendar();
  }

  displayCalendar(){


      this.eventService.getEvents().subscribe(data => {

      if (this.user.pillar != "Administrator"){
        for (let i of data){
          if (i.instructor == this.user.name){
            this.scheduledata = i.schedule;
          }
        }
      }

      else { // is Administrator
        var allschedules: Object[] = [];
        for (var i = 0; i < data.length; i++){
          if (data[i].pillar == this.specificPillar){
            for (let j of data[i].schedule){
              allschedules.push(j);
          }}
       }
        console.log(allschedules);
        this.scheduledata = allschedules;

      }
     
       this.calendarOptions = {
        editable: false, //make this true to allow editing of events
        handleWindowResize: true,
        height: 590,
        weekends: false, //to hide weekends
        minTime: moment.duration("08:00:00"), //start time
        maxTime: moment.duration("18:00:00"), //end time
        visibleRange: {
            start: moment('20180201'),
            end: moment('20180430')
         }, //why is this not working :(
        allDaySlot: false, //remove the all day slot
        defaultView: 'agendaWeek', //show the week view first
        eventLimit: false, // make true for the plus sign on month view

        header: {
          left: 'prev,next',
          center: 'title',
          right: 'agendaWeek,agendaDay',
          //right: 'month,agendaWeek,agendaDay,listMonth'
        },
        displayEventTime: true, //Display event
        events: this.scheduledata
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
  displayASD(){
    console.log("ASD calendar view");
    this.specificPillar = "ASD";
    this.displayCalendar();
  }
  displayEPD(){
    console.log("EPD calendar view");
    this.specificPillar = "EPD";

    this.displayCalendar();
  }
  displayESD(){
    console.log("ESD calendar view");
    this.specificPillar = "ESD";

    this.displayCalendar();
  }
  displayISTD(){
    console.log("ISTD calendar view");
    this.specificPillar = "ISTD";
    console.log(this.specificPillar);
    this.displayCalendar();
  }

  showForm(){
    this.show = true;
  }

  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd'); //whatever format you need. 
  }

  initialiseAppeal(){
    this.newAppeal = new Appeal(this.user.name, this.user.pillar,this.today,"","");
  }
}

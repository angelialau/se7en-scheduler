import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { Calendar } from 'fullcalendar';
import * as moment from 'moment';
import 'rxjs/add/operator/map'
import { UserService } from './../services/user.service';
import { User } from './../../models/user.model';
import { EventService } from './../services/event.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Appeal} from './../../models/appeal.model';
import { MatSnackBar } from '@angular/material';
import { CookieService } from 'ng2-cookies';
import { EventObject } from 'fullcalendar';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})

export class ScheduleComponent implements OnInit {
  calendarOptions: Options;
  isAdmin: boolean = false;
  scheduledata: any ;
  fulldataset: any;
  specificPillar: string = "ASD"; //default ASD view for admins
  show: boolean = false; //to show Appeal form
  today: string = this.transformDate(Date.now()).toString();
  newAppeal: Appeal = new Appeal(this.today);
  csvFinal: string;
  googleSchedule: any;
  listCourses: any;
  
   @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor(
    protected eventService: EventService,
    private userService: UserService,
    private router: Router,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private cookieService: CookieService) {}

  ngOnInit() {
    this.initialiseAppeal();

    console.log(this.cookieService.get('name'));

    if (this.cookieService.get('pillar') == "Administrator"){
      this.isAdmin = true;
    }

    this.eventService.getEvents().subscribe(data => {
      this.fulldataset = data;
      if (this.cookieService.get('pillar') != "Administrator"){
        for (let i of data){
          if (i.instructor == this.cookieService.get('name') && i.id == this.cookieService.get('id')){
            this.scheduledata = i.schedule;
          }
        }
      }
      else { // is Administrator
        var allschedules: Object[] = [];
        for (var i = 0; i < data.length; i++){
          if (data[i].pillar == "ASD"){
            for (let j of data[i].schedule){
              allschedules.push(j);
          }}
       }
        this.scheduledata = allschedules;
      }

      this.calendarOptions = {
        editable: false, //make this true to allow editing of events
        handleWindowResize: true,
        height: 590,
        weekends: false, //to hide weekends
        minTime: moment.duration("08:00:00"), //start time
        maxTime: moment.duration("18:00:00"), //end time
        fixedWeekCount: true,
        /*visibleRange: {
            start: '2018-03-01',
            end: '2018-03-15'
         }, //why is this not working :(
        validRange: {
            start: '2018-03-01',
            end: '2018-03-15'
         }, //set this to blank out parts not involved in the term*/
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
        events: this.scheduledata,
        eventRender: function(event, element, view){
        return (event.ranges.filter(function(range){
            return (moment(event.start).isBefore(range.end) &&
                    moment(event.end).isAfter(range.start));
        }).length)>0;
    }
    };
     
     this.listCourses = []
    for (let event of this.scheduledata){
      var course = event.title.replace(/\n/g, " ") + " from " + event.start + " to " + event.end;
      if (event.dow == 1){
        course += " on Mondays";
      }
      else if (event.dow == 2){
        course += " on Tuesdays";
      }
      else if (event.dow == 3){
        course += " on Wednesdays";
      }
      else if (event.dow == 4){
        course += " on Thursdays";
      }
      else if (event.dow == 5){
        course += " on Fridays";
      }

      this.listCourses.push(course);
    }

    console.log(this.listCourses);

    });}


  changeView(){
    var pillarschedules: Object[] = [];
    for (var i = 0; i < this.fulldataset.length; i++){
      if (this.fulldataset[i].pillar == this.specificPillar){
        for (let j of this.fulldataset[i].schedule){
          pillarschedules.push(j);
        }
      }
    }

    this.scheduledata = pillarschedules;

    /* Not elegant but I'll deal with it again
    cus refetchEvents not working... :()
    */
    this.ucCalendar.fullCalendar('removeEvents');
    this.ucCalendar.fullCalendar('addEventSource', this.scheduledata);
    this.ucCalendar.fullCalendar('rerenderEvents');

    }

  displayASD(){
    console.log("ASD calendar view");
    this.specificPillar = "ASD";
    this.changeView();
  }
  displayEPD(){
    console.log("EPD calendar view");
    this.specificPillar = "EPD";
    this.changeView();
  }
  displayESD(){
    console.log("ESD calendar view");
    this.specificPillar = "ESD";
    this.changeView();
  }
  displayISTD(){
    console.log("ISTD calendar view");
    this.specificPillar = "ISTD";
    this.changeView();
  }
  displayHASS(){
    console.log("HASS calendar view");
    this.specificPillar = "HASS";
    this.changeView();
  }

  showForm(){
    if (this.show){
      this.show = false;
    }
    else if (!this.show){
      this.show = true;
    }
  }

  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd'); //whatever format you need. 
  }

  initialiseAppeal(){
    this.newAppeal = new Appeal(this.today);
  }

  makeAppeal(){
    let errorMsg : string = "Something went wrong with making appeal, please try again later!";
    this.userService.makeAppeals(this.newAppeal).subscribe(response =>{
      if (JSON.parse(response).success){
        this.snackBar.open("Appeal made!", null, {duration:1000});
        this.initialiseAppeal();
      }
      else{
        this.snackBar.open(errorMsg,null,{duration:1000});
      }
    }, 
     error => {
       this.snackBar.open(errorMsg, null, {duration:1000});
       console.log("sever error in making appeal");
     })
  }
  downloadCalendar(){
    let errorMsg : string = "Something went wrong with making appeal, please try again later!";
    this.eventService.getGoogleEvents().subscribe(data => {
      for (let i of data){
          if (i.instructor == this.cookieService.get('name') && i.id == this.cookieService.get('id')){
            console.log(i.schedule);
            console.log(Object.keys(i.schedule[1]));
            this.googleSchedule = i.schedule;

            var header = Object.keys(this.googleSchedule[1]);
            console.log(header);
            const replacer = (key, value) => value === null ? '' : value;
            let csv = this.googleSchedule.map(row => header.map(fieldName =>
            JSON.stringify(row[fieldName], replacer)).join(','))
            csv.unshift(header.join(','))
            this.csvFinal = csv.join('\r\n');
            console.log(this.csvFinal);

            var filename = "termschedule.csv"; 
    
            if (!this.csvFinal.match(/^data:text\/csv/i)) {
                this.csvFinal = 'data:text/csv;charset=utf-8,' + this.csvFinal; //data:text/csv;charset=utf-8
            }
        
            var googledata = encodeURI(this.csvFinal);
            var link = document.createElement('a');
            link.setAttribute('href',googledata);
            link.setAttribute('download',filename);
            link.click();

            //window.location.href = "https://calendar.google.com/calendar"
          }
        }
      },
      error => {
        this.snackBar.open(errorMsg, null, {duration:1000});
        console.log("sever error in getting information. Please try again.");
      });
  }
}







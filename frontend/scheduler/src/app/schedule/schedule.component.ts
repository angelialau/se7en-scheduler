import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { Calendar } from 'fullcalendar';
import * as moment from 'moment';
import 'rxjs/add/operator/map'
import { UserService } from './../services/user.service';
import { User } from './../../models/user.model';
import { EventService } from './../services/event.service';
import { WindowService } from './../services/window.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Appeal} from './../../models/appeal.model';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CookieService } from 'ng2-cookies';
import { EventObject } from 'fullcalendar';
import { ScheduleService } from './../services/schedule.service';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})

export class ScheduleComponent implements OnInit {
  calendar_id: number;
  calendarOptions: Options;
  isAdmin: boolean = false;
  scheduledata: any ;
  fulldataset: any;
  specificPillar: string = "EPD"; //default EPD view for admins
  show: boolean = false; //to show Appeal form
  today: string = this.transformDate(Date.now()).toString();
  newAppeal: Appeal = new Appeal(this.today);
  csvFinal: string;
  googleSchedule: any;
  listCourses: any;
  nativeWindow: any;
  calendarstart: any;
  calendarend: any;
  haveSchedule: boolean;
  generated:boolean = false;
  isFinalised: boolean = false;
  
   @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor(
    protected eventService: EventService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private windowService: WindowService,
    private scheduleService: ScheduleService,) {
    this.nativeWindow = windowService.getNativeWindow();
    this.calendar_id = route.snapshot.params['calendar_id'];
  }

  ngOnInit() {
    this.initialiseAppeal();

    this.scheduleService.getSchedule(this.calendar_id).subscribe(data =>{
      if (data.body.generated === "1"){
        this.generated = true;
      }
      if (data.body.finalized === "1"){
        this.isFinalised = true;
      }
    });

    this.eventService.getDates(this.calendar_id).subscribe(data =>{
      this.calendarstart = data.startDate.substring(0,10);
      this.calendarend = data.endDate.substring(0,10);
    });

    if (this.cookieService.get('pillar') == "Administrator"){
      this.isAdmin = true;
    }

    this.eventService.getEvents(this.calendar_id).subscribe(data => {
      this.fulldataset = data;
      var allschedules: Object[] = [];
      if (this.cookieService.get('pillar') != "Administrator"){
        for (let i of data){
          if (i.prof_id == this.cookieService.get('id')){
            allschedules.push(i.schedule);
          }
        }
        this.scheduledata = allschedules;
        if (this.scheduledata.length != 0){
          this.haveSchedule = true;
        }
      }
      else { // is Administrator
        this.haveSchedule = true;
        for (var i = 0; i < data.length; i++){
          if (data[i].pillar == "EPD"){
              allschedules.push(data[i].schedule);
          }
       }
        this.scheduledata = allschedules;
      }

      this.calendarOptions = {
        editable: false, //make this true to allow editing of events
        //eventStartEditable: true,
        handleWindowResize: true,
        height: 590,
        weekends: false, //to hide weekends
        minTime: moment.duration("08:00:00"), //start time
        maxTime: moment.duration("18:00:00"), //end time
        fixedWeekCount: true,
        visibleRange: {
            start: this.calendarstart,
            end: this.calendarend
         }, //why is this not working :(
        validRange: {
            start: this.calendarstart,
            end: this.calendarend
         }, //set this to blank out parts not involved in the term
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
        /*eventRender: function(event, element, view){
        return (event.ranges.filter(function(range){
            return (moment(event.start).isBefore(range.end) &&
                    moment(event.end).isAfter(range.start));
        }).length)>0;
    }*/
    };
     
     this.listCourses = []
    for (let event of this.scheduledata){
      var course = event.title.substring(0,6) + " - " + event.start + " to " + event.end;
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
    });}

  changeView(){
    var pillarschedules: Object[] = [];
    for (var i = 0; i < this.fulldataset.length; i++){
      if (this.fulldataset[i].pillar == this.specificPillar){
        pillarschedules.push(this.fulldataset[i].schedule);
        
      }
    }

    this.scheduledata = pillarschedules;
    let emptyMsg : string = "No schedule for this pillar."
    if (this.scheduledata.length == 0){
      this.snackBar.open(emptyMsg, null, {duration:2000});
    }

    /* Not elegant but I'll deal with it again
    cus refetchEvents not working... :()
    */
    this.ucCalendar.fullCalendar('removeEvents');
    this.ucCalendar.fullCalendar('addEventSource', this.scheduledata);
    this.ucCalendar.fullCalendar('rerenderEvents');

    }
  displayEPD(){
    this.specificPillar = "EPD";
    this.changeView();
  }
  displayESD(){
    this.specificPillar = "ESD";
    this.changeView();
  }
  displayISTD(){
    this.specificPillar = "ISTD";
    this.changeView();
  }
  displayHASS(){
    this.specificPillar = "HASS";
    this.changeView();
  }
  displayTech(){
    this.specificPillar = "Tech Elective";
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
    this.userService.makeAppeals(this.newAppeal, this.calendar_id).subscribe(response =>{
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
    this.eventService.getGoogleEvents(this.calendar_id).subscribe(data => {
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
          }
        }
      },
      error => {
        this.snackBar.open(errorMsg, null, {duration:1000});
        console.log("sever error in getting information. Please try again.");
      });
  }

  openDialog(){
     var newWindow = this.nativeWindow.open("https://calendar.google.com/calendar/r/settings/export");
     }

  return(){
    if (this.isAdmin){
      this.router.navigateByUrl("/schedules");
    }
    else{
      this.router.navigateByUrl("/viewcalendar");
    }
  }

  finaliseCalendar(){
    let errorMsg : string = "Something went wrong with finalizing, please try again later!";
    this.eventService.finalizeSchedule(this.calendar_id).subscribe(
      response =>{
        while (response.byteLoaded <= response.totalBytes){
          console.log("loading...");
        }
        this.snackBar.open("Finalized",null,{duration:1000});
        this.router.navigateByUrl("/schedules");
      })
  }
  
}







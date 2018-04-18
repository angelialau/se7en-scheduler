import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from './../services/event.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-changecalendar',
  templateUrl: './changecalendar.component.html',
  styleUrls: ['./changecalendar.component.css']
})
export class ChangecalendarComponent implements OnInit {
	calendar_id: number;
	calendarOptions: Options;
 	displayEvent: any;
 	daychanged: any;
 	calendarstart: any;
 	specificPillar: string = "EPD"; //default EPD view for admins
 	scheduledata: any;
 	fulldataset: any;

  	@ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  	constructor(
  	private route: ActivatedRoute,
    private router: Router,
    protected eventService: EventService,
    public snackBar: MatSnackBar, ) {
  	this.calendar_id = route.snapshot.params['calendar_id']; }

  	ngOnInit() {

  	this.eventService.getDates(this.calendar_id).subscribe(data =>{
      this.calendarstart = data.startDate.substring(0,10);
    });

	this.eventService.getEditEvents(this.calendar_id).subscribe(data => {
		this.fulldataset = data;
		var allschedules: Object[] = [];
		for (var i = 0; i < data.length; i ++){
			if (data[i].pillar == "EPD"){
				allschedules.push(data[i].schedule);
			}
		}
		console.log(allschedules);
		this.scheduledata = allschedules;
      this.calendarOptions = {
        editable: true,
        eventLimit: false,
        handleWindowResize: true,
        height: 590,
        allDaySlot: false,
        weekends: false, //to hide weekends
        minTime: moment.duration("08:00:00"), //start time
        maxTime: moment.duration("18:00:00"), //end time
        defaultView: 'agendaWeek',
        visibleRange: {
            start: this.calendarstart,
            end: moment(this.calendarstart).add(7,'d'),
         }, 
        validRange: {
            start: this.calendarstart,
            end: moment(this.calendarstart).add(7,'d'),
         },
        header: {
        	left: '',
          center: 'title',
          right: 'agendaWeek,agendaDay'
        },
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
      duration: {},
      hello: {}
    }
    this.displayEvent = model;
  }

  updateEvent(model: any) {
  	var newEventId = model.event.id;
  	var newEventDate = moment(moment(model.event.start).format().substring(0,10));
  	var dow = newEventDate.day();
  	var newEventStart = moment(model.event.start).format().substring(11,16);
  	var newEventEnd = moment(model.event.end).format().substring(11,16);

  	let errorMessage : string = "There's some problem changing this event. Please try again later!"
    this.eventService.updateEvent(newEventId,dow,newEventStart,newEventEnd).subscribe(response => {
        if (JSON.parse(response).success){
          this.snackBar.open("Event updated!", null, {duration: 1000, });
        }else{
          this.snackBar.open(errorMessage, null, {duration: 1000, });
          console.log(response);
        }
      },
      error => {
        this.snackBar.open(errorMessage, null, {duration: 1000, });
        console.log(error);
      } 
    ); 
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

    this.ucCalendar.fullCalendar('removeEvents');
    this.ucCalendar.fullCalendar('addEventSource', this.scheduledata);
    this.ucCalendar.fullCalendar('rerenderEvents');

    }
}

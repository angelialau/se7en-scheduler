import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
import { ScheduleService } from './../services/schedule.service';
import { User } from './../../models/user.model';
import { Event, Search, days} from './../../models/event.model';
import { ActivatedRoute } from '@angular/router'
import { Course, Session, CourseDetail, courseDetails, class_type, 
  durations, venue_type } from './../../models/course.model';
import { Schedule } from './../../models/schedule.model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  // form related vars
  schedule_id : number;
  days = days;
  instructors : User[]= []; 
  timeslots :  Array<any> = [];
  courseDetails = courseDetails;
  venues : string[] = [];
  dates : string[] = [];
  startTimes : string[] = [];
  endTimes : string[] = [];
  newEvent : Event;
  events : Event[] = [];
  searchForm : Search; 
  // views 
  showEventList : boolean = true;
  showEventForm : boolean = false;
  showDateSelection : boolean = false;
  showTimeSelection : boolean = false;
  showEndSelection : boolean = false;
  

  constructor(
    private userService : UserService,
    private scheduleService: ScheduleService,
    private snackBar : MatSnackBar,
    private route: ActivatedRoute, 
     ) {
    
    }

  ngOnInit() {
    this.schedule_id = this.route.snapshot.params['schedule_id'];
    this.searchForm = new Search(this.schedule_id,'', '','','','');
    this.newEvent = new Event(this.schedule_id);
    this.getInstructors();
    this.refreshTimeSlots();
    this.getEvents();
  }

  // updates list of all time slots
  refreshTimeSlots(){
    this.scheduleService.getTimeSlots(this.searchForm).subscribe(
      response=>{
        if(response.status == 200){
          if(response.body.success == undefined){
            this.timeslots = response.body;
            // console.log('timeslots', this.timeslots);
            this.venues = this.getVenues();
          }
        }else{
          this.snackBar.open('Something went wrong, please try again later!', null, {duration:1000,})
        }
      }, error=>{
        console.log('getting time slots server error');
        console.log(error);
      }
    )   
  }

  // helper funcs
  getVenues(){
    let array : string[] = [];
    for(let venue in this.timeslots){
      if(this.timeslots.hasOwnProperty(venue)){
        array.push(venue);
      }
    }
    this.venues = array;
    return array;
  }

  getDates(){
    let array : string[] = [];
    for(let date in this.timeslots[this.newEvent.location]){
      if(this.timeslots[this.newEvent.location].hasOwnProperty(date)){
        array.push(date);
      }
    }
    this.dates = array;
    this.showDateSelection = true;
    return array;
  }

  getStartTimes(){
    let array : string[] = [];
    let timeslots = this.timeslots;
    let venue = this.newEvent.location;
    let date = this.newEvent.date;
    for(let slot of timeslots[venue][date]){
      let time = this.reverseParseTime(slot);
      array.push(time);
    }
    this.startTimes = array;
    this.showTimeSelection = true;
    return array;
  }

  getEndTimes(){
    let index = this.startTimes.indexOf(this.newEvent.start);
    this.endTimes = this.startTimes;
    this.endTimes = this.endTimes.slice(index+1);
    this.showEndSelection = true;
    return this.endTimes;
  }

  addEvent(){
    this.newEvent.start = String(this.parseTime(this.newEvent.start));
    this.newEvent.end = String(this.parseTime(this.newEvent.end));
    this.newEvent.day = (new Date(this.newEvent.date)).getDay() ;
    if(this.newEvent.pillar===undefined || this.newEvent.pillar === ""){
      this.newEvent.pillar = null;
    }
    if(this.newEvent.prof_id===undefined || this.newEvent.prof_id === ""){
      this.newEvent.prof_id = null;
      this.newEvent.prof = null;
    }else{
      this.newEvent.prof = this.queryInstructors(Number(this.newEvent.prof_id));  
    }
    if(this.newEvent.cohort===undefined){
      this.newEvent.cohort = null;
    }
    this.newEvent.term = null; // not needed
    
    this.scheduleService.addEvent(this.newEvent).subscribe(
      response=>{
        // console.log('debug: event',this.newEvent);
        if(JSON.parse(response).success){
          this.snackBar.open("Event added!", null, {duration:1200});
          this.getEvents();
        }else if(response.body.success != undefined && response.body.success === false){
          this.snackBar.open("Something went wrong with adding your event. Please try again later!", null, {duration:1200});
          console.log("add event error", response);
        }
      }, error =>{
        this.snackBar.open("Something went wrong with the server. Please try again later!", null, {duration:1200});
        console.log(error);
      }
    )
  }

  getEvents(){
    this.scheduleService.getEvents(this.schedule_id).subscribe(
      response => {
        if(response.body.success === undefined || response.body.success === true){
          this.events = response.body;
          this.refreshTimeSlots(); // so that it reflects any events that have just been added. 
        }else{
          this.snackBar.open("There's some problem grabbing the events. Please try again later!", null, {duration: 1000,})
          console.log("get events error", response);
        }
      }, 
      error =>{
        this.snackBar.open("There's some problem with the server. Please try again later!", null, {duration: 1000,})
        console.log("get events server error", error);
      })
  }

  deleteEvent(index: number){
    this.scheduleService.deleteEvent(index).subscribe(
      response =>{
        if(JSON.parse(response).success){
          this.snackBar.open("Deleted event!", null, {duration:1000});
          this.getEvents();
        }else{
          this.snackBar.open("There's some problem with deleting the event. Please try again later!", null, {duration: 1000,})
          console.log("delete event error", response);
        }
      }, error =>{
        this.snackBar.open("There's some problem with the server. Please try again later!", null, {duration: 1000,})
        console.log("delete events server error", error);
      }
    )
  }

  getInstructors(){
    this.userService.getAllInstructors()
    .map((data: any) => {
      // sorts list of instructors in alphabetical order
      this.instructors = data.body.sort(function(a,b) {
        if(a.pillar.localeCompare(b.pillar) === 0){
          return a.name.localeCompare(b.name);
        } else{
          return a.pillar.localeCompare(b.pillar);
        }
      });
    })
    .subscribe(data => {}, 
      error => {
        console.log("getInstructors error"); 
        console.log(error)
      });
  }

  queryInstructors(profId:number){
    for(let i=0; i<this.instructors.length; i++){
      if (this.instructors[i].id==profId){
        return this.instructors[i].name;
      }
    } let error = new Error("instructor to be queried not found");
    error.name = 'NoInstructorForQueryException';
    throw error;
  }

  // from hours to index e.g. 08:30 = 0, 18:00 = 19
  parseTime(time: string): number{
    let ans = -1;
    let hour : number = Number(time.substring(0,2));
    let min : string = time.substring(3,5);
    if(hour<8 || hour>18 || (min!="00" && min!="30") || time =="18:30" || time == "08:00"){
      let error = new Error('invalid time given, should be between 0830 to 1800');
      error.name = 'InvalidTimeException';
      throw error;
    }
    ans = 2 * (hour-8);
    if (min == "00"){
      ans--;
    }
    return ans;
  }

  // from index to hours
  reverseParseTime(n: number): string {
    if(n<0 || n> 19){
      let error = new Error('To reverse parse time, n must be between 0 and 19');
      error.name = 'RevParseOutOfBounds';
      throw error;
    }
    let array = ['08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', 
    '16:00', '16:30', '17:00', '17:30', '18:00'];
    return array[n];
  }

  // Monday is 1, Tues is 2 ...
  parseDate(date: string): number{
    return (new Date(date)).getDay();
  }

  parseDay(){ 
    return days.indexOf(this.searchForm.day) + 1; 
  }

  showForm(){ this.showEventForm = !this.showEventForm};
  showListOfEvents(){ this.showEventList = !this.showEventList};

  get diagnostic() { return JSON.stringify(this.newEvent)};    

}

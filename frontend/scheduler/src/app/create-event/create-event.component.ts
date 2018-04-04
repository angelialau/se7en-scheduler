import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
import { ScheduleService } from './../services/schedule.service';
import { User } from './../../models/user.model';
import { Event, days } from './../../models/event.model';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  schedule_id : number;
  days = days;
  instructors : User[]= []; 
  today : string;
  searchForm : Event; 
  newEvent : Event;
  timeslots : Event[];
  slotChosen : Event;

  constructor(
    private userService : UserService,
    private scheduleService: ScheduleService,
    private route: ActivatedRoute,
     ) {
    this.schedule_id = route.snapshot.params['schedule_id'];
    console.log(this.schedule_id);
    }

  ngOnInit() {
    this.today = this.scheduleService.getTodayDate();
    this.searchForm = new Event(this.schedule_id);
    this.newEvent = new Event(this.schedule_id);
    this.refreshTimeSlots();
    this.getInstructors();
  }

  // updates list of all time slots
  refreshTimeSlots(){
    // http call 
    this.timeslots = [];
    console.log("Create Event: refreshed time slot!");
  }

  searchForTimeSlot(){
    // http request for available slots
    // use slotChosen here 
    this.parseTime(this.searchForm.startTime);
    // this.parseTime(this.searchForm.endTime);
    // this.parseDay(this.searchForm.startDate);
    // this.parseDay(this.searchForm.endDate);
    console.log("Create Event: searching for suitable time slots!");
  }

  selectTimeSlot(){
    // update newEvent fields 
    console.log("Create Event: selected time slot!");
  }

  addEvent(){
    // http request to submit event
    this.parseTime(this.searchForm.startTime);
    this.parseTime(this.searchForm.endTime);
    this.parseDay(this.searchForm.startDate);
    this.parseDay(this.searchForm.endDate);
    console.log("Create Event: added event!");
    console.log(this.newEvent);
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

  public parseTime(time: string): number{
    let ans = -1;
    //830 = 0, 1600 = 19
    let hour : number = Number(time.substring(0,2));
    let min : string = time.substring(3,5);
    if(hour<8 || hour>16 || (min!="00" && min!="30") || time =="16:30" || time == "08:00"){
      let error = new Error('invalid time given, should be between 0830 to 1600');
      error.name = 'InvalidTimeException';
      throw error;
    }
    ans = 2 * (hour-8);
    if (min == "00"){
      ans--;
    }
    // console.log(ans);
    return ans;
  }

  public parseDay(date: Date): number{
    return (new Date(date)).getDay(); // sunday is 0 
  }

  get diagnostic() { return JSON.stringify(this.searchForm)};    

}

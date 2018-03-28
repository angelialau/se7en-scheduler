import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
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

  searchForm : Event; 
  newEvent : Event;
  timeslots : Event[];
  slotChosen : Event;

  constructor(
    private userService : UserService,
    private route: ActivatedRoute,
     ) {
    this.schedule_id = route.snapshot.params['schedule_id'];
    console.log(this.schedule_id);
    }

  ngOnInit() {
    this.searchForm = new Event(this.schedule_id);
    this.newEvent = new Event(this.schedule_id);
    this.refreshTimeSlots();
    this.getInstructors();
  }

  // updates list of all time slots
  refreshTimeSlots(){
    // http call 
    console.log("Create Event: refreshed time slot!");
  }

  searchForTimeSlot(){
    // http request for available slots
    // use slotChosen here 
    console.log("Create Event: searching for suitable time slots!");
  }

  selectTimeSlot(){
    // update newEvent fields 
    console.log("Create Event: selected time slot!");
  }

  addEvent(){
    // http request to submit event
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

  get diagnostic() { return JSON.stringify(this.searchForm)};

}

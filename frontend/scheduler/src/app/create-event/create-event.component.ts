import { Component, OnInit } from '@angular/core';
import { Event, days } from './../../models/event.model';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  days = days;
  newEvent : Event = new Event(null, "undefined day", "undefined time", 0); // form
  constructor() { }

  ngOnInit() {
  }

  get diagnostic() { return JSON.stringify(this.newEvent)};

}

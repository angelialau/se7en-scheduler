import { Component, OnInit } from '@angular/core';
import { Notification } from './../../models/notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  senderName : string = "Subhajit Datta"; // http.get UserById
  notification : Notification = {
    id: 0,
    title: "This is a sample notification message.",
    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    date: "10 Feb 2018",
    sender: 1,
    sendee: 1,
  }
  notifications : Notification[] = [];
  constructor() { 
    for(let i=0; i<3; i++){
      this.notifications.push(this.notification);
    }
  }

  ngOnInit() {
  }

}

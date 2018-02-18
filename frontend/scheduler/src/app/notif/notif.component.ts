import { Component, OnInit } from '@angular/core';
import { Announcement } from './../../models/announcement.model'

@Component({
  selector: 'app-notif',
  templateUrl: './notif.component.html',
  styleUrls: ['./notif.component.css']
})
export class NotifComponent implements OnInit {
  announcement : Announcement = {
    announcementId: 0,
    title: "Term 4 Schedule Planning",
    content: "Dear Instructors, Kindly submit the deets. Thanks. ",
    date: "18 Feb 2018",
    senderId: 1
  }
  a : Announcement[] = [];
  constructor() { 
    for(let i=0; i<5; i++){
      this.a.push(this.announcement);
    }
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserService } from './../services/user.service';
import { Announcement } from './../../models/announcement.model'
import { User } from './../../models/user.model'

@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.css']
})
export class CreateAnnouncementComponent implements OnInit {
  loggedInUser: User = this.userService.getLoggedInUser();
  today: string = this.transformDate(Date.now()).toString();
  newAnnouncement : Announcement = new Announcement(this.loggedInUser.id, this.today);
  
  constructor(
    private userService: UserService,
    private datePipe: DatePipe,
    ) { 
  }

  ngOnInit() {
    this.initialiseAnnouncement();
  }

  makeAnnouncement(){
    console.log("made announcement!");
    this.initialiseAnnouncement();
  }

  initialiseAnnouncement(){
    this.newAnnouncement = new Announcement(this.loggedInUser.id, this.today, "", "");
  }

  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd'); //whatever format you need. 
  }

  get diagnostic() { return JSON.stringify(this.newAnnouncement)};
}

import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserService } from './../services/user.service';
import { Announcement } from './../../models/announcement.model'
import { User } from './../../models/user.model'
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.css']
})
export class CreateAnnouncementComponent implements OnInit {
  // loggedInUser: User = this.userService.getLoggedInUser();
  today: string = this.transformDate(Date.now()).toString();
  newAnnouncement : Announcement = new Announcement(this.today);
  
  constructor(
    private userService: UserService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    ) { 
  }

  ngOnInit() {
    this.initialiseAnnouncement();
  }

  makeAnnouncement(){
    let errorMsg : string = "Something went wrong with making announcement, please try again later!";
    this.userService.makeAnnouncements(this.newAnnouncement)
    .subscribe(
      response => {
        if(JSON.parse(response).success){
          //snackbar
          this.snackBar.open("Announcement made!", null, {duration: 1000});
          this.initialiseAnnouncement(); 
        }else {
          console.log(this.newAnnouncement);
          this.snackBar.open(errorMsg, null, {duration: 1000});
          console.log(response);
        }
      }, 
      error => {
        this.snackBar.open(errorMsg, null, {duration: 1000});
        console.log("Server error in making announcement");
        console.log(error);
      }
    )
  }

  initialiseAnnouncement(){
    this.newAnnouncement = new Announcement(this.today);
  }

  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd'); //whatever format you need. 
  }

  get diagnostic() { return JSON.stringify(this.newAnnouncement)};
}

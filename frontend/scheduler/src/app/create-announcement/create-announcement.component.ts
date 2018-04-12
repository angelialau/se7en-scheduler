import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
import { ScheduleService } from './../services/schedule.service';
import { Announcement } from './../../models/announcement.model'
import { User } from './../../models/user.model'
import { MatSnackBar } from '@angular/material';
import { CookieService } from 'ng2-cookies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.css']
})
export class CreateAnnouncementComponent implements OnInit {
  isAdmin : boolean = false;
  today : string;
  newAnnouncement : Announcement = new Announcement(this.today);
  
  constructor(
    private userService: UserService,
    private scheduleService: ScheduleService,
    private snackBar: MatSnackBar,
    private cookieService: CookieService, 
    private router : Router
    ) { 
    if (this.cookieService.get('pillar') !== 'Administrator'){
      this.router.navigateByUrl('/home');
    }else{
      this.isAdmin = true;
    }
  }

  ngOnInit() {
    this.today = this.scheduleService.getTodayDate();
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

  get diagnostic() { return JSON.stringify(this.newAnnouncement)};
}

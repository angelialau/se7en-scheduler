import { Component, OnInit } from '@angular/core';
import { Announcement } from './../../models/announcement.model';
import { UserService } from './../services/user.service'
import { EventService } from './../services/event.service'

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  announcements : Announcement[] = [];
  
  constructor(
    private userService: UserService,
    private eventService: EventService,
    ) { 
  }

  ngOnInit() {
    this.refreshAnnouncements();
  }

  refreshAnnouncements(){
    
  }
}

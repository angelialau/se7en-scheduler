import { Component, OnInit } from '@angular/core';
import { Notification } from './../../models/notification.model';
import { UserService } from './../services/user.service'

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  newAnnouncement : Notification;
  notifications : Notification[] = [];
  adminId: number;
  constructor(
    private userService: UserService) { 
  }

  ngOnInit() {
    let loggedInUser = this.userService.getLoggedInUser();
    this.newAnnouncement = new Notification(loggedInUser.id);
  }

}

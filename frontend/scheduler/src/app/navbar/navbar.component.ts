import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
import { User } from './../../models/user.model';
import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  administrator : boolean = false;  
  user: User = null;

  constructor(
    private userService: UserService, 
    public snackBar : MatSnackBar) {}

  ngOnInit() {
    this.user = this.userService.getLoggedInUser();
    if (this.user.pillar == "Administrator"){
      this.administrator = true;
    }
  }

  signOut(){
    this.userService.resetUser(this.user);
  }

}

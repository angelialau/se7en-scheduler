import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
import { CookieService } from 'ng2-cookies';
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
    private cookieService: CookieService,
    public snackBar : MatSnackBar) {}

  ngOnInit() {
    if (this.cookieService.get('pillar') == "Administrator"){
      this.administrator = true;
    }
  }

  signOut(){
    this.userService.resetUser(this.user);
    this.cookieService.deleteAll();
  }

}

import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
import { CookieService } from 'ng2-cookies';
import { User } from './../../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  administrator : boolean = false;  
  name: any;

  constructor(
    private userService: UserService, 
    private cookieService: CookieService,
    ) {}

  ngOnInit() {
    if (this.cookieService.get('pillar') == "Administrator"){
      this.administrator = true;
    }
    this.name = this.cookieService.get('name');
  }

  signOut(){
    this.userService.resetUser();
    this.cookieService.deleteAll();
  }

}

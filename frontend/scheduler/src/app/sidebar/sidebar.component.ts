import { Component, OnInit } from '@angular/core';
import { User } from './../../models/user.model';
import { UserService } from './../services/user.service';
import { CookieService } from 'ng2-cookies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
	isAdmin: boolean = false;
	user: User = null;
  constructor(
  	private userService: UserService,
    private cookieService: CookieService,
  	private router: Router,
  	) { }

  ngOnInit() {
  	if (this.cookieService.get('pillar') == "Administrator"){
  		console.log("This is an administrator account.")
  		this.isAdmin = true;
  	}
  	else if (this.cookieService.get('pillar') != undefined){
  		console.log("This is an instructor account.")
  	} 
  }
}

import { Component, OnInit } from '@angular/core';
import { User } from './../../models/user.model';
import { UserService } from './../services/user.service';
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
  	private router: Router
  	) { }

  ngOnInit() {
  	this.user = this.userService.getLoggedInUser();
  	console.log("logged in user details: ", this.user);
  	/*if (this.user.pillar == undefined){
  		this.router.navigateByUrl('/login');
  		console.log("User is not logged in. Redirecting to login page...")
  	}*/
  	if (this.user.pillar == "Administrator"){
  		console.log("This is administrator account.")
  		this.isAdmin = true;
  	}
  	else if (this.user.pillar != undefined){
  		console.log("This is instructor account.")
  	} 
  }
}

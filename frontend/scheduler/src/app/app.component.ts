import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './../models/user.model';
import { UserService } from './services/user.service';
import { CookieService } from 'ng2-cookies';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loggedin : boolean = false; 
  location;

  constructor(
  	public router: Router,
    private cookieService: CookieService,
  	private userService: UserService,
    private snackBar : MatSnackBar,
    ) {
    router.events.subscribe((data:any) => { this.location = data.url; });
  }
  ngOnInit(){
  	if (this.cookieService.get('pillar').length > 1 ){
      this.loggedin = true;
  	}
  	else{
  		this.loggedin = false;
      this.router.navigateByUrl('/login');
      this.snackBar.open("Please log in with your email and password", null, { duration : 1200, })
      console.log("App: User is not logged in. Please login.");
  	}

  }
}

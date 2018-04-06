import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './../models/user.model';
import { UserService } from './services/user.service';
import { CookieService } from 'ng2-cookies';

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
    ) {
    router.events.subscribe((data:any) => { this.location = data.url; });
  }
  ngOnInit(){
  	if (this.cookieService.get('pillar').length > 1 ){
  		console.log(this.cookieService.get('pillar'));
      // this.userService.getLoggedInUser(); //potential log out bug?
      this.loggedin = true;
  	}
  	else{
  		this.loggedin = false;
      this.router.navigateByUrl('/login');
      console.log("App: User is not logged in. Please login.");
  	}

  }
}

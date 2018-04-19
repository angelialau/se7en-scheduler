import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ng2-cookies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
	isAdmin: boolean = false;

  constructor(
    private cookieService: CookieService,
  	private router: Router,
  	) { }

  ngOnInit() {
  	if (this.cookieService.get('pillar') == "Administrator"){
  		this.isAdmin = true;
  	}
  	else if (this.cookieService.get('pillar') != undefined){
  	} 
  }
}

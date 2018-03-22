import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  administrator : boolean = true;  

  constructor(
    private userService: UserService) {}

  ngOnInit() {

  }

  signOut(){
    // this.userService.setUser()
  }

}

import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  administrator : boolean = true;  

  ngOnInit() {

  }

  signOut(){
    localStorage.removeItem("currentUser");
  }

}

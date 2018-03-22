import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loggedin : boolean = true; 

  location;

  constructor(public router: Router) {
    router.events.subscribe((data:any) => { this.location = data.url; });
  }
}

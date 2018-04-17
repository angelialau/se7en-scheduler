import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { MatSnackBar } from '@angular/material';
import { Schedule } from './../../models/schedule.model';
import { ScheduleService } from './../services/schedule.service';
import { CookieService } from 'ng2-cookies';

@Component({
  selector: 'app-view-calendar',
  templateUrl: './view-calendar.component.html',
  styleUrls: ['./view-calendar.component.css']
})
export class ViewCalendarComponent implements OnInit {
	isAdmin: boolean = false;
	schedules : Schedule[];
  	schedule_id: number;

  constructor(
  	public snackBar: MatSnackBar,
    private scheduleService: ScheduleService,
    private route: ActivatedRoute,
    private router: Router, 
    private cookieService: CookieService,
     ) { }

  ngOnInit() {
  	if(this.cookieService.get('pillar')==="Administrator"){
      this.isAdmin = true;
      this.router.navigateByUrl('/home');
    }
    else{
    	this.getSchedules();
    }
  }

  getSchedules(){
    this.scheduleService.getSchedules()
      .subscribe(
        data => {
          this.schedules = data.body.sort(function(a,b) {
            if(a.year - b.year === 0){
              return a.trimester - b.trimester;
            } else{
              return a.year - b.year;
            }
          });
        },
        error => console.log("getSchedules error: " + error)
    );
  }

}

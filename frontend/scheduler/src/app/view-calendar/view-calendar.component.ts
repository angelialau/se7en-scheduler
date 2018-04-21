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
  prof_id : number;

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
    	this.prof_id = Number(this.cookieService.get('id'));
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
          this.filterInvolvedSchedules();
        },
        error => console.log("getSchedules error: " + error)
    );
  }

  filterInvolvedSchedules(){
    let backupSchedules : Schedule[] = this.schedules;
    let newSchedules : Schedule[] = [];
    
    for(let schedule of this.schedules){
      this.scheduleService.getProfsFromSchedule(schedule.id, this.prof_id).subscribe(
        response => {
          if(response.status === 200 && response.body.message!=="no rows found" && schedule.generated == 1){
            newSchedules.push(schedule);
          }
        }, error => {
          this.schedules = backupSchedules;
          console.log("server error checking whether prof is involved in a particular calendar");
          console.log(error);
        }
      )
    }
    this.schedules = newSchedules;
  }

}

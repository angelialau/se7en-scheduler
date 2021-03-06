import { Component, OnInit } from '@angular/core';
import { ScheduleService } from './../services/schedule.service';
import { Schedule } from './../../models/schedule.model';
import { CookieService } from 'ng2-cookies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.css']
})
export class ViewEventsComponent implements OnInit {
  schedule_id : number = -1;
  schedules : Schedule[] = [];

  constructor(
    private scheduleService : ScheduleService,
    private cookieService : CookieService,
    private router : Router,
    ) { }

  ngOnInit() {
    if(this.cookieService.get('pillar') === "Administrator"){
      this.scheduleService.getSchedules()
        .map((data: any) => {
          let temp : Schedule[] = data.body;
          for(let s of temp){
            if (s.finalized == 1 && s.generated != 0){
              this.schedules.push(s);
            }
          }
          this.schedules.sort(function(a,b) {
            if(a.year - b.year === 0){
              return a.trimester - b.trimester;
            } else{
              return a.year - b.year;
            }
          });
        })
        .subscribe(
          response => {},
          error => console.log("getSchedules error: " + error)
      );    
    }else{
      this.router.navigateByUrl('/home');
    }
  

  }
    

}

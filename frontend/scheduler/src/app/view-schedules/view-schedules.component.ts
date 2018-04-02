import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { MatSnackBar } from '@angular/material';
import { Schedule } from './../../models/schedule.model';
import { ScheduleService } from './../services/schedule.service';

@Component({
  selector: 'app-view-schedules',
  templateUrl: './view-schedules.component.html',
  styleUrls: ['./view-schedules.component.css']
})
export class ViewSchedulesComponent implements OnInit {
  showScheduleList : boolean = true;
  showAddScheduleForm : boolean = false;
  schedule : Schedule = new Schedule(null,null);
  schedules : Schedule[];
  schedule_id: number;

  constructor(
    public snackBar: MatSnackBar,
    private scheduleService: ScheduleService,
    private route: ActivatedRoute
     ) { 
  }

  ngOnInit() {
    this.getSchedules();
  }

  onSend(){
    this.scheduleService.createSchedule(this.schedule).subscribe(
      success => {
        console.log("created new schedule!");
        this.snackBar.open("Created schedule!", null, { duration: 1000, });
      }, 
      error =>{
        console.log("could not create schedule!");
        console.log(error);
        this.snackBar.open("Whoops something went wrong with creating schedule!", null, { duration: 1000, });
      }, 
      () => {
        this.getSchedules();
      }
    );
  }

  getSchedules(){
    this.scheduleService.getSchedules()
      .map((data: any) => this.schedules = data.body)
      .subscribe(
        allSchedules => {
          // JSON.stringify(allSchedules); 
        },
        error => console.log("getSchedules error: " + error)
    );
  }

  deleteSchedule(schedule : Schedule){
    this.scheduleService.deleteSchedule(schedule).subscribe(
      success => {
        console.log("deleted schedule!");
        this.snackBar.open("Deleted schedule!", null, { duration: 1000, });
      }, 
      error =>{
        console.log("could not trash schedule!");
        console.log(error);
        this.snackBar.open("Whoops something went wrong with deleting schedule!", null, { duration: 1000, });
      }, 
      () => {
        this.getSchedules();
      }

      )
  }

  showSchedules() { this.showScheduleList = ! this.showScheduleList }
  showScheduleForm() { this.showAddScheduleForm = ! this.showAddScheduleForm }
  get diagnostic() { return JSON.stringify(this.schedules)};

}

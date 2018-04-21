import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { Schedule } from './../../models/schedule.model';
import { Course } from './../../models/course.model';
import { ScheduleService } from './../services/schedule.service';
import { MatSnackBar } from '@angular/material';
import { CookieService } from 'ng2-cookies';

@Component({
  selector: 'app-schedule-details',
  templateUrl: './schedule-details.component.html',
  styleUrls: ['./schedule-details.component.css']
})
export class ScheduleDetailsComponent implements OnInit {
  isAdmin: boolean = false;
  schedule_id : number;
  generated : boolean = false;
  courseIDs : string[] = [];
  courses: Course[] = [];
  noItems : boolean = false;
  showCourseList : boolean = true;
  showEventForm : boolean = false;
  showCourseForm : boolean = false;
  generating: boolean = false;

  constructor(
    private scheduleService: ScheduleService,
    private route: ActivatedRoute, 
    private router: Router,
    public snackBar: MatSnackBar,
    private cookieService: CookieService, 
    ) { 
    this.schedule_id = route.snapshot.params['schedule_id'];
  }

  ngOnInit() {

    if (this.cookieService.get('pillar') == "Administrator"){
      this.isAdmin = true;
    }

    this.scheduleService.getSchedule(this.schedule_id).subscribe(
      response => {
        if(response.status == 200){
          if(response.body.success != undefined && response.body.success===false){
            this.snackBar.open("Some error occurred. Please try again later!", null, {duration: 2000,});
          }else if(response.body.success){
            if(response.body.generated == 1){
              this.generated = true;
            }else{
              this.refreshCourses(); // calendar ungenerated, means we can still add courses
            }
          }
        }
      }
    );
    // this.generated = true; // for testing
  }

  refreshCourses($event?){
    this.getCourses(this.schedule_id);
  }

  // get the metadata of this specific schedule
  getCourses(id: number){
    this.scheduleService.getCoursesInSchedule(id)
    .subscribe( 
      response => {
        if(response.status ==200){
          if(response.body.message === "no rows found"){
            this.noItems = true;
          }else{
            let array : Course[] = response.body;
            this.courses = array;  
          }
        }else{
          console.log("error getting courses for schedule:"); 
          console.log(response);
        }
        
      },
      error => { console.log("error getting courses for schedule:"); 
      console.log(error);}
    )
  }

  deleteCourse(courseId: number){
    let errorMessage : string = "There's some problem deleting this course. Please try again later!";
    this.scheduleService.deleteCourse(courseId, this.schedule_id)
      .subscribe(response => {
        if (JSON.parse(response).success){
          this.snackBar.open("Course deleted!", null, {duration: 2000, });
          this.refreshCourses();
        }else{
          this.snackBar.open(errorMessage, null, {duration: 2000, });
          console.log(response);
        }
      },
      error => {
        this.snackBar.open(errorMessage, null, {duration: 2000, });
        console.log(error);
      } 
    );
    this.refreshCourses();
  }

  showListOfCourses(){ this.showCourseList = !this.showCourseList; }
  showAddEventForm(){ this.showEventForm = !this.showEventForm; }
  showAddCourseForm(){ this.showCourseForm = !this.showCourseForm; }

  generate(){
    this.generating = true;
     let errorMessage : string = "There's some problem generating this schedule. Please try again later!";
    this.scheduleService.generateSchedule(this.schedule_id).subscribe(
      response =>{
        if (!JSON.parse(response).success){
          this.snackBar.open(errorMessage, null, {duration: 2000, });
          console.log(response);
       }
       else{
          console.log("Generated!");
          this.snackBar.open("Schedule is generated!", null, {duration: 2000});
          this.router.navigateByUrl("/schedules");
        }
      },
      error => {
        this.snackBar.open(errorMessage, null, {duration:2000,});
        console.log(error);
      })
  }
}

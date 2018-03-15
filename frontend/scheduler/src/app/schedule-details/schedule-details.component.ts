import { Component, OnInit } from '@angular/core';
import { Schedule } from './../../models/schedule.model';
import { Course } from './../../models/course.model';
import { ScheduleService } from './../services/schedule.service';

@Component({
  selector: 'app-schedule-details',
  templateUrl: './schedule-details.component.html',
  styleUrls: ['./schedule-details.component.css']
})
export class ScheduleDetailsComponent implements OnInit {
  showCourseForm : boolean = false;
  courseIDs : string[] = [];
  courses: Course[] = [];

  constructor(private scheduleService: ScheduleService) { }

  ngOnInit() {
    this.getScheduleDetails(3);
  }

  // get the metadata of this specific schedule
  getScheduleDetails(id: number){
    this.scheduleService.getSchedule(id).subscribe(
      response => {
        if(response.body.success){
          this.courseIDs = response.body.courses.split(",");
          this.pushAllCourses()
        }else {
          console.log("some error in getting the list of enrolled courses:"); 
          console.log(response); 
        }
    }, error => { 
      console.log("some error in getting the list of enrolled courses:"); 
      console.log(error); 
    }
    )
  }

  // retrieves information for a specific course
  getIndivCourse(id: number){
    this.scheduleService.getCourse(id).subscribe(
      response => {
        if(response.body.success){
          let data = response.body;
          // console.log(data);
          let course = new Course(data.schedule_id,data.term,data.course_no,
            data.course_name,data.core,data.no_classes,data.class_size,
            data.no_sessions,data.sessions_hrs,data.class_types,
            data.instructors,data.split,data.id)
          // console.log(course);
          this.courses.push(course);  
        }else{
          console.log("some error in getting indiv course: "); 
          console.log(response)
        }
      }, error => { 
        console.log("some error in getting indiv course: "); 
        console.log(error)
      }
    )
  }

  // populate the list of courses enrolled
  pushAllCourses(){
    for (let courseID of this.courseIDs){
      this.getIndivCourse(Number(courseID));
    }
    console.log(this.courses); 
  }

  showForm(bool: boolean) { this.showCourseForm = bool; }

}

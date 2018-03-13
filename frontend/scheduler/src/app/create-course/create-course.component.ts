import { Component, OnInit } from '@angular/core';
import { FetchAPI } from 'typescript-fetch-api';
import { Course } from './../../models/course.model';
import { ScheduleService } from './../services/schedule.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css']
})
export class CreateCourseComponent implements OnInit {

  // fetch('file.txt')
  // .then(response => response.text())
  // .then(text => console.log(text))
  // outputs the content of the text file

  showAddCourseForm = false;
  newCourse : Course = new Course(null,null,null,null,null,null,null,null);
  courses : Course[];
  istdCourses : string[] = [
    "01.110 Computational Fabrication",
    "01.112 Machine Learning",
    "50.001 Introduction to Information Systems & Programming",
    "50.002 Computation Structures",
    "50.003 Elements of Software Construction",
    "50.004 Introduction to Algorithms",
    "50.005 Computer System Engineering",
    "50.006 User Interface Design and Implementation",
    "50.008 Database Management Systems",
    "50.012 Networks",
    "50.017 Graphics and Visualisation",
    "50.020 Security",
    "50.021 Artificial Intelligence",
    "50.034 Introduction to Probability and Statistics",
    "50.035 Computer Vision"
  ]

  constructor() { }

  ngOnInit() {
  }

  // shows form to add courses
  showForm() {
    this.showAddCourseForm = true;
  }

  // hides form to add courses
  closeForm(){
    this.showAddCourseForm = false;
  }

  // uploads add course form onto server
  onSend(){ 

  }

  // retrieves all server info on courses
  getCourses(){

  }

  // posts a delete request for a specified course to server 
  deleteCourse(){

  }

  get diagnostic() { return JSON.stringify(this.courses)};

}

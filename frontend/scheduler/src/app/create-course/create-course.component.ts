import { Component, OnInit } from '@angular/core';
import { FetchAPI } from 'typescript-fetch-api'

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

  constructor() { }

  ngOnInit() {
  }

}

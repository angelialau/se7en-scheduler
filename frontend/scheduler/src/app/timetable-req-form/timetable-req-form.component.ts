import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-timetable-req-form',
  templateUrl: './timetable-req-form.component.html',
  styleUrls: ['./timetable-req-form.component.css']
})
export class TimetableReqFormComponent implements OnInit {

  reqForm: FormGroup;
  post: any;
  term: number;
  courseType: string = '';
  subjectCode: string = '';
  subjectName: string = '';
  name: string ='';
  description: string = '';
  
  titleAlert: string = 'This field is required';

  constructor(private fb: FormBuilder) { 
    this.reqForm = fb.group({
      'term': [null, Validators.required],
      'courseType': [null, Validators.required],
      'subjectCode': [null, Validators.required],

      'name': [null, Validators.required],
      'description': [null, Validators.compose([Validators.required, 
        Validators.minLength(30), Validators.maxLength(500)])],
      'validate' : ''
    })
  }

  ngOnInit() {
    this.reqForm.get('validate').valueChanges.subscribe(
      (validate)=>{
        if(validate=='1'){
          this.reqForm.get('name').setValidators([Validators.required, Validators.minLength(3)]);
          this.titleAlert = "u need to specify >= 3 char";         
        }
        else{
          this.reqForm.get('name').setValidators(Validators.required);
        }
        this.reqForm.get('name').updateValueAndValidity();
      }
    )
  }

  addPost(post){ // how to test?
    this.term = post.term;
    this.courseType = post.courseType;
    this.subjectCode = post.subjectCode;

    this.name = post.name;
    this.description = post.description;
  }

  keyDownFunction(ev){
    console.log(ev.keyCode);
    if (ev.keyCode ==13){
      if (this.subjectCode == '50.021') this.subjectName = 'Artificial Intelligence';
      if (this.subjectCode == '50.033') this.subjectName = 'Foundations of Game Design and Development';
      else this.subjectName = 'not found';
    }
    
  }

}

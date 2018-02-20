import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-timetable-req-form',
  templateUrl: './timetable-req-form.component.html',
  styleUrls: ['./timetable-req-form.component.css']
})
export class TimetableReqFormComponent implements OnInit {

  rForm: FormGroup;
  post: any;
  description: string = '';
  name: string ='';
  titleAlert: string = 'This field is required';

  constructor(private fb: FormBuilder) { 
    this.rForm = fb.group({
      'name': [null, Validators.required],
      'description': [null, Validators.compose([Validators.required, 
        Validators.minLength(30), Validators.maxLength(500)])],
      'validate' : ''
    })
  }

  ngOnInit() {
    this.rForm.get('validate').valueChanges.subscribe(
      (validate)=>{
        if(validate=='1'){
          this.rForm.get('name').setValidators([Validators.required, Validators.minLength(3)]);
          this.titleAlert = "u need to specify >= 3 char";         
        }
        else{
          this.rForm.get('name').setValidators(Validators.required);
        }
        this.rForm.get('name').updateValueAndValidity();
      }
    )
  }

  addPost(post){
    this.description = post.description;
    this.name = post.name;
  }

}

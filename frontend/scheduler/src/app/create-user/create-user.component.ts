import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewUser } from './../../models/newuser.model';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  modelNewUser = new NewUser(1,'SampleNewAdmin', 'admin@sutd.edu.sg', 97921682, 0, 'password');
  submitted = false;

  onSubmit(){ this.submitted = true};
  get diagnostic() { return JSON.stringify(this.modelNewUser)};


  constructor(private fb : FormBuilder) {
    
  };

  ngOnInit() {
  }

}

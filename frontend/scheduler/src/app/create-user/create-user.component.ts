import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewUser } from './../../models/newuser.model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  modelNewUser= new NewUser(null,null,null,null,null,null);
  submitted : boolean = false;
  message : string = "User account created for ";
  alertRequiredMessage : string = "This field is required";

  onSubmit(){ this.submitted = true};
  
  get diagnostic() { return JSON.stringify(this.modelNewUser)};


  constructor(
    private fb : FormBuilder,
    public snackBar: MatSnackBar ) {
    
  };

  ngOnInit() {
  }

  onClick(name: string){
    let msg : string = this.message + name + "!";
    // this.modelNewUser = new NewUser(-1,"","",-1,-1,"");
    this.snackBar.open(msg, null, {
      duration: 500;
    });

  }
}

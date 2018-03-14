import { Component, OnInit } from '@angular/core';
import { User } from './../../models/user.model';
import { MatSnackBar } from '@angular/material';
import { UserService } from './../services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  modelNewUser = new User(null,null);
  submitted : boolean = false;
  message : string = "User account created for ";
  alertRequiredMessage : string = "This field is required";

  constructor(
    public snackBar: MatSnackBar, 
    private userService: UserService ) {
    
  }

  ngOnInit() {
  }

  onSubmit(){ 
    this.submitted = true;
  }

  openSnackBar(name: string){
    let msg : string = this.message + this.modelNewUser.name + "!";
    this.userService.postNewUser(this.modelNewUser)
    .subscribe(
      success => {
        console.log("successfully posted new user!");
        this.snackBar.open(msg, null, { duration: 500, });
      },
      error => {
        console.log("Error in postNewUser via CreateUserComponent");
        console.log(error);
        this.snackBar.open("Hhm, something went wrong. Really sorry but please try again!", null, { duration: 800, });
      }
    );
  }

  get diagnostic() { return JSON.stringify(this.modelNewUser)};
}

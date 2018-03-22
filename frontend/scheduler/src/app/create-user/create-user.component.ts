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

  createUser(name: string){
    let msg : string = this.message + this.modelNewUser.name + "!";
    let errorMessage: string = "There seems to have been a problem with creating a user, please try again later!";
    this.userService.postNewUser(this.modelNewUser)
    .subscribe(
      response => {
        if(JSON.parse(response.success)){
          this.snackBar.open(msg, null, { duration: 1000, });  
        }else{
          this.snackBar.open(errorMessage, null, { duration: 1000, });  
          console.log("Error in postNewUser via CreateUserComponent");
          console.log(response);
        }
      },
      error => {
        console.log("Error in postNewUser via CreateUserComponent");
        console.log(error);
        this.snackBar.open(errorMessage, null, { duration: 1000, });
      }
    );
  }

  get diagnostic() { return JSON.stringify(this.modelNewUser)};
}
